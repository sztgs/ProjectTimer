#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

chromium-browser \
  --kiosk \
  --noerrdialogs \
  --disable-infobars \
  --disable-features=CalculateNativeWinOcclusion,IntensiveWakeUpThrottling,TimerThrottlingForBackgroundTabs,FreezeUserAgent \
  --disable-background-timer-throttling \
  --disable-backgrounding-occluded-windows \
  --disable-renderer-backgrounding \
  --disable-background-networking \
  --disable-ipc-flooding-protection \
  "http://localhost:8000/runtime/app-pi.html"
