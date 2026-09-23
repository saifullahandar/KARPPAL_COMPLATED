from django.contrib import admin

from .models import Service


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ["name", "icon", "featured", "active", "order"]
    list_editable = ["featured", "active", "order"]
    search_fields = ["name", "short_description"]
    prepopulated_fields = {"slug": ("name",)}
