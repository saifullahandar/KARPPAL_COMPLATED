from rest_framework import serializers

from apps.core.i18n import LocalizedSerializerMixin

from .models import ResearchArticle, ResearchCategory


class ResearchCategorySerializer(LocalizedSerializerMixin, serializers.ModelSerializer):
    class Meta:
        model = ResearchCategory
        fields = ["id", "name", "slug", "order", "active"]
        read_only_fields = ["slug"]


class ResearchArticleListSerializer(LocalizedSerializerMixin, serializers.ModelSerializer):
    category = serializers.SlugRelatedField(slug_field="slug", read_only=True)
    category_name = serializers.SerializerMethodField()
    author_name = serializers.CharField(source="author.get_full_name", read_only=True, default="")

    class Meta:
        model = ResearchArticle
        fields = [
            "id", "title", "slug", "excerpt", "featured_image",
            "category", "category_name", "author_name", "featured", "published_at",
        ]

    def get_category_name(self, obj) -> str:
        return obj.category.get_localized("name", self.request_language) if obj.category else ""


class ResearchArticleDetailSerializer(LocalizedSerializerMixin, serializers.ModelSerializer):
    category = ResearchCategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        source="category", queryset=ResearchCategory.objects.all(), write_only=True, required=False, allow_null=True,
    )
    author_name = serializers.CharField(source="author.get_full_name", read_only=True, default="")

    class Meta:
        model = ResearchArticle
        fields = [
            "id", "title", "slug", "excerpt", "content", "featured_image",
            "category", "category_id", "author_name", "featured", "published", "published_at",
            "meta_title", "meta_description", "created_at", "updated_at",
        ]
        read_only_fields = ["slug", "created_at", "updated_at"]

    def create(self, validated_data):
        validated_data["author"] = self.context["request"].user
        return super().create(validated_data)
