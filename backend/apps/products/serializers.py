from rest_framework import serializers

from apps.core.i18n import LocalizedSerializerMixin

from .models import Category, Product, ProductImage, ProductSpecification


class CategorySerializer(LocalizedSerializerMixin, serializers.ModelSerializer):
    product_count = serializers.IntegerField(read_only=True, source="products.count")

    class Meta:
        model = Category
        fields = ["id", "name", "slug", "description", "image", "order", "active", "product_count"]
        read_only_fields = ["slug"]


class ProductImageSerializer(LocalizedSerializerMixin, serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ["id", "image", "alt_text", "order"]


class ProductSpecificationSerializer(LocalizedSerializerMixin, serializers.ModelSerializer):
    class Meta:
        model = ProductSpecification
        fields = ["id", "key", "value", "order"]


class ProductListSerializer(LocalizedSerializerMixin, serializers.ModelSerializer):
    category = serializers.SlugRelatedField(slug_field="slug", read_only=True)
    category_name = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            "id", "name", "slug", "short_description", "price", "currency",
            "image", "tag1", "tag2", "featured", "category", "category_name",
        ]

    def get_category_name(self, obj) -> str:
        return obj.category.get_localized("name", self.request_language)


class ProductDetailSerializer(LocalizedSerializerMixin, serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        source="category", queryset=Category.objects.all(), write_only=True,
    )
    gallery_images = ProductImageSerializer(many=True, read_only=True)
    specifications = ProductSpecificationSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            "id", "name", "slug", "short_description", "description",
            "price", "currency", "image", "tag1", "tag2", "featured", "status", "order",
            "category", "category_id", "gallery_images", "specifications",
            "meta_title", "meta_description", "created_at", "updated_at",
        ]
        read_only_fields = ["slug", "created_at", "updated_at"]
