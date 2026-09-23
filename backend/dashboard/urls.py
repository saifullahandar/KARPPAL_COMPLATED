from django.urls import path

from . import views

app_name = "dashboard"

urlpatterns = [
    path("", views.DashboardHomeView.as_view(), name="home"),
    path("login/", views.dashboard_login, name="login"),
    path("logout/", views.DashboardLogoutView.as_view(), name="logout"),
    path("settings/company-info/", views.CompanyInfoUpdateView.as_view(), name="company-info"),
    path("analytics/", views.AnalyticsDashboardView.as_view(), name="analytics"),
    path("<slug:module>/", views.ModuleListView.as_view(), name="module-list"),
    path("<slug:module>/add/", views.ModuleCreateView.as_view(), name="module-add"),
    path("<slug:module>/<int:pk>/edit/", views.ModuleUpdateView.as_view(), name="module-edit"),
    path("<slug:module>/<int:pk>/delete/", views.ModuleDeleteView.as_view(), name="module-delete"),
]
