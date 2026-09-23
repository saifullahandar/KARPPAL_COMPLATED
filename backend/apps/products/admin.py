from django.contrib import admin

from .models import Category, Product, ProductImage, ProductSpecification


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1


class ProductSpecificationInline(admin.TabularInline):
    model = ProductSpecification
    extra = 1


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ["name", "slug", "order", "active"]
    list_editable = ["order", "active"]
    search_fields = ["name"]
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ["name", "category", "price", "status", "featured", "order", "updated_at"]
    list_filter = ["status", "featured", "category"]
    list_editable = ["price", "status", "featured", "order"]
    search_fields = ["name", "short_description", "description"]
    prepopulated_fields = {"slug": ("name",)}
    autocomplete_fields = ["category"]
    inlines = [ProductImageInline, ProductSpecificationInline]
    fieldsets = (
        (None, {"fields": ("category", "name", "slug", "image", "status", "featured", "order")}),
        ("Content", {"fields": ("short_description", "description", "tag1", "tag2")}),
        ("Pricing", {"fields": ("price", "currency")}),
        ("SEO", {"fields": ("meta_title", "meta_description"), "classes": ("collapse",)}),
    )
