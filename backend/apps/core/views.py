from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.permissions import AllowAny

from .models import CompanyInfo, Feature, HeroSlide, Statistic
from .serializers import CompanyInfoSerializer, FeatureSerializer, HeroSlideSerializer, StatisticSerializer


class CompanyInfoView(RetrieveAPIView):
    """GET /api/v1/core/company-info/ — public site-wide company information."""

    serializer_class = CompanyInfoSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        return CompanyInfo.load()


class HeroSlideListView(ListAPIView):
    serializer_class = HeroSlideSerializer
    permission_classes = [AllowAny]
    pagination_class = None
    queryset = HeroSlide.objects.filter(active=True)


class StatisticListView(ListAPIView):
    serializer_class = StatisticSerializer
    permission_classes = [AllowAny]
    pagination_class = None
    queryset = Statistic.objects.filter(active=True)


class FeatureListView(ListAPIView):
    serializer_class = FeatureSerializer
    permission_classes = [AllowAny]
    pagination_class = None
    queryset = Feature.objects.filter(active=True)
