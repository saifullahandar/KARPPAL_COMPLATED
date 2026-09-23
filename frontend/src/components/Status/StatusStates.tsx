import { useTranslation } from "react-i18next";

export function LoadingState({ label }: { label?: string }) {
    const { t } = useTranslation();
    return (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-500">
            <span className="h-8 w-8 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />
            <span className="text-sm">{label ?? t("common.loading")}</span>
        </div>
    );
}

export function ErrorState({ message, onRetry }: { message?: string; onRetry?: () => void }) {
    const { t } = useTranslation();
    return (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-red-100 bg-red-50 px-6 py-14 text-center text-red-700">
            <span className="text-2xl" aria-hidden="true">⚠️</span>
            <p className="text-sm font-medium">{message ?? t("common.error")}</p>
            {onRetry && (
                <button
                    type="button"
                    onClick={onRetry}
                    className="rounded-full bg-red-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-red-700"
                >
                    {t("common.retry")}
                </button>
            )}
        </div>
    );
}

export function EmptyState({ message }: { message?: string }) {
    const { t } = useTranslation();
    return (
        <div className="flex flex-col items-center justify-center gap-2 py-16 text-center text-slate-400">
            <span className="text-3xl" aria-hidden="true">🗂️</span>
            <p className="text-sm">{message ?? t("common.empty")}</p>
        </div>
    );
}
