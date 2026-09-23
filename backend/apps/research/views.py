import django_filters
from rest_framework import viewsets

from apps.core.permissions import IsDashboardStaffOrReadOnly

from .models import ResearchArticle, ResearchCategory
from .serializers import ResearchArticleDetailSerializer, ResearchArticleListSerializer, ResearchCategorySerializer


class ResearchCategoryViewSet(viewsets.ModelViewSet):
    serializer_class = ResearchCategorySerializer
    permission_classes = [IsDashboardStaffOrReadOnly]
    queryset = ResearchCategory.objects.filter(active=True)


class ResearchArticleFilter(django_filters.FilterSet):
    # Plain `filterset_fields = ["category"]` would filter by the related
    # ResearchCategory's numeric PK, not its slug — but every public consumer
    # (frontend, docs) only ever knows the category *slug*. This explicit
    # filter matches ?category=<slug> as documented on the viewset below.
    category = django_filters.CharFilter(field_name="category__slug")

    class Meta:
        model = ResearchArticle
        fields = ["category", "featured"]


class ResearchArticleViewSet(viewsets.ModelViewSet):
    """/api/v1/research/ — public read (published only), staff-managed CRUD.

    Supports ?featured=true for the homepage/latest-research widgets and
    ?category=<slug> plus free-text search via ?search=.
    """

    permission_classes = [IsDashboardStaffOrReadOnly]
    lookup_field = "slug"
    filterset_class = ResearchArticleFilter
    search_fields = [
        "title", "title_fa", "title_ps", "excerpt", "excerpt_fa", "excerpt_ps",
        "content", "content_fa", "content_ps",
    ]
    ordering_fields = ["published_at", "created_at"]

    def get_queryset(self):
        qs = ResearchArticle.objects.select_related("category", "author")
        if not (self.request.user and self.request.user.is_authenticated and self.request.user.is_dashboard_staff):
            qs = qs.filter(published=True)
        return qs

    def get_serializer_class(self):
        if self.action == "list":
            return ResearchArticleListSerializer
        return ResearchArticleDetailSerializer
