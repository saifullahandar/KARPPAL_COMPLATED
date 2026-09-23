"""A lightweight, admin-like registry that drives the whole Bootstrap dashboard.

Instead of hand-writing a ListView/CreateView/UpdateView/DeleteView + template set
for every model, each model is registered once here with the columns, fields and
grouping it needs. dashboard/views.py then serves generic CRUD for any registered
model from four shared templates, keyed by the module's `slug` in the URL.
"""
from dataclasses import dataclass, field


@dataclass
class DashboardModule:
    slug: str
    model: type
    label: str
    group: str
    icon: str = "bi-collection"
    list_display: tuple = ()
    form_fields: tuple = ()
    search_fields: tuple = ()
    filter_fields: tuple = ()
    ordering: tuple = ()
    per_page: int = 20
    allow_add: bool = True
    allow_delete: bool = True
    inline_formsets: tuple = field(default_factory=tuple)  # ("related_name", ["field1", "field2"])
    form_class: type | None = None  # override the auto-generated Bootstrap ModelForm if set
    admin_only: bool = False  # restrict to admin/super_admin roles (e.g. user management)


registry: dict[str, DashboardModule] = {}
groups_order: list[str] = []


def register(module: DashboardModule):
    registry[module.slug] = module
    if module.group not in groups_order:
        groups_order.append(module.group)
    return module


def get_module(slug: str) -> DashboardModule:
    if slug not in registry:
        from django.http import Http404
        raise Http404(f"Unknown dashboard module: {slug}")
    return registry[slug]


def grouped_modules():
    """Return [(group_name, [module, ...]), ...] in registration order, for the sidebar."""
    result = []
    for group in groups_order:
        mods = [m for m in registry.values() if m.group == group]
        result.append((group, mods))
    return result
