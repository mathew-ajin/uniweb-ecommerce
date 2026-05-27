"use client";
import ProductCard from "@/components/common/ProductCard";
import Footer from "@/components/layout/Footer";
import MainHeader from "@/components/layout/MainHeader";
import NavBar from "@/components/layout/NavBar";
import TopBar from "@/components/layout/TopBar";
import SortControls from "@/components/shop/SortControls";
import { products } from "@/data/mock/products";
import { useLocale } from "@/hooks/useLocale";
import type { SortOption } from "@/types/product";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const ITEMS_PER_PAGE = 12;

const SalePage = () => {
  const { lang } = useLocale();
  const [sort, setSort] = useState<SortOption>("newest");
  const [viewMode, setViewMode] = useState<"grid" | "compact">("grid");
  const [page, setPage] = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const t = (en: string, ar: string) => (lang === "ar" ? ar : en);

  const saleProducts = useMemo(() => {
    let result = products.filter((p) => p.isOnSale);
    switch (sort) {
      case "price-asc":
        result.sort((a, b) => a.basePrice - b.basePrice);
        break;
      case "price-desc":
        result.sort((a, b) => b.basePrice - a.basePrice);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "popular":
        result.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      default:
        break;
    }
    return result;
  }, [sort]);

  const totalPages = Math.ceil(saleProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = saleProducts.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  useEffect(() => {
    setPage(1);
  }, [sort]);

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <MainHeader />
      <NavBar />

      <main className="container py-6">
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
          <Link href="/" className="hover:text-foreground">
            {t("Home", "الرئيسية")}
          </Link>
          <ChevronRight size={12} />
          <span className="text-foreground">{t("Sale", "تخفيضات")}</span>
        </nav>

        <div className="mb-6">
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-2">{t("Sale", "تخفيضات")}</h1>
          <p className="text-sm text-muted-foreground">
            {t("Shop our best deals and discounted items.", "تسوق أفضل العروض والمنتجات المخفضة.")}
          </p>
        </div>

        <SortControls
          sort={sort}
          onSortChange={setSort}
          viewMode={viewMode}
          onViewChange={setViewMode}
          resultCount={saleProducts.length}
        />

        {paginatedProducts.length > 0 ? (
          <div
            className={`mt-6 grid gap-4 md:gap-6 ${
              viewMode === "grid" ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-2 md:grid-cols-4"
            }`}
          >
            {paginatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} compact={viewMode === "compact"} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-muted-foreground">
              {t("No sale items available right now.", "لا توجد منتجات مخفضة حالياً.")}
            </p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => {
                  setPage(p);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`w-9 h-9 rounded-md text-sm font-medium transition-colors ${
                  p === page
                    ? "bg-header text-header-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default SalePage;
