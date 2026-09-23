from decouple import config

from .base import *  # noqa: F401,F403

DEBUG = config("DJANGO_DEBUG", default=True, cast=bool)

INTERNAL_IPS = ["127.0.0.1"]

# Browsable API is handy in dev; disabled in production.
REST_FRAMEWORK["DEFAULT_RENDERER_CLASSES"] = (  # noqa: F405
    "rest_framework.renderers.JSONRenderer",
    "rest_framework.renderers.BrowsableAPIRenderer",
)

EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
