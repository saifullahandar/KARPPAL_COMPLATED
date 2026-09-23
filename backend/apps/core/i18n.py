"""Language selection and fallback for database-driven (dashboard-managed) content.

Storage convention
------------------
Every localizable text column keeps its existing name and holds the **English**
value (so every pre-existing record stays valid, untouched), and gains two
sibling columns: ``<name>_fa`` (Dari) and ``<name>_ps`` (Pashto). A model opts in
by inheriting `LocalizedModelMixin` and listing the base column names in
``localized_fields``.

Language selection (public API)
-------------------------------
The requested language is ``?lang=<en|fa|ps>`` if present, otherwise the first
supported language in the ``Accept-Language`` header, otherwise English. The
React app sends ``?lang=`` on every request (see frontend/src/services/apiClient.ts).

Fallback
--------
For a requested language the value is chosen as: requested language -> English ->
any other language that has text -> "". A public card therefore never renders
blank just because one translation has not been entered yet.
"""
SUPPORTED_LANGUAGES = ("en", "fa", "ps")
DEFAULT_LANGUAGE = "en"
TRANSLATION_SUFFIXES = ("fa", "ps")  # "en" is the base column itself
LANGUAGE_LABELS = {"en": "English", "fa": "Dari", "ps": "Pashto"}


def normalize_language(value):
    """'fa-AF' / 'FA' / 'fa_AF' -> 'fa'; anything unsupported -> None."""
    if not value:
        return None
    code = str(value).strip().lower().replace("_", "-").split("-")[0]
    return code if code in SUPPORTED_LANGUAGES else None


def get_request_language(request):
    if request is None:
        return DEFAULT_LANGUAGE
    lang = normalize_language(request.GET.get("lang"))
    if lang:
        return lang
    for part in request.META.get("HTTP_ACCEPT_LANGUAGE", "").split(","):
        lang = normalize_language(part.split(";")[0])
        if lang:
            return lang
    return DEFAULT_LANGUAGE


def column_for(field, lang):
    """Column that stores `field` for `lang` (English is the base column)."""
    return field if lang == DEFAULT_LANGUAGE else f"{field}_{lang}"


class LocalizedModelMixin:
    """Add to a model; set ``localized_fields = ("name", "description", ...)``."""

    localized_fields: tuple = ()

    def get_localized(self, field, lang=DEFAULT_LANGUAGE):
        order = [lang, DEFAULT_LANGUAGE] + [c for c in SUPPORTED_LANGUAGES if c not in (lang, DEFAULT_LANGUAGE)]
        for code in order:
            value = getattr(self, column_for(field, code), "")
            if value and str(value).strip():
                return value
        return getattr(self, field, "")


class LocalizedSerializerMixin:
    """For ModelSerializers of models using `LocalizedModelMixin`.

    Reads: each localized field is returned already resolved to the request's
    language (same key the frontend already uses, e.g. ``name``), so no page has
    to know about languages. Writes: ``<field>_fa`` / ``<field>_ps`` are accepted
    (write-only) next to the existing English ``<field>``, so staff API clients
    can manage all three languages too.
    """

    @property
    def request_language(self):
        return get_request_language(self.context.get("request"))

    def _translation_names(self):
        model = self.Meta.model
        return [f"{f}_{s}" for f in getattr(model, "localized_fields", ()) for s in TRANSLATION_SUFFIXES]

    def get_field_names(self, declared_fields, info):
        names = list(super().get_field_names(declared_fields, info))
        localized = getattr(self.Meta.model, "localized_fields", ())
        for field in localized:
            if field in names:
                names.extend(f"{field}_{s}" for s in TRANSLATION_SUFFIXES if f"{field}_{s}" not in names)
        return names

    def get_extra_kwargs(self):
        kwargs = super().get_extra_kwargs()
        for name in self._translation_names():
            kwargs.setdefault(name, {})["write_only"] = True
        return kwargs

    def to_representation(self, instance):
        data = super().to_representation(instance)
        lang = self.request_language
        for field in getattr(instance, "localized_fields", ()):
            if field in data:
                data[field] = instance.get_localized(field, lang)
        return data
