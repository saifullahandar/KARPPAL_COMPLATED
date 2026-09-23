from django.contrib import admin

from .models import CompanyInfo, Feature, HeroSlide, Statistic


@admin.register(CompanyInfo)
class CompanyInfoAdmin(admin.ModelAdmin):
    fieldsets = (
        ("Identity", {"fields": ("name", "tagline", "logo", "favicon", "founded_year")}),
        ("Content", {"fields": ("description", "mission", "vision")}),
        ("Contact", {"fields": ("email", "phone", "whatsapp", "address", "map_url", "map_image")}),
        ("Social", {"fields": ("facebook_url", "instagram_url", "linkedin_url", "whatsapp_url")}),
    )

    def has_add_permission(self, request):
        return not CompanyInfo.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(HeroSlide)
class HeroSlideAdmin(admin.ModelAdmin):
    list_display = ("title", "order", "active", "updated_at")
    list_filter = ("active",)
    list_editable = ("order", "active")
    search_fields = ("title", "subtitle")


@admin.register(Statistic)
class StatisticAdmin(admin.ModelAdmin):
    list_display = ("label", "value", "icon", "order", "active")
    list_editable = ("order", "active")
    search_fields = ("label",)


@admin.register(Feature)
class FeatureAdmin(admin.ModelAdmin):
    list_display = ("title", "icon", "order", "active")
    list_editable = ("order", "active")
    search_fields = ("title", "text")
