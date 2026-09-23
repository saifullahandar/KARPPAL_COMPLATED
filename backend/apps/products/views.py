from rest_framework import viewsets

from apps.core.permissions import IsDashboardStaffOrReadOnly

from .filters import ProductFilter
from .models import Category, Product
from .serializers import CategorySerializer, ProductDetailSerializer, ProductListSerializer


class CategoryViewSet(viewsets.ModelViewSet):
    """/api/v1/products/categories/ — public read, staff-managed CRUD."""

    serializer_class = CategorySerializer
    permission_classes = [IsDashboardStaffOrReadOnly]
    lookup_field = "slug"
    search_fields = ["name", "name_fa", "name_ps", "description", "description_fa", "description_ps"]
    ordering_fields = ["order", "name"]

    def get_queryset(self):
        qs = Category.objects.order_by("order", "name")
        if not (self.request.user and self.request.user.is_authenticated and self.request.user.is_dashboard_staff):
            qs = qs.filter(active=True)
        return qs


class ProductViewSet(viewsets.ModelViewSet):
    """/api/v1/products/ — public catalog with search/filter/pagination, staff-managed CRUD."""

    permission_classes = [IsDashboardStaffOrReadOnly]
    lookup_field = "slug"
    filterset_class = ProductFilter
    search_fields = [
        "name", "name_fa", "name_ps", "short_description", "short_description_fa", "short_description_ps",
        "description", "description_fa", "description_ps",
    ]
    ordering_fields = ["price", "created_at", "order", "name"]

    def get_queryset(self):
        qs = Product.objects.select_related("category").prefetch_related("gallery_images", "specifications")
        if not (self.request.user and self.request.user.is_authenticated and self.request.user.is_dashboard_staff):
            qs = qs.filter(status=Product.Status.ACTIVE)
        return qs

    def get_serializer_class(self):
        if self.action == "list":
            return ProductListSerializer
        return ProductDetailSerializer
