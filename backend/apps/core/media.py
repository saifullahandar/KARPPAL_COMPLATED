"""Serves uploaded files, keeping private uploads away from the public.

Everything lives under MEDIA_ROOT, but only the folders below are meant for the
public website (its <img> tags link at them directly). Anything else -- job
application resumes, staff avatars -- is only served to signed-in dashboard
staff, and a guessed URL answers 404 instead of revealing that the file exists.

A new upload_to= folder that holds personal data must stay OUT of this list.
"""
from pathlib import Path

from django.conf import settings
from django.http import FileResponse, Http404
from django.utils._os import safe_join

PUBLIC_MEDIA_DIRS = frozenset(
    {"company", "hero_slides", "gallery", "categories", "products", "research", "news"}
)


def serve_media(request, path):
    # Resolve first, then classify: judging the raw URL would let "gallery/../avatars/x"
    # pass as a public folder while actually pointing at a private one.
    try:
        full_path = Path(safe_join(settings.MEDIA_ROOT, path)).resolve()
        relative = full_path.relative_to(Path(settings.MEDIA_ROOT).resolve())
    except (ValueError, OSError):  # traversal outside MEDIA_ROOT
        raise Http404 from None

    is_public = relative.parts[0] in PUBLIC_MEDIA_DIRS if relative.parts else False
    user = request.user
    if not is_public and not (user.is_authenticated and user.is_dashboard_staff):
        raise Http404

    try:
        handle = open(full_path, "rb")
    except OSError:  # missing file, or a directory
        raise Http404 from None

    response = FileResponse(handle, as_attachment=not is_public)
    response["Cache-Control"] = "public, max-age=3600" if is_public else "private, no-store"
    return response
