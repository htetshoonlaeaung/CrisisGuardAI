# CrisisGuard AI — FastAPI Backend Dockerfile
# Multi-stage build: installs SWI-Prolog system package + Python dependencies

FROM python:3.11-slim-bullseye AS base

ENV PYTHONUNBUFFERED=1 \
    DEBIAN_FRONTEND=noninteractive

# Install SWI-Prolog runtime (required for pyswip)
RUN apt-get update && apt-get install -y --no-install-recommends \
    swi-prolog \
    swi-prolog-nox \
    build-essential \
    libffi-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]
