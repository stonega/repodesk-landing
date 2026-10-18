#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."
bun x playwright install chromium

if [[ "$(uname -s)" == Linux ]] && command -v apt-get >/dev/null; then
  browser=$(bun -e 'import { chromium } from "@playwright/test"; console.log(chromium.executablePath());')
  if ldd "$browser" | grep 'not found' >/dev/null; then
    cache="$PWD/node_modules/.cache/repodesk-browser"
    mkdir -p "$cache/lists/partial" "$cache/archives/partial" "$cache/log" "$cache/root"
    printf '#clear APT::Update::Post-Invoke;\n#clear APT::Update::Post-Invoke-Success;\n#clear DPkg::Post-Invoke;\n' > "$cache/apt.conf"
    apt_options=(
      -c "$cache/apt.conf"
      -o "Dir::State::lists=$cache/lists"
      -o "Dir::Cache=$cache"
      -o "Dir::Cache::archives=$cache/archives"
      -o "Dir::Log=$cache/log"
      -o Debug::NoLocking=1
    )
    apt-get "${apt_options[@]}" update
    apt-get "${apt_options[@]}" --yes --download-only --no-install-recommends install \
      libglib2.0-0 libnss3 libnspr4 libatk1.0-0 libatk-bridge2.0-0 \
      libdbus-1-3 libx11-6 libxcomposite1 libxdamage1 libxext6 libxfixes3 \
      libxrandr2 libgbm1 libxcb1 libxkbcommon0 libasound2 libatspi2.0-0 \
      libcairo2 libpango-1.0-0 libcups2 fonts-liberation
    for archive in "$cache/archives/"*.deb; do
      dpkg-deb --extract "$archive" "$cache/root"
    done
    architecture="$(uname -m)-linux-gnu"
    export LD_LIBRARY_PATH="$cache/root/usr/lib/$architecture:$cache/root/lib/$architecture${LD_LIBRARY_PATH:+:$LD_LIBRARY_PATH}"
    cat > "$cache/fonts.conf" <<FONTCONFIG
<?xml version="1.0"?>
<fontconfig>
  <dir>$cache/root/usr/share/fonts</dir>
  <dir>/usr/share/fonts</dir>
  <cachedir>$cache/font-cache</cachedir>
  <alias><family>sans-serif</family><prefer><family>Liberation Sans</family></prefer></alias>
  <alias><family>serif</family><prefer><family>Liberation Serif</family></prefer></alias>
  <alias><family>monospace</family><prefer><family>Liberation Mono</family></prefer></alias>
</fontconfig>
FONTCONFIG
    export FONTCONFIG_FILE="$cache/fonts.conf"
    if ldd "$browser" | grep 'not found' >/dev/null; then
      ldd "$browser"
      exit 1
    fi
  fi
fi

bun run test:browser
