from django import forms
from django.contrib.auth import forms as auth_forms

from apps.accounts.models import User
from apps.core.i18n import LANGUAGE_LABELS, TRANSLATION_SUFFIXES


class BootstrapFormMixin:
    """Stamps Bootstrap 5 CSS classes onto every field's widget automatically,
    so generic templates can just do `{{ field }}` and get styled inputs.
    """

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for bound_field in self.fields.values():
            widget = bound_field.widget
            if isinstance(widget, forms.CheckboxInput):
                widget.attrs["class"] = (widget.attrs.get("class", "") + " form-check-input").strip()
            elif isinstance(widget, (forms.Select, forms.SelectMultiple)):
                widget.attrs["class"] = (widget.attrs.get("class", "") + " form-select").strip()
            elif isinstance(widget, forms.ClearableFileInput):
                widget.attrs["class"] = (widget.attrs.get("class", "") + " form-control").strip()
            elif isinstance(widget, forms.Textarea):
                widget.attrs["class"] = (widget.attrs.get("class", "") + " form-control").strip()
                widget.attrs.setdefault("rows", 4)
            else:
                widget.attrs["class"] = (widget.attrs.get("class", "") + " form-control").strip()


def expand_localized_fields(model, fields):
    """Insert each localized field's Dari/Pashto siblings right after its English column,
    so every module in the registry gets three-language inputs without listing them by hand."""
    localized = getattr(model, "localized_fields", ())
    expanded = []
    for name in fields:
        expanded.append(name)
        if name in localized:
            expanded.extend(f"{name}_{suffix}" for suffix in TRANSLATION_SUFFIXES)
    return expanded


class LocalizedFormMixin:
    """Labels the three language inputs ("Name (English)" / "(Dari)" / "(Pashto)"),
    right-aligns the Dari/Pashto inputs (dir="rtl") and explains the English fallback."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for base in getattr(self._meta.model, "localized_fields", ()):
            if base not in self.fields:
                continue
            label = self.fields[base].label or base.replace("_", " ").capitalize()
            self.fields[base].label = f"{label} ({LANGUAGE_LABELS['en']})"
            for suffix in TRANSLATION_SUFFIXES:
                field = self.fields.get(f"{base}_{suffix}")
                if field is None:
                    continue
                field.label = f"{label} ({LANGUAGE_LABELS[suffix]})"
                field.widget.attrs.update({"dir": "rtl", "lang": suffix})
                field.help_text = field.help_text or "Optional. If left empty, the English text is shown."


def bootstrap_modelform_factory(model, fields):
    """Build a ModelForm for `model` restricted to `fields`, with Bootstrap styling applied
    and three-language (English / Dari / Pashto) inputs for every localized field."""
    base = forms.modelform_factory(model, fields=expand_localized_fields(model, fields))
    return type(f"{model.__name__}BootstrapForm", (LocalizedFormMixin, BootstrapFormMixin, base), {})


class DashboardLoginForm(auth_forms.AuthenticationForm):
    username = forms.EmailField(label="Email", widget=forms.EmailInput(attrs={
        "class": "form-control", "placeholder": "you@karppal.af", "autofocus": True,
    }))
    password = forms.CharField(widget=forms.PasswordInput(attrs={
        "class": "form-control", "placeholder": "••••••••",
    }))

    error_messages = {
        "invalid_login": "Please enter a correct email and password.",
        "inactive": "This account is inactive.",
    }

    def confirm_login_allowed(self, user):
        super().confirm_login_allowed(user)
        if not user.is_dashboard_staff:
            raise forms.ValidationError("This account does not have dashboard access.", code="not_staff")


class DashboardUserForm(BootstrapFormMixin, forms.ModelForm):
    password = forms.CharField(
        widget=forms.PasswordInput(), required=False,
        help_text="Leave blank to keep the current password.",
    )

    class Meta:
        model = User
        fields = ["email", "first_name", "last_name", "phone", "role", "avatar", "is_active", "password"]

    def __init__(self, *args, request=None, **kwargs):
        super().__init__(*args, **kwargs)
        # Only a super admin may grant the super_admin role — an Admin account
        # (even if compromised) can't mint another super admin from the dashboard.
        requester = request.user if request else None
        is_super = bool(requester and (requester.is_superuser or requester.role == User.Role.SUPER_ADMIN))
        if not is_super:
            self.fields["role"].choices = [
                choice for choice in self.fields["role"].choices if choice[0] != User.Role.SUPER_ADMIN
            ]

    def save(self, commit=True):
        user = super().save(commit=False)
        raw_password = self.cleaned_data.get("password")
        if raw_password:
            user.set_password(raw_password)
        elif not user.pk:
            user.set_unusable_password()
        if commit:
            user.save()
        return user
