#!/usr/bin/env bash
# Makes a 16:9 test clip with synthetic speech separated by long pauses,
# so the editing pipeline can be checked without real footage.
# Usage: ./make_test_clip.sh [output.mp4]
set -euo pipefail
OUT="${1:-../sources/test-clip.mp4}"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

say() { ffmpeg -v error -y -f lavfi -i "flite=text='$1':voice=slt" -ar 16000 -ac 1 "$2"; }
say "Welcome to the channel. Today we are testing the editor."   "$TMP/a.wav"
say "First it cuts the long pauses, then it adds subtitles."     "$TMP/b.wav"
say "Finally it turns the video vertical. Thanks for watching."  "$TMP/c.wav"
ffmpeg -v error -y -f lavfi -i anullsrc=r=16000:cl=mono -t 2.5 "$TMP/gap.wav"

printf "file '%s'\n" "$TMP/gap.wav" "$TMP/a.wav" "$TMP/gap.wav" "$TMP/b.wav" "$TMP/gap.wav" "$TMP/c.wav" "$TMP/gap.wav" > "$TMP/list.txt"
ffmpeg -v error -y -f concat -safe 0 -i "$TMP/list.txt" "$TMP/speech.wav"
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$TMP/speech.wav")

mkdir -p "$(dirname "$OUT")"
ffmpeg -v error -y -f lavfi -i "testsrc2=size=1920x1080:rate=30" -i "$TMP/speech.wav" \
  -t "$DUR" -c:v libx264 -pix_fmt yuv420p -c:a aac -shortest "$OUT"
echo "wrote $OUT ($DUR s)"
