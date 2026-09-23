from django.urls import path

from . import views

app_name = "core"

urlpatterns = [
    path("company-info/", views.CompanyInfoView.as_view(), name="company-info"),
    path("hero-slides/", views.HeroSlideListView.as_view(), name="hero-slides"),
    path("statistics/", views.StatisticListView.as_view(), name="statistics"),
    path("features/", views.FeatureListView.as_view(), name="features"),
]
