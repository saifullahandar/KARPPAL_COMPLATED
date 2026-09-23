import logging

from django.db.models.deletion import ProtectedError
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import exception_handler as drf_exception_handler

logger = logging.getLogger("apps")


def api_exception_handler(exc, context):
    """Wrap DRF's default handler so every API error has a consistent shape:
    {"detail": "...", "errors": {...}} and unexpected 500s never leak a traceback.
    """
    if isinstance(exc, ProtectedError):
        protected = ", ".join(str(obj) for obj in list(exc.protected_objects)[:5])
        return Response(
            {"detail": f"Cannot delete: other records still reference this item ({protected})."},
            status=status.HTTP_409_CONFLICT,
        )

    response = drf_exception_handler(exc, context)

    if response is None:
        logger.exception("Unhandled exception in %s", context.get("view"))
        return None

    if isinstance(response.data, dict) and "detail" in response.data and len(response.data) == 1:
        response.data = {"detail": response.data["detail"]}
    else:
        response.data = {"detail": "Validation failed.", "errors": response.data}

    return response
