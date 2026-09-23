from rest_framework import serializers

from apps.core.i18n import LocalizedSerializerMixin

from .models import GalleryCategory, GalleryItem


class GalleryCategorySerializer(LocalizedSerializerMixin, serializers.ModelSerializer):
    class Meta:
        model = GalleryCategory
        fields = ["id", "name", "slug", "order", "active"]
        read_only_fields = ["slug"]


class GalleryItemSerializer(LocalizedSerializerMixin, serializers.ModelSerializer):
    category = GalleryCategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        source="category", queryset=GalleryCategory.objects.all(), write_only=True, required=False, allow_null=True,
    )

    class Meta:
        model = GalleryItem
        fields = ["id", "title", "description", "image", "category", "category_id", "featured", "order", "active", "created_at"]
