#!/usr/bin/env bash
# Запуск synth.py в контейнере qwen3-tts: репо смонтировано в /site, веса — в ~/.cache/huggingface.
set -euo pipefail
SITE="$(cd "$(dirname "$0")/.." && pwd)"
exec docker run --rm --gpus all --user "$(id -u):$(id -g)" \
    -e HF_HOME=/hf -e HOME=/tmp \
    -v "$SITE":/site -v "$HOME/.cache/huggingface":/hf \
    qwen3-tts python /site/tts/synth.py "$@"
