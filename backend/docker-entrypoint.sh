#!/bin/sh
# Container start-up: prepare uploads, migrate, optionally create the first admin,
# then hand over to Gunicorn as an unprivileged user.
set -u

# A freshly mounted volume is owned by root; the app user must be able to write to it.
if [ "$(stat -c %u /app/media)" != "10001" ]; then
    chown -R 10001:10001 /app/media
fi

run() { setpriv --reuid=10001 --regid=10001 --clear-groups "$@"; }

# A failed migration must not stop the container: crash-looping hides the logs, and
# the previous schema usually still serves the site. Read the error in the deploy logs.
if ! run python manage.py migrate --noinput; then
    echo "WARNING: migrate failed - starting anyway. Fix the error above and redeploy." >&2
fi

# Optional first admin (never resets the password of an existing account).
if [ -n "${DJANGO_SUPERUSER_PASSWORD:-}" ]; then
    run python manage.py seed_admin --if-missing || echo "WARNING: seed_admin failed." >&2
fi

# Railway injects $PORT; 8000 is the local default.
exec setpriv --reuid=10001 --regid=10001 --clear-groups \
    gunicorn config.wsgi:application \
    --bind "0.0.0.0:${PORT:-8000}" \
    --workers "${WEB_CONCURRENCY:-3}" \
    --no-control-socket \
    --access-logfile - --error-logfile -
