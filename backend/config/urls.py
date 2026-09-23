from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.http import HttpResponse
from django.urls import include, path, re_path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView

from apps.core.media import serve_media


def healthz(request):
    """Liveness probe for the hosting platform. Deliberately touches no database, so a
    database outage cannot also fail the deploy."""
    return HttpResponse("ok", content_type="text/plain")


urlpatterns = [
    path("healthz/", healthz, name="healthz"),
    path("admin/", admin.site.urls),
    path("dashboard/", include("dashboard.urls")),
    path("api/v1/", include("config.api_urls")),
    path("api/v1/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/v1/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
    path("api/v1/redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"),
    # Uploads: public CMS imagery is open, everything else needs a dashboard login
    # (see apps/core/media.py). Used in development and production alike.
    re_path(r"^media/(?P<path>.+)$", serve_media, name="media"),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
