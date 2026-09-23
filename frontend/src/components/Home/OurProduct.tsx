import { useTranslation } from "react-i18next"
import { BiArrowBack } from "react-icons/bi"
import { NavLink } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import { getProducts } from "../../services/products";

function Our_product() {
    const { t } = useTranslation();
    const { data } = useFetch(() => getProducts({ featured: true, page_size: 5 }), []);
    const products = data?.results ?? [];

    return (
        <section className="w-full bg-gradient-to-b from-green-50 via-white to-green-50 px-3 py-8 sm:px-4 sm:py-12 lg:px-6">
            <div className="mx-auto max-w-7xl">
                <div className="mb-6 text-center sm:mb-10 lg:mb-12">
                    <NavLink className="block rounded-full border border-green-200 bg-green-100 px-3 py-1 text-[10px] font-semibold text-green-700 shadow-sm sm:text-xs lg:text-sm" to={"/all"}>
                        {t("ourProduct.firstTitle")}
                    </NavLink>
                    <h2 className="contents">
                        <NavLink className="relative justify-center inline-block mt-2 border-b-2 border-green-600 text-center text-2xl font-extrabold text-slate-800 sm:mt-3 sm:text-3xl lg:mt-4 lg:text-4xl" to={"/all"}>
                            {t("ourProduct.secondTitle")}
                        </NavLink>
                    </h2>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="group flex w-full flex-col items-center gap-3 rounded-[24px] border border-green-100 bg-white p-3 text-center shadow-[0_10px_30px_rgba(22,163,74,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_35px_rgba(22,163,74,0.18)] sm:gap-4 sm:p-4 lg:rounded-[28px]"
                        >
                            <div className="flex h-32 w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-green-50 to-white ring-1 ring-green-100 transition-all duration-300 group-hover:ring-green-300 sm:h-36 lg:h-40">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="h-full w-full object-cover p-2 transition-transform duration-300 group-hover:scale-105"
                                />
                            </div>

                            <h3 className="text-base font-extrabold text-slate-800 sm:text-lg">{product.name}</h3>

                            <a
                                href="/all"
                                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-green-200 bg-white px-3 py-2 text-xs font-semibold text-green-700 transition-all duration-300 hover:bg-green-600 hover:text-white hover:shadow-lg hover:shadow-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:w-auto sm:px-4 sm:text-sm"
                            >
                                <BiArrowBack className="text-base" />
                                <span>{t("ourproduct.all.button")}</span>
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Our_product
