import django_filters
from rest_framework import viewsets

from apps.core.permissions import IsDashboardStaffOrReadOnly

from .models import GalleryCategory, GalleryItem
from .serializers import GalleryCategorySerializer, GalleryItemSerializer


class GalleryCategoryViewSet(viewsets.ModelViewSet):
    serializer_class = GalleryCategorySerializer
    permission_classes = [IsDashboardStaffOrReadOnly]
    queryset = GalleryCategory.objects.filter(active=True)


class GalleryItemFilter(django_filters.FilterSet):
    # Plain `filterset_fields = ["category"]` filters by the related
    # GalleryCategory's numeric PK, but every public consumer only ever
    # knows the category *slug* (see the identical fix applied to Research,
    # apps/research/views.py). This matches ?category=<slug> as intended.
    category = django_filters.CharFilter(field_name="category__slug")

    class Meta:
        model = GalleryItem
        fields = ["category", "featured", "active"]


class GalleryItemViewSet(viewsets.ModelViewSet):
    """/api/v1/gallery/ — public read, staff-managed CRUD."""

    serializer_class = GalleryItemSerializer
    permission_classes = [IsDashboardStaffOrReadOnly]
    filterset_class = GalleryItemFilter
    search_fields = ["title", "title_fa", "title_ps", "description", "description_fa", "description_ps"]
    ordering_fields = ["order", "created_at"]

    def get_queryset(self):
        qs = GalleryItem.objects.select_related("category")
        if not (self.request.user and self.request.user.is_authenticated and self.request.user.is_dashboard_staff):
            qs = qs.filter(active=True)
        return qs
