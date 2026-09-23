from django.contrib.auth.mixins import AccessMixin


class DashboardStaffRequiredMixin(AccessMixin):
    """Blocks any dashboard view unless the user is authenticated dashboard staff."""

    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return self.handle_no_permission()
        if not getattr(request.user, "is_dashboard_staff", False):
            return self.handle_no_permission()
        return super().dispatch(request, *args, **kwargs)


class DashboardAdminRequiredMixin(AccessMixin):
    """Blocks any dashboard view unless the user is admin/super-admin (not plain staff).

    Used for user management and company-wide settings — content management
    (products, research, jobs, ...) stays open to plain 'staff' via DashboardStaffRequiredMixin.
    """

    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return self.handle_no_permission()
        if not getattr(request.user, "is_dashboard_admin", False):
            return self.handle_no_permission()
        return super().dispatch(request, *args, **kwargs)
