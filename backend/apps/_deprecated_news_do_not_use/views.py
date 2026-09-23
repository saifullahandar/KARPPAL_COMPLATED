from rest_framework import viewsets

from apps.core.permissions import IsDashboardStaffOrReadOnly

from .models import NewsArticle, NewsCategory
from .serializers import NewsArticleDetailSerializer, NewsArticleListSerializer, NewsCategorySerializer


class NewsCategoryViewSet(viewsets.ModelViewSet):
    serializer_class = NewsCategorySerializer
    permission_classes = [IsDashboardStaffOrReadOnly]
    queryset = NewsCategory.objects.filter(active=True)


class NewsArticleViewSet(viewsets.ModelViewSet):
    """/api/v1/news/ — public read (published only), staff-managed CRUD.

    Supports ?featured=true for the homepage/latest-news widgets and
    ?category=<slug> plus free-text search via ?search=.
    """

    permission_classes = [IsDashboardStaffOrReadOnly]
    lookup_field = "slug"
    filterset_fields = ["category", "featured"]
    search_fields = ["title", "excerpt", "content"]
    ordering_fields = ["published_at", "created_at"]

    def get_queryset(self):
        qs = NewsArticle.objects.select_related("category", "author")
        if not (self.request.user and self.request.user.is_authenticated and self.request.user.is_dashboard_staff):
            qs = qs.filter(published=True)
        return qs

    def get_serializer_class(self):
        if self.action == "list":
            return NewsArticleListSerializer
        return NewsArticleDetailSerializer
