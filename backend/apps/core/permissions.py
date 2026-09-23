from rest_framework.permissions import SAFE_METHODS, BasePermission


class IsDashboardStaffOrReadOnly(BasePermission):
    """Public GET/HEAD/OPTIONS; write access limited to staff/admin/super-admin users.

    Used on every public-facing content ViewSet (products, services, research, gallery, ...):
    the React site reads freely, only the dashboard/admin can create or edit.
    """

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        user = request.user
        return bool(user and user.is_authenticated and getattr(user, "is_dashboard_staff", False))


class IsDashboardStaff(BasePermission):
    """Blocks the whole endpoint unless the caller is dashboard staff (no public read)."""

    def has_permission(self, request, view):
        user = request.user
        return bool(user and user.is_authenticated and getattr(user, "is_dashboard_staff", False))
