#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

PORT="${PORT:-6730}"
echo "Starting realtime vote server on http://127.0.0.1:${PORT}"
node realtime-vote-server.js
