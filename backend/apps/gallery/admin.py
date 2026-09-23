from django.contrib import admin

from .models import GalleryCategory, GalleryItem


@admin.register(GalleryCategory)
class GalleryCategoryAdmin(admin.ModelAdmin):
    list_display = ["name", "order", "active"]
    list_editable = ["order", "active"]


@admin.register(GalleryItem)
class GalleryItemAdmin(admin.ModelAdmin):
    list_display = ["title", "category", "featured", "active", "order", "created_at"]
    list_filter = ["category", "featured", "active"]
    list_editable = ["featured", "active", "order"]
    search_fields = ["title", "description"]
