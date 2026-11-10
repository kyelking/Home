# Video editing workspace

| Folder | Purpose |
|---|---|
| `sources/` | Raw footage. Never edited in place. |
| `references/` | Inspiration clips, brand assets, fonts, example edits. |
| `finished/` | Exported videos (and their `.srt` files). |
| `tools/` | `edit.py` (FFmpeg + Whisper pipeline), `make_test_clip.sh`, `remotion/` (motion graphics). |

Media files in `sources/`, `references/` and `finished/` are git-ignored on purpose.
Style rules and the corrections log live in `EDITING_RULES.md`.

## Install

```bash
# FFmpeg (Ubuntu/Debian; macOS: brew install ffmpeg)
sudo apt-get install -y ffmpeg

# Whisper (CPU-friendly build). Downloads its model from huggingface.co on first run.
pip3 install faster-whisper

# Remotion
cd video/tools/remotion && npm install
```

## Check everything runs

```bash
ffmpeg -version | head -1
python3 -c "from faster_whisper import WhisperModel; WhisperModel('base', compute_type='int8'); print('whisper ok')"
cd video/tools/remotion && npx remotion compositions src/index.ts
```

## Edit a clip in plain words

"Cut the pauses, add subtitles at the bottom, make it 9:16."

```bash
python3 video/tools/edit.py video/sources/clip.mp4 --cut-pauses --subtitles --aspect 9:16
# -> video/finished/clip-edit.mp4
```

Useful variations: `--reframe blur` (no cropping, blurred bars), `--sub-position center`,
`--model small` (better subtitles, slower), `--srt my.srt` (skip Whisper), `--keep-srt`.

Try it without real footage: `video/tools/make_test_clip.sh` then run the command above on
`video/sources/test-clip.mp4`.
