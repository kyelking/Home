# Working in this repo

Two separate things live here:

1. **The store** (`index.html`, `admin.html`, `assets/`): see `README.md`.
2. **Video editing** (`video/`): sources, references, finished clips and the tools to edit them.

## Video editing workflow

- Read `video/EDITING_RULES.md` before touching any video. It holds the user's style and all past corrections.
- Edits are described in plain words. Map them onto `video/tools/edit.py` flags
  (`--cut-pauses`, `--subtitles`, `--aspect 9:16`, `--reframe blur`, `--sub-position`, ...).
- Put raw footage in `video/sources/`, inspiration or brand material in `video/references/`,
  and write outputs only to `video/finished/`. Never overwrite a source.
- **Every time the user corrects a result**, append a row to the *Corrections log* in
  `video/EDITING_RULES.md` and, if it changes a default, update the *Defaults* section too.
  Then re-run the edit with the corrected settings.
- Motion graphics, animated captions or title cards: use the Remotion project in
  `video/tools/remotion/` (render with `--browser-executable /opt/pw-browsers/chromium` in cloud sessions).
- Whisper (faster-whisper) downloads its model from huggingface.co on first use.
  If that host is blocked, ask for an SRT with `--srt` instead of failing silently.
- Test footage: `video/tools/make_test_clip.sh` builds a clip with synthetic speech and pauses.
