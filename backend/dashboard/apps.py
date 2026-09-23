from django.apps import AppConfig


class DashboardConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "dashboard"
    verbose_name = "Dashboard"

    def ready(self):
        from . import modules  # noqa: F401  (registers every dashboard module)
