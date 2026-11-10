#!/usr/bin/env python3
"""
edit.py - plain-words video edits driven by FFmpeg + faster-whisper.

    "Cut the pauses, add subtitles at the bottom, make it 9:16."
    -> python3 edit.py ../sources/clip.mp4 --cut-pauses --subtitles --aspect 9:16

Steps (each optional):
  1. cut pauses   : ffmpeg silencedetect -> keep only the spoken parts (with padding)
  2. subtitles    : faster-whisper -> SRT, burned in at the bottom (or pass --srt file)
  3. reframe      : crop (default) or blur-pad to 9:16 / 1:1 / 16:9 / 4:5

Output goes to ../finished/<name>-edit.mp4 unless --out is given.
"""
import argparse
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
FINISHED = os.path.normpath(os.path.join(HERE, "..", "finished"))

ASPECTS = {"9:16": (1080, 1920), "1:1": (1080, 1080), "4:5": (1080, 1350), "16:9": (1920, 1080)}


def run(cmd, capture=False):
    print("+", " ".join(cmd) if len(" ".join(cmd)) < 400 else cmd[0] + " ...", file=sys.stderr)
    return subprocess.run(cmd, check=True, text=True,
                          stdout=subprocess.PIPE if capture else None,
                          stderr=subprocess.PIPE if capture else None)


def probe(path):
    out = run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
               "-show_entries", "stream=width,height,codec_type,r_frame_rate",
               "-of", "json", path], capture=True).stdout
    info = json.loads(out)
    dur = float(info["format"]["duration"])
    vid = next(s for s in info["streams"] if s["codec_type"] == "video")
    num, den = vid["r_frame_rate"].split("/")
    return dur, int(vid["width"]), int(vid["height"]), float(num) / float(den)


# ---------------------------------------------------------------- 1. pauses
def detect_silences(path, noise_db, min_pause):
    res = subprocess.run(["ffmpeg", "-hide_banner", "-i", path, "-af",
                          f"silencedetect=noise={noise_db}dB:d={min_pause}", "-f", "null", "-"],
                         text=True, stderr=subprocess.PIPE, stdout=subprocess.DEVNULL)
    starts = [float(m) for m in re.findall(r"silence_start: ([\d.]+)", res.stderr)]
    ends = [float(m) for m in re.findall(r"silence_end: ([\d.]+)", res.stderr)]
    if len(ends) < len(starts):            # silence running to the end of file
        ends.append(None)
    return list(zip(starts, ends))


def speech_segments(silences, duration, pad):
    """Invert silences into (start, end) speech ranges, keeping `pad` seconds around speech."""
    segs, cursor = [], 0.0
    for s, e in silences:
        e = duration if e is None else e
        a, b = cursor, s + pad
        if b - a > 0.05 and s > 0.05:  # skip a clip that opens on silence
            segs.append((max(0.0, a - pad if a > 0 else 0.0), min(duration, b)))
        cursor = e - pad
    if duration - cursor > 0.05:
        segs.append((max(0.0, cursor), duration))
    # merge overlaps created by padding
    merged = []
    for a, b in segs:
        if merged and a <= merged[-1][1]:
            merged[-1] = (merged[-1][0], max(merged[-1][1], b))
        else:
            merged.append((a, b))
    return merged


def cut_pauses(src, dst, noise_db, min_pause, pad):
    duration, *_ = probe(src)
    silences = detect_silences(src, noise_db, min_pause)
    segs = speech_segments(silences, duration, pad)
    kept = sum(b - a for a, b in segs)
    print(f"  pauses: {len(silences)} found, keeping {len(segs)} segments, "
          f"{duration:.1f}s -> {kept:.1f}s", file=sys.stderr)
    if not silences:
        shutil.copy(src, dst)
        return segs
    expr = "+".join(f"between(t,{a:.3f},{b:.3f})" for a, b in segs)
    run(["ffmpeg", "-v", "error", "-y", "-i", src,
         "-vf", f"select='{expr}',setpts=N/FRAME_RATE/TB",
         "-af", f"aselect='{expr}',asetpts=N/SR/TB",
         "-c:v", "libx264", "-preset", "fast", "-crf", "18", "-c:a", "aac", "-b:a", "192k", dst])
    return segs


# ------------------------------------------------------------- 2. subtitles
def fmt_ts(t):
    h, rem = divmod(t, 3600)
    m, s = divmod(rem, 60)
    return f"{int(h):02d}:{int(m):02d}:{int(s):02d},{int(round((s - int(s)) * 1000)):03d}"


def transcribe(path, srt_path, model_size, language, max_words):
    try:
        from faster_whisper import WhisperModel
    except ImportError:
        sys.exit("faster-whisper is not installed: pip3 install faster-whisper")
    try:
        model = WhisperModel(model_size, device="cpu", compute_type="int8")
    except Exception as exc:  # usually: model download blocked / offline
        sys.exit(f"Could not load Whisper model '{model_size}': {exc}\n"
                 "The model is fetched from huggingface.co on first use. "
                 "Run once with internet access, or pass --srt with an existing subtitle file.")
    segments, info = model.transcribe(path, language=language, word_timestamps=True, vad_filter=True)
    print(f"  whisper: language={info.language} model={model_size}", file=sys.stderr)
    # regroup words into short caption chunks (max_words per caption)
    cues, chunk = [], []
    for seg in segments:
        for w in seg.words or []:
            chunk.append(w)
            if len(chunk) >= max_words or w.word.strip().endswith((".", "?", "!")):
                cues.append(chunk)
                chunk = []
    if chunk:
        cues.append(chunk)
    with open(srt_path, "w", encoding="utf-8") as f:
        for i, c in enumerate(cues, 1):
            text = "".join(w.word for w in c).strip()
            f.write(f"{i}\n{fmt_ts(c[0].start)} --> {fmt_ts(c[-1].end)}\n{text}\n\n")
    print(f"  subtitles: {len(cues)} captions -> {srt_path}", file=sys.stderr)


# --------------------------------------------------------------- 3. reframe
def reframe_filter(src_w, src_h, aspect, mode):
    tw, th = ASPECTS[aspect]
    if mode == "crop":
        # crop the center to the target ratio, then scale
        return (f"crop='min(iw,ih*{tw}/{th})':'min(ih,iw*{th}/{tw})',"
                f"scale={tw}:{th}:flags=lanczos")
    # blur-pad: blurred, zoomed copy behind the full original
    return (f"split[bg][fg];[bg]scale={tw}:{th}:force_original_aspect_ratio=increase,"
            f"crop={tw}:{th},boxblur=30:10[bgb];"
            f"[fg]scale={tw}:{th}:force_original_aspect_ratio=decrease[fgs];"
            f"[bgb][fgs]overlay=(W-w)/2:(H-h)/2")


def subtitle_filter(srt, position, font_size, margin):
    align = {"bottom": 2, "center": 5, "top": 8}[position]
    style = (f"Alignment={align},FontName=Arial,FontSize={font_size},Bold=1,"
             f"PrimaryColour=&H00FFFFFF,OutlineColour=&H00000000,BorderStyle=1,Outline=3,"
             f"Shadow=0,MarginV={margin}")
    esc = srt.replace("\\", "\\\\").replace(":", "\\:").replace("'", "\\'")
    return f"subtitles='{esc}':force_style='{style}'"


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("input")
    ap.add_argument("--out", help="output file (default: ../finished/<name>-edit.mp4)")
    ap.add_argument("--cut-pauses", action="store_true", help="remove silences")
    ap.add_argument("--noise-db", type=float, default=-35, help="silence threshold in dB (default -35)")
    ap.add_argument("--min-pause", type=float, default=0.6, help="shortest pause to cut, seconds (default 0.6)")
    ap.add_argument("--pad", type=float, default=0.15, help="seconds of breathing room kept around speech")
    ap.add_argument("--subtitles", action="store_true", help="transcribe and burn in subtitles")
    ap.add_argument("--srt", help="use this SRT instead of running Whisper")
    ap.add_argument("--model", default="base", help="whisper model: tiny/base/small/medium/large-v3")
    ap.add_argument("--language", default=None, help="force language code, e.g. en")
    ap.add_argument("--max-words", type=int, default=6, help="words per caption (default 6)")
    ap.add_argument("--sub-position", choices=["bottom", "center", "top"], default="bottom")
    ap.add_argument("--font-size", type=int, default=16)
    ap.add_argument("--sub-margin", type=int, default=60, help="vertical margin from edge, in ASS units")
    ap.add_argument("--aspect", choices=list(ASPECTS), help="reframe to this ratio")
    ap.add_argument("--reframe", choices=["crop", "blur"], default="crop", help="crop center or blur-pad")
    ap.add_argument("--keep-srt", action="store_true", help="also save the .srt next to the output")
    args = ap.parse_args()

    src = os.path.abspath(args.input)
    if not os.path.exists(src):
        sys.exit(f"no such file: {src}")
    name = os.path.splitext(os.path.basename(src))[0]
    out = os.path.abspath(args.out) if args.out else os.path.join(FINISHED, f"{name}-edit.mp4")
    os.makedirs(os.path.dirname(out), exist_ok=True)

    with tempfile.TemporaryDirectory() as tmp:
        cur = src
        if args.cut_pauses:
            cut = os.path.join(tmp, "cut.mp4")
            cut_pauses(cur, cut, args.noise_db, args.min_pause, args.pad)
            cur = cut

        srt = None
        if args.srt:
            srt = os.path.abspath(args.srt)
        elif args.subtitles:
            srt = os.path.join(tmp, "subs.srt")
            transcribe(cur, srt, args.model, args.language, args.max_words)

        filters = []
        _, w, h, _ = probe(cur)
        if args.aspect:
            filters.append(reframe_filter(w, h, args.aspect, args.reframe))
        if srt:
            filters.append(subtitle_filter(srt, args.sub_position, args.font_size, args.sub_margin))

        if filters:
            run(["ffmpeg", "-v", "error", "-y", "-i", cur, "-vf", ",".join(filters),
                 "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p",
                 "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", out])
        else:
            shutil.copy(cur, out)

        if srt and args.keep_srt:
            shutil.copy(srt, os.path.splitext(out)[0] + ".srt")

    dur, w, h, _ = probe(out)
    print(f"done: {out}  ({w}x{h}, {dur:.1f}s)")


if __name__ == "__main__":
    main()
