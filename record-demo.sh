#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")"
PROJECT="$(pwd)"

echo "==> ZYMIX ACT 3 video recorder"
mkdir -p video-output

if ! lsof -iTCP:5195 -sTCP:LISTEN >/dev/null 2>&1; then
  echo "==> Starting dev server on :5195"
  npm run dev -- --host 127.0.0.1 --port 5195 >/tmp/zymix-dev-5195.log 2>&1 &
  sleep 3
fi

if ! node -e "require('playwright')" >/dev/null 2>&1; then
  echo "==> Installing playwright..."
  npm install -D playwright
fi

FFMPEG_BIN="$HOME/Library/Caches/ms-playwright/ffmpeg-"*/ffmpeg-mac
if ! ls $FFMPEG_BIN >/dev/null 2>&1; then
  echo "==> Installing Playwright ffmpeg (required for video recording)..."
  npx playwright install ffmpeg
fi

echo "==> Recording 90s demo (uses system Google Chrome)..."
DEMO_URL="http://127.0.0.1:5195/?demo=video&autoplay=1" node scripts/record-act3.mjs

WEBM=$(find video-output -name "*.webm" -type f | head -1)
if [ -z "$WEBM" ]; then
  echo "ERROR: No video file produced."
  exit 1
fi

OUT="$PROJECT/video-output/act3-demo.webm"
if [ "$WEBM" != "$OUT" ]; then
  mv "$WEBM" "$OUT"
fi

if command -v ffmpeg >/dev/null 2>&1; then
  echo "==> Converting to MP4..."
  ffmpeg -y -i "$OUT" -c:v libx264 -crf 18 "$PROJECT/video-output/act3-demo.mp4"
  echo "DONE: $PROJECT/video-output/act3-demo.mp4"
  open "$PROJECT/video-output"
else
  echo "DONE: $OUT"
  echo "(Install ffmpeg for MP4: brew install ffmpeg)"
  open "$PROJECT/video-output"
fi
