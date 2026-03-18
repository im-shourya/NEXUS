FROM python:3.11-slim

# Install system dependencies for OpenCV and ffmpeg
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python dependencies first (for Docker cache)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy all ML code
COPY . .

# Create uploads directory for temporary video storage
RUN mkdir -p uploads

# Expose port (Render sets $PORT dynamically)
EXPOSE 10000

# Start with gunicorn for production
CMD ["sh", "-c", "gunicorn server:app --bind 0.0.0.0:${PORT:-10000} --timeout 300 --workers 2"]
