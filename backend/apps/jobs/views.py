from rest_framework import mixins, viewsets
from rest_framework.permissions import AllowAny

from apps.core.permissions import IsDashboardStaff, IsDashboardStaffOrReadOnly

from .models import JobApplication, JobPosting
from .serializers import JobApplicationSerializer, JobPostingSerializer


class JobPostingViewSet(viewsets.ModelViewSet):
    """/api/v1/jobs/postings/ — public read (active only), staff-managed CRUD."""

    serializer_class = JobPostingSerializer
    permission_classes = [IsDashboardStaffOrReadOnly]
    lookup_field = "slug"
    filterset_fields = ["employment_type", "status", "featured"]
    search_fields = [
        "title", "title_fa", "title_ps", "location", "location_fa", "location_ps",
        "tags", "tags_fa", "tags_ps", "description", "description_fa", "description_ps",
    ]
    ordering_fields = ["posted_at"]

    def get_queryset(self):
        qs = JobPosting.objects.all()
        if not (self.request.user and self.request.user.is_authenticated and self.request.user.is_dashboard_staff):
            qs = qs.filter(status=JobPosting.Status.ACTIVE)
        return qs


class JobApplicationViewSet(mixins.CreateModelMixin, mixins.ListModelMixin, mixins.RetrieveModelMixin,
                             mixins.UpdateModelMixin, viewsets.GenericViewSet):
    """/api/v1/jobs/applications/ — public POST to apply, staff-only to list/review/update status."""

    serializer_class = JobApplicationSerializer
    queryset = JobApplication.objects.select_related("job")
    filterset_fields = ["status", "job"]
    search_fields = ["first_name", "last_name", "phone", "country"]
    throttle_scope = "contact"

    def get_permissions(self):
        if self.action == "create":
            return [AllowAny()]
        return [IsDashboardStaff()]
