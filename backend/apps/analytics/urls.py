from django.urls import path

from . import views

app_name = "analytics"

urlpatterns = [
    path("track/", views.TrackPageViewAPIView.as_view(), name="track"),
    path("overview/", views.AnalyticsOverviewAPIView.as_view(), name="overview"),
    path("trend/", views.AnalyticsTrendAPIView.as_view(), name="trend"),
]
