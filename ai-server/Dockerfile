# Use Python 3.9 slim image for a smaller build size
FROM python:3.9-slim

# Set working directory inside the container
WORKDIR /app

# Install system dependencies (needed for some ML packages)
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Pre-download the model weights during the build process to speed up container startup
# This ensures Hugging Face downloads happen at build time, not runtime
RUN python -c "from transformers import pipeline; pipeline('zero-shot-classification', model='typeform/distilbert-base-uncased-mnli')"

# Copy the rest of the application code
COPY . .

# Hugging Face Spaces expects traffic on port 7860
ENV PORT=7860
EXPOSE 7860

# Use gunicorn as the production WSGI server with multiple workers for concurrency
# 2-4 workers is a good balance for CPU-based inference
CMD ["gunicorn", "--workers", "2", "--threads", "2", "--timeout", "120", "--bind", "0.0.0.0:7860", "app:app"]
