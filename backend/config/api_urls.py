from django.urls import include, path

urlpatterns = [
    path("auth/", include("apps.accounts.urls")),
    path("analytics/", include("apps.analytics.urls")),
    path("core/", include("apps.core.urls")),
    path("products/", include("apps.products.urls")),
    path("services/", include("apps.services.urls")),
    path("gallery/", include("apps.gallery.urls")),
    path("research/", include("apps.research.urls")),
    path("jobs/", include("apps.jobs.urls")),
    path("exports/", include("apps.exports.urls")),
    path("quality/", include("apps.quality.urls")),
    path("contact/", include("apps.contact.urls")),
]
