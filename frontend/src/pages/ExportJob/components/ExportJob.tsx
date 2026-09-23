import { useState } from "react";
import { useTranslation } from "react-i18next";
import { submitJobApplication } from "../../../services/jobs";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";

const initialForm = {
    first_name: "",
    last_name: "",
    country: "",
    phone: "",
    gender: "" as "" | "male" | "female",
    application_date: "",
    description: "",
};

export default function ExportJob() {
    const { t, i18n } = useTranslation();
    useDocumentTitle(`${t("jobApplication.title")} — ${t("footer.company")}`);
    const [form, setForm] = useState(initialForm);
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

    const handleChange = (field: keyof typeof form) => (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    ) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("submitting");
        try {
            await submitJobApplication({
                first_name: form.first_name,
                last_name: form.last_name,
                country: form.country,
                phone: form.phone,
                gender: form.gender || undefined,
                application_date: form.application_date || undefined,
                description: form.description,
            });
            setStatus("success");
            setForm(initialForm);
        } catch {
            setStatus("error");
        }
    };

    return (
        <div dir={i18n.dir()} className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-100 p-4 text-slate-800 sm:p-6 lg:p-8">
            <div className="mx-auto mt-25 max-w-6xl overflow-hidden rounded-[32px] border border-green-100 bg-white shadow-[0_25px_80px_-25px_rgba(22,163,74,0.35)] ring-1 ring-green-100">
                <div className="border-b border-green-100 bg-gradient-to-r from-green-600 via-emerald-600 to-green-500 px-6 py-6 text-white sm:px-8">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
                                <span className="text-xl">📦</span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-emerald-100">{t("jobApplication.eyebrow")}</p>
                                <h1 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">{t("jobApplication.title")}</h1>
                            </div>
                        </div>

                    </div>
                </div>

                {status === "success" && (
                    <div className="mx-6 mt-6 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700 sm:mx-8">
                        {t("jobApplication.successMessage")}
                    </div>
                )}
                {status === "error" && (
                    <div className="mx-6 mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 sm:mx-8">
                        {t("jobApplication.errorMessage")}
                    </div>
                )}

                <form className="space-y-8 px-6 py-7 sm:px-8 sm:py-8" onSubmit={handleSubmit}>
                    <div className="rounded-3xl border border-green-100 bg-gradient-to-br from-emerald-50 to-white p-5 sm:p-6">
                        <div className="mb-5 flex items-center justify-between gap-3">
                            <h2 className="text-lg font-bold text-slate-900">{t("jobApplication.sectionTitle")}</h2>
                            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">{t("jobApplication.sectionBadge")}</span>
                        </div>

                        <div className="grid gap-5 md:grid-cols-2">
                            <label className="block">
                                <span className="mb-2.5 block text-sm font-semibold text-slate-700">{t("jobApplication.firstName")}</span>
                                <input
                                    type="text"
                                    required
                                    value={form.first_name}
                                    onChange={handleChange("first_name")}
                                    className="w-full rounded-2xl border border-green-200 bg-white px-4 py-3 text-start text-slate-900 shadow-sm outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-100"
                                    placeholder={t("jobApplication.firstNamePlaceholder")}
                                />
                            </label>

                            <label className="block">
                                <span className="mb-2.5 block text-sm font-semibold text-slate-700">{t("jobApplication.applicationDate")}</span>
                                <input
                                    type="date"
                                    value={form.application_date}
                                    onChange={handleChange("application_date")}
                                    className="w-full rounded-2xl border border-green-200 bg-white px-4 py-3 text-start text-slate-900 shadow-sm outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-100"
                                />
                            </label>

                            <label className="block">
                                <span className="mb-2.5 block text-sm font-semibold text-slate-700">{t("jobApplication.lastName")}</span>
                                <input
                                    type="text"
                                    required
                                    value={form.last_name}
                                    onChange={handleChange("last_name")}
                                    className="w-full rounded-2xl border border-green-200 bg-white px-4 py-3 text-start text-slate-900 shadow-sm outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-100"
                                    placeholder={t("jobApplication.lastNamePlaceholder")}
                                />
                            </label>

                            <label className="block">
                                <span className="mb-2.5 block text-sm font-semibold text-slate-700">{t("jobApplication.country")}</span>
                                <input
                                    type="text"
                                    value={form.country}
                                    onChange={handleChange("country")}
                                    className="w-full rounded-2xl border border-green-200 bg-white px-4 py-3 text-start text-slate-900 shadow-sm outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-100"
                                    placeholder={t("jobApplication.countryPlaceholder")}
                                />
                            </label>

                            <label className="block">
                                <span className="mb-2.5 block text-sm font-semibold text-slate-700">{t("jobApplication.phone")}</span>
                                <input
                                    type="tel"
                                    required
                                    value={form.phone}
                                    onChange={handleChange("phone")}
                                    className="w-full rounded-2xl border border-green-200 bg-white px-4 py-3 text-start text-slate-900 shadow-sm outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-100"
                                    placeholder={t("jobApplication.phonePlaceholder")}
                                />
                            </label>

                            <label className="block">
                                <span className="mb-2.5 block text-sm font-semibold text-slate-700">{t("jobApplication.gender")}</span>
                                <select
                                    value={form.gender}
                                    onChange={handleChange("gender")}
                                    className="w-full rounded-2xl border border-green-200 bg-white px-4 py-3 text-start text-green-600 shadow-sm outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-100"
                                >
                                    <option value="">{t("jobApplication.genderSelect")}</option>
                                    <option value="male">{t("jobApplication.genderMale")}</option>
                                    <option value="female">{t("jobApplication.genderFemale")}</option>
                                </select>
                            </label>
                        </div>
                    </div>

                    <div className="rounded-3xl border border-green-100 bg-white p-5 shadow-sm sm:p-6">
                        <label className="block">
                            <span className="mb-2.5 block text-sm font-semibold text-slate-700">{t("jobApplication.descriptionLabel")}</span>
                            <textarea
                                rows={5}
                                value={form.description}
                                onChange={handleChange("description")}
                                className="w-full rounded-2xl border border-green-200 bg-emerald-50/50 px-4 py-3 text-start text-slate-900 shadow-sm outline-none transition focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100"
                                placeholder={t("jobApplication.descriptionPlaceholder")}
                            />
                        </label>
                    </div>

                    <div className="flex flex-col gap-3 border-t border-green-100 pt-6 sm:flex-row sm:justify-end">
                        <a
                            href="/jobs"
                            className="rounded-2xl border border-slate-300 bg-white px-5 py-2.75 text-sm font-bold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                        >
                            {t("jobApplication.cancel")}
                        </a>
                        <button
                            type="submit"
                            disabled={status === "submitting"}
                            className="rounded-2xl bg-green-600 px-5 py-2.75 text-sm font-bold text-white shadow-lg shadow-green-600/25 transition hover:-translate-y-0.5 hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {status === "submitting" ? t("jobApplication.submitting") : t("jobApplication.submit")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
