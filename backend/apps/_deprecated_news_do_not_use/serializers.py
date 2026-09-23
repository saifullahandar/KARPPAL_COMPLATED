from rest_framework import serializers

from .models import NewsArticle, NewsCategory


class NewsCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsCategory
        fields = ["id", "name", "slug", "order", "active"]
        read_only_fields = ["slug"]


class NewsArticleListSerializer(serializers.ModelSerializer):
    category = serializers.SlugRelatedField(slug_field="slug", read_only=True)
    category_name = serializers.CharField(source="category.name", read_only=True, default="")
    author_name = serializers.CharField(source="author.get_full_name", read_only=True, default="")

    class Meta:
        model = NewsArticle
        fields = [
            "id", "title", "slug", "excerpt", "featured_image",
            "category", "category_name", "author_name", "featured", "published_at",
        ]


class NewsArticleDetailSerializer(serializers.ModelSerializer):
    category = NewsCategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        source="category", queryset=NewsCategory.objects.all(), write_only=True, required=False, allow_null=True,
    )
    author_name = serializers.CharField(source="author.get_full_name", read_only=True, default="")

    class Meta:
        model = NewsArticle
        fields = [
            "id", "title", "slug", "excerpt", "content", "featured_image",
            "category", "category_id", "author_name", "featured", "published", "published_at",
            "meta_title", "meta_description", "created_at", "updated_at",
        ]
        read_only_fields = ["slug", "created_at", "updated_at"]

    def create(self, validated_data):
        validated_data["author"] = self.context["request"].user
        return super().create(validated_data)
