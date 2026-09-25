from django import forms
from django.contrib import messages
from django.contrib.auth import views as auth_views
from django.contrib.auth.mixins import LoginRequiredMixin
from django.db.models import Q
from django.db.models.deletion import ProtectedError
from django.shortcuts import redirect, render
from django.urls import reverse
from django.views.generic import CreateView, DeleteView, ListView, TemplateView, UpdateView
from django.views.generic.edit import FormMixin

from apps.accounts.models import User
from apps.analytics import services as analytics_services
from apps.contact.models import ContactMessage
from apps.core.models import CompanyInfo
from apps.exports.models import ExportShipment
from apps.gallery.models import GalleryItem
from apps.jobs.models import JobApplication, JobPosting
from apps.products.models import Product
from apps.quality.models import QualityDailyReport, QualityScore
from apps.research.models import ResearchArticle
from apps.services.models import Service

from .forms import DashboardLoginForm, bootstrap_modelform_factory, expand_localized_fields
from .mixins import DashboardAdminRequiredMixin, DashboardStaffRequiredMixin
from .registry import get_module, grouped_modules


def dashboard_login(request):
    if request.user.is_authenticated and request.user.is_dashboard_staff:
        return redirect("dashboard:home")

    form = DashboardLoginForm(request, data=request.POST or None)
    if request.method == "POST" and form.is_valid():
        from django.contrib.auth import login
        login(request, form.get_user())
        return redirect(request.GET.get("next") or "dashboard:home")

    return render(request, "dashboard/login.html", {"form": form})


class DashboardLogoutView(auth_views.LogoutView):
    next_page = "dashboard:login"


class DashboardHomeView(DashboardStaffRequiredMixin, LoginRequiredMixin, TemplateView):
    template_name = "dashboard/home.html"

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx["stats"] = [
            {"label": "Products", "count": Product.objects.count(), "icon": "bi-box-seam", "url": "product"},
            {"label": "Services", "count": Service.objects.count(), "icon": "bi-gear", "url": "service"},
            {"label": "Job Postings", "count": JobPosting.objects.count(), "icon": "bi-briefcase", "url": "jobposting"},
            {"label": "Research Articles", "count": ResearchArticle.objects.count(), "icon": "bi-file-earmark-text", "url": "researcharticle"},
            {"label": "Gallery Items", "count": GalleryItem.objects.count(), "icon": "bi-images", "url": "galleryitem"},
            {"label": "Export Shipments", "count": ExportShipment.objects.count(), "icon": "bi-truck", "url": "exportshipment"},
        ]
        ctx["new_messages_count"] = ContactMessage.objects.filter(status=ContactMessage.Status.NEW).count()
        ctx["new_applications_count"] = JobApplication.objects.filter(status=JobApplication.Status.NEW).count()
        ctx["recent_messages"] = ContactMessage.objects.all()[:5]
        ctx["recent_products"] = Product.objects.select_related("category").all()[:5]
        ctx["recent_applications"] = JobApplication.objects.select_related("job").all()[:5]
        ctx["total_users"] = User.objects.count()
        ctx["groups"] = grouped_modules()
        ctx["today_visitors"] = analytics_services.get_overview()["today_visitors"]
        return ctx


def _resolve(obj, path):
    value = obj
    for part in path.split("."):
        if value is None:
            return ""
        value = getattr(value, part, "")
        if callable(value):
            value = value()
    return value


class ModuleMixin(DashboardStaffRequiredMixin, LoginRequiredMixin):
    def setup(self, request, *args, **kwargs):
        super().setup(request, *args, **kwargs)
        self.module = get_module(kwargs["module"])
        self.model = self.module.model

    def dispatch(self, request, *args, **kwargs):
        if self.module.admin_only and not getattr(request.user, "is_dashboard_admin", False):
            return self.handle_no_permission()
        return super().dispatch(request, *args, **kwargs)

    def get_form_class(self):
        if self.module.form_class:
            return self.module.form_class
        return bootstrap_modelform_factory(self.model, list(self.module.form_fields))

    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        if self.module.form_class:
            kwargs["request"] = self.request
        return kwargs

    def get_success_url(self):
        return reverse("dashboard:module-list", kwargs={"module": self.module.slug})


class ModuleListView(ModuleMixin, ListView):
    template_name = "dashboard/list.html"
    context_object_name = "object_list"

    def get_paginate_by(self, queryset):
        return self.module.per_page

    def get_queryset(self):
        qs = self.model.objects.all()
        if self.module.ordering:
            qs = qs.order_by(*self.module.ordering)
        q = self.request.GET.get("q", "").strip()
        if q and self.module.search_fields:
            filters = Q()
            for f in expand_localized_fields(self.model, self.module.search_fields):
                filters |= Q(**{f"{f}__icontains": q})
            qs = qs.filter(filters)
        return qs

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        columns = self.module.list_display or [f.name for f in self.model._meta.fields[:5]]
        ctx["columns"] = columns
        ctx["rows"] = [
            {"obj": obj, "cells": [_resolve(obj, c) for c in columns]}
            for obj in ctx["object_list"]
        ]
        ctx["module"] = self.module
        ctx["query"] = self.request.GET.get("q", "")
        ctx["groups"] = grouped_modules()
        return ctx


class ModuleCreateView(ModuleMixin, CreateView):
    template_name = "dashboard/form.html"

    def form_valid(self, form):
        messages.success(self.request, f"{self.module.label} created successfully.")
        return super().form_valid(form)

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx["module"] = self.module
        ctx["groups"] = grouped_modules()
        ctx["is_create"] = True
        return ctx


class ModuleUpdateView(ModuleMixin, UpdateView):
    template_name = "dashboard/form.html"

    def get_queryset(self):
        return self.model.objects.all()

    def form_valid(self, form):
        messages.success(self.request, f"{self.module.label} updated successfully.")
        return super().form_valid(form)

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx["module"] = self.module
        ctx["groups"] = grouped_modules()
        ctx["is_create"] = False
        return ctx


class CompanyInfoUpdateView(DashboardAdminRequiredMixin, LoginRequiredMixin, UpdateView):
    """Edits the singleton CompanyInfo row — Settings > Company Information."""

    model = CompanyInfo
    template_name = "dashboard/company_info.html"
    fields = [
        "name", "tagline", "description", "mission", "vision",
        "email", "phone", "whatsapp", "address",
        "facebook_url", "instagram_url", "linkedin_url", "whatsapp_url", "map_url",
        "logo", "favicon", "map_image", "founded_year",
    ]

    def get_form_class(self):
        return bootstrap_modelform_factory(CompanyInfo, self.fields)

    def get_object(self, queryset=None):
        return CompanyInfo.load()

    def get_success_url(self):
        messages.success(self.request, "Company information updated.")
        return reverse("dashboard:company-info")

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx["groups"] = grouped_modules()
        return ctx


class ModuleDeleteView(ModuleMixin, DeleteView):
    template_name = "dashboard/confirm_delete.html"

    def get_queryset(self):
        return self.model.objects.all()

    def get_form_class(self):
        # Deletion only ever needs an empty confirmation form — NOT the module's
        # full ModelForm (built from form_fields). Using the ModelForm here would
        # bind it to the delete POST body (which carries no model fields at all,
        # just the CSRF token), so required fields would always fail validation
        # and the "delete" would silently no-op back to the confirmation page.
        return forms.Form

    def get_form_kwargs(self):
        # Bypass ModuleMixin.get_form_kwargs(): the plain confirmation Form above
        # doesn't take a `request` kwarg the way a custom ModelForm might.
        return FormMixin.get_form_kwargs(self)

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx["module"] = self.module
        ctx["groups"] = grouped_modules()
        return ctx

    def form_valid(self, form):
        try:
            response = super().form_valid(form)
        except ProtectedError as exc:
            protected = ", ".join(str(obj) for obj in list(exc.protected_objects)[:5])
            messages.error(
                self.request,
                f"Cannot delete this {self.module.label.lower()}: other records still reference it ({protected}).",
            )
            return redirect("dashboard:module-list", module=self.module.slug)
        messages.success(self.request, f"{self.module.label} deleted.")
        return response


class AnalyticsDashboardView(DashboardStaffRequiredMixin, LoginRequiredMixin, TemplateView):
    """Website Analytics — Today/Yesterday/7-day/30-day/total visitor cards
    plus a server-rendered visitor trend chart. Queries the DB directly
    (via apps.analytics.services, the same aggregation code the dashboard-
    only REST endpoints use) rather than round-tripping through the API."""

    template_name = "dashboard/analytics.html"

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx["overview"] = analytics_services.get_overview()

        _, trend_30 = analytics_services.get_trend(30)
        ctx["trend_30"] = trend_30
        ctx["trend_7"] = trend_30[-7:]

        max_visitors = max((row["visitors"] for row in trend_30), default=0)
        ctx["chart_max"] = max(max_visitors, 1)  # avoid division by zero when there's no data yet
        ctx["groups"] = grouped_modules()
        return ctx


class QualityOverviewView(DashboardStaffRequiredMixin, LoginRequiredMixin, TemplateView):
    """Quality Control overview — the latest daily QC report as a scorecard,
    plus acceptance rates for recent days. Internal data, so it lives here
    rather than on the public website."""

    template_name = "dashboard/quality.html"

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        recent = list(QualityDailyReport.objects.prefetch_related("scores")[:7])
        report = recent[0] if recent else None
        ctx["report"] = report
        if report:
            scores = list(report.scores.all())
            ctx["checks"] = [s for s in scores if s.score_type == QualityScore.ScoreType.CHECK]
            ctx["sections"] = [s for s in scores if s.score_type == QualityScore.ScoreType.SECTION]
        ctx["recent_reports"] = list(reversed(recent))  # oldest first, for the chart
        ctx["groups"] = grouped_modules()
        return ctx
