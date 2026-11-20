FROM nvidia/cuda:12.8.1-base-ubuntu24.04

ENV DEBIAN_FRONTEND=noninteractive PIP_NO_CACHE_DIR=1 PYTHONUNBUFFERED=1
RUN apt-get update && apt-get install -y --no-install-recommends \
        python3 python3-venv ffmpeg sox libsndfile1 \
    && rm -rf /var/lib/apt/lists/*

RUN python3 -m venv /venv
ENV PATH=/venv/bin:$PATH
# Blackwell (RTX 50xx) требует колёса PyTorch под CUDA 12.8
RUN pip install torch torchaudio --index-url https://download.pytorch.org/whl/cu128
RUN pip install qwen-tts soundfile num2words
# Whisper для проверки разборчивости; CTranslate2 берёт cuBLAS/cuDNN из колёс PyTorch
RUN pip install faster-whisper
ENV LD_LIBRARY_PATH=/venv/lib/python3.12/site-packages/nvidia/cublas/lib:/venv/lib/python3.12/site-packages/nvidia/cudnn/lib

WORKDIR /work
