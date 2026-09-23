# Django API + dashboard, served by Gunicorn. Railway builds this with
# Root Directory = backend/.
FROM python:3.13-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    DJANGO_SETTINGS_MODULE=config.settings.production

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

# Collect static files (dashboard + admin CSS/JS) into the image. The key is a
# throw-away used only for this step; the real one is a runtime variable.
RUN DJANGO_SECRET_KEY=build-only-not-a-secret python manage.py collectstatic --noinput

# The app itself runs unprivileged. The entrypoint starts as root only to fix
# ownership of the uploads volume (Railway mounts volumes root-owned), then drops.
RUN useradd --system --no-create-home --uid 10001 app \
    && mkdir -p /app/media /app/logs \
    && chown -R app:app /app/media /app/logs \
    && chmod +x /app/docker-entrypoint.sh

EXPOSE 8000
ENTRYPOINT ["/app/docker-entrypoint.sh"]
