from django.contrib import admin

from .models import ResearchArticle, ResearchCategory


@admin.register(ResearchCategory)
class ResearchCategoryAdmin(admin.ModelAdmin):
    list_display = ["name", "order", "active"]
    list_editable = ["order", "active"]


@admin.register(ResearchArticle)
class ResearchArticleAdmin(admin.ModelAdmin):
    list_display = ["title", "category", "author", "published", "featured", "published_at"]
    list_filter = ["published", "featured", "category"]
    search_fields = ["title", "excerpt", "content"]
    prepopulated_fields = {"slug": ("title",)}
    date_hierarchy = "published_at"
