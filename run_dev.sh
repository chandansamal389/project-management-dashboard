#!/usr/bin/env bash
set -e

echo "Starting PulseFlow Project Management Dashboard..."
cd "$(dirname "$0")"

npm run dev
