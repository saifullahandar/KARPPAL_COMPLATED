from django.conf import settings
from django.core.exceptions import ValidationError


def validate_file_size(file):
    """Rejects uploads larger than settings.MAX_UPLOAD_SIZE_MB.

    Applied to every ImageField/FileField in the project — without it, Django
    has no default per-file size cap (only DATA_UPLOAD_MAX_MEMORY_SIZE, which
    doesn't meaningfully bound multipart file uploads), so an unauthenticated-
    looking but staff-only upload endpoint could otherwise accept arbitrarily
    large files.
    """
    max_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
    if file.size > max_bytes:
        raise ValidationError(f"File too large. Maximum size is {settings.MAX_UPLOAD_SIZE_MB}MB.")
