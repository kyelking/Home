# Editing rules (my style)

Claude reads this file before every edit and appends a rule each time I correct something.
Plain words are fine. Newest rules at the bottom of each section win over older ones.

## How to describe an edit

Just say it: *"Cut the pauses, add subtitles at the bottom, make it 9:16."*
Claude turns that into:

```
python3 video/tools/edit.py video/sources/<clip>.mp4 --cut-pauses --subtitles --aspect 9:16
```

Finished files go to `video/finished/`. Sources stay untouched in `video/sources/`.

## Defaults (apply to every edit unless I say otherwise)

- Cut pauses longer than 0.6 s. Keep 0.15 s of breathing room around speech.
- Subtitles: bottom of the frame, white, bold, black outline, max 6 words per caption.
- Vertical videos are 9:16 at 1080x1920. Reframe by cropping the center.
- Keep the original audio levels. Never add music unless I ask.
- Export H.264 MP4, CRF 18, AAC 192 kbps.

## Corrections log

Each time I say "no, more like this", add one line here: date, what I said, what changed.

| Date | What I said | Rule we keep |
|---|---|---|
| 2026-11-10 | "Cut the pauses, add subtitles at the bottom, make it 9:16." | These are the defaults above. |

## Things I never want

- No captions covering faces: if the subject is low in frame, use `--sub-position center` sparingly or raise `--sub-margin`.
- No stretched video. Reframing is crop or blur-pad only.
