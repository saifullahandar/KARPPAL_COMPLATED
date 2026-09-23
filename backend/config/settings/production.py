from decouple import Csv, config
from django.core.exceptions import ImproperlyConfigured

from .base import *  # noqa: F401,F403

DEBUG = False

# Refuse to boot with the development fallback key: anyone who knows it can forge
# sessions. (The Docker image build passes a throw-away key just for collectstatic.)
if SECRET_KEY.startswith("dev-insecure"):  # noqa: F405
    raise ImproperlyConfigured("DJANGO_SECRET_KEY must be set to a long random value in production.")

# Railway public domains and its private network always work; custom domains go in
# DJANGO_ALLOWED_HOSTS.
ALLOWED_HOSTS = [*ALLOWED_HOSTS, ".railway.app", ".railway.internal"]  # noqa: F405

# The dashboard lives on this service's own origin, so this is only needed if it is
# ever served from a different one.
CSRF_TRUSTED_ORIGINS = config("CSRF_TRUSTED_ORIGINS", default="", cast=Csv())

REST_FRAMEWORK["DEFAULT_RENDERER_CLASSES"] = ("rest_framework.renderers.JSONRenderer",)  # noqa: F405

# Static files (dashboard + admin CSS/JS) are served by WhiteNoise, so no second web
# server is needed. It must sit directly after SecurityMiddleware. Plain compressed
# storage on purpose: the hashed "Manifest" variant fails collectstatic on the vendored
# Chart.js file, which points at a source map that is not shipped.
MIDDLEWARE.insert(1, "whitenoise.middleware.WhiteNoiseMiddleware")  # noqa: F405
STORAGES = {
    "default": {"BACKEND": "django.core.files.storage.FileSystemStorage"},
    "staticfiles": {"BACKEND": "whitenoise.storage.CompressedStaticFilesStorage"},
}

# Hardened security for real deployments (assumes HTTPS termination in front).
# Railway terminates TLS and forwards the original scheme in X-Forwarded-Proto; without
# this Django sees plain HTTP behind the proxy and redirects forever.
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
SECURE_SSL_REDIRECT = config("SECURE_SSL_REDIRECT", default=True, cast=bool)
# The platform health probe is plain HTTP; a redirect would mark every deploy failed.
SECURE_REDIRECT_EXEMPT = [r"^healthz/$"]
# Secure cookies/HSTS follow the redirect switch so the stack can also be tried over
# plain http://localhost with Docker Compose (which sets it to False). Real
# deployments leave it at the default (True).
SESSION_COOKIE_SECURE = SECURE_SSL_REDIRECT
CSRF_COOKIE_SECURE = SECURE_SSL_REDIRECT
SECURE_HSTS_SECONDS = 60 * 60 * 24 * 30 if SECURE_SSL_REDIRECT else 0
SECURE_HSTS_INCLUDE_SUBDOMAINS = SECURE_SSL_REDIRECT
SECURE_HSTS_PRELOAD = SECURE_SSL_REDIRECT
SECURE_BROWSER_XSS_FILTER = True

CORS_ALLOW_ALL_ORIGINS = False  # never allow all origins in production

EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = config("EMAIL_HOST", default="")
EMAIL_PORT = config("EMAIL_PORT", default=587, cast=int)
EMAIL_USE_TLS = config("EMAIL_USE_TLS", default=True, cast=bool)
EMAIL_HOST_USER = config("EMAIL_HOST_USER", default="")
EMAIL_HOST_PASSWORD = config("EMAIL_HOST_PASSWORD", default="")

# Containers have a throw-away filesystem: log to stdout/stderr (Railway's log viewer),
# not to files under /app that vanish on every deploy.
for _logger in LOGGING["loggers"].values():  # noqa: F405
    _logger["handlers"] = ["console"]
del LOGGING["handlers"]["file"]  # noqa: F405
