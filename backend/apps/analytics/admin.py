from django.contrib import admin

from .models import PageView


@admin.register(PageView)
class PageViewAdmin(admin.ModelAdmin):
    """Read-only in Django admin — rows are only ever created by the public
    tracking endpoint, never hand-entered or edited."""

    list_display = ["path", "visitor_id", "device_category", "browser_category", "created_at"]
    list_filter = ["device_category", "browser_category", "date"]
    search_fields = ["path", "visitor_id"]
    date_hierarchy = "created_at"
    readonly_fields = [f.name for f in PageView._meta.fields]

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False
