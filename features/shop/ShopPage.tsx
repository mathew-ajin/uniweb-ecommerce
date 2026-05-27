"use client"
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useParams, useSearchParams, useRouter, usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import TopBar from "@/components/layout/TopBar";
import MainHeader from "@/components/layout/MainHeader";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/common/ProductCard";
import FilterSidebar from "@/components/shop/FilterSidebar";
import SortControls from "@/components/shop/SortControls";
import SEOHead from "@/components/seo/SEOHead";
import { useLocale } from "@/hooks/useLocale";
import { products } from "@/data/mock/products";
import {
  getCategories,
  getCategoryBySlug,
  getSubcategoriesByCategory,
  getProductTypesBySubcategory,
} from "@/services/catalogService";
import { routes, getLegacyRedirect } from "@/lib/routes";
import type { ProductFilters, SortOption, ProductColor, CategoryItem } from "@/types/product";
import { Sheet, SheetContent } from "@/components/ui/sheet";

const ITEMS_PER_PAGE = 12;

const ShopPage = () => {
  const { lang } = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const categorySlug = params.categorySlug as string | undefined;
  const subcategorySlug = params.subcategorySlug as string | undefined;
  const typeSlug = params.typeSlug as string | undefined;
    //   const [searchParams] = useSearchParams();
    const searchParams = useSearchParams();

  // Legacy redirect
  useEffect(() => {
    if (!searchParams) return;

    const redirect = getLegacyRedirect(pathname, searchParams.toString());

    if (redirect) {
      router.replace(redirect);
    }
  }, [pathname, router]);

  // Resolve from catalog service
  const activeCategory = categorySlug ? getCategoryBySlug(categorySlug) : undefined;
  const activeSubcategory =
    subcategorySlug && activeCategory ? activeCategory.subcategories.find((s) => s.slug === subcategorySlug) : undefined;
  const activeProductType =
    typeSlug && activeCategory && activeSubcategory
      ? activeSubcategory.productTypes.find((pt) => pt.slug === typeSlug)
      : undefined;

  const [filters, setFilters] = useState<ProductFilters>({});
  const [sort, setSort] = useState<SortOption>("newest");
  const [viewMode, setViewMode] = useState<"grid" | "compact">("grid");
  const [page, setPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);

  // Sync filters with URL
  useEffect(() => {
    setFilters({
      categoryId: activeCategory?.id || undefined,
      subcategoryId: activeSubcategory?.slug || undefined,
      productTypeId: activeProductType?.slug || undefined,
    });
  }, [activeCategory, activeSubcategory, activeProductType]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [categorySlug, subcategorySlug, typeSlug]);

  const catalogCategories = useMemo(() => getCategories(), []);
  const shopCategories: CategoryItem[] = catalogCategories.map((c) => ({
    id: c.id,
    slug: c.slug,
    name: c.name,
    productCount: c.productCount,
  }));

  // Scope available filter options
  const scopedProducts = useMemo(() => {
    let scoped = [...products];
    if (activeCategory) scoped = scoped.filter((p) => p.categoryId === activeCategory.id);
    if (activeSubcategory) scoped = scoped.filter((p) => p.subcategoryId === activeSubcategory.slug);
    if (activeProductType) scoped = scoped.filter((p) => p.productTypeId === activeProductType.slug);
    return scoped;
  }, [activeCategory, activeSubcategory, activeProductType]);

  const allBrands = useMemo(() => [...new Set(scopedProducts.map((p) => p.brand.en))].sort(), [scopedProducts]);
  const allColors = useMemo(() => {
    const map = new Map<string, ProductColor>();
    scopedProducts.forEach((p) => p.colors.forEach((c) => map.set(c.id, c)));
    return [...map.values()];
  }, [scopedProducts]);

  const priceRange: [number, number] = useMemo(() => {
    if (scopedProducts.length === 0) return [0, 100];
    const prices = scopedProducts.map((p) => p.basePrice);
    return [Math.floor(Math.min(...prices)), Math.ceil(Math.max(...prices))];
  }, [scopedProducts]);

  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (filters.categoryId) result = result.filter((p) => p.categoryId === filters.categoryId);
    if (filters.subcategoryId) result = result.filter((p) => p.subcategoryId === filters.subcategoryId);
    if (filters.productTypeId) result = result.filter((p) => p.productTypeId === filters.productTypeId);
    if (filters.colors?.length) result = result.filter((p) => p.colors.some((c) => filters.colors!.includes(c.id)));
    if (filters.sizes?.length) result = result.filter((p) => p.sizes.some((s) => filters.sizes!.includes(s.id)));
    if (filters.brands?.length) result = result.filter((p) => filters.brands!.includes(p.brand.en));
    if (filters.priceRange) {
      const [min, max] = filters.priceRange;
      result = result.filter((p) => p.basePrice >= min && p.basePrice <= max);
    }
    if (filters.isOnSale) result = result.filter((p) => p.isOnSale);
    if (filters.inStock) result = result.filter((p) => p.inStock);

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
      case "newest":
      default:
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
    }
    return result;
  }, [filters, sort]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  useEffect(() => {
    setPage(1);
  }, [filters, sort]);

  const t = (en: string, ar: string) => (lang === "ar" ? ar : en);

  const categoryName = activeCategory ? (lang === "ar" ? activeCategory.name.ar : activeCategory.name.en) : "";
  const subcategoryName = activeSubcategory ? (lang === "ar" ? activeSubcategory.name.ar : activeSubcategory.name.en) : "";
  const typeName = activeProductType ? (lang === "ar" ? activeProductType.name.ar : activeProductType.name.en) : "";

  const pageTitle = activeProductType
    ? `${typeName} | ${subcategoryName} | ${categoryName} | Mayar Shop`
    : activeSubcategory
      ? `${subcategoryName} | ${categoryName} | Mayar Shop`
      : activeCategory
        ? `${categoryName} | Mayar Shop`
        : "Shop All | Mayar Shop";

  const pageDescription = activeProductType
    ? `Shop ${typeName} in ${subcategoryName} at Mayar Shop. Premium fashion and lifestyle.`
    : activeSubcategory
      ? `Shop ${subcategoryName} in ${categoryName} at Mayar Shop. Premium fashion and lifestyle.`
      : activeCategory?.description
        ? lang === "ar"
          ? activeCategory.description.ar
          : activeCategory.description.en
        : "Discover our curated collection of premium fashion and lifestyle at Mayar Shop.";

  const canonicalPath =
    activeProductType && activeSubcategory && activeCategory
      ? routes.productType(activeCategory.slug, activeSubcategory.slug, activeProductType.slug)
      : activeSubcategory && activeCategory
        ? routes.subcategory(activeCategory.slug, activeSubcategory.slug)
        : activeCategory
          ? routes.category(activeCategory.slug)
          : routes.shop;

  const heading = activeProductType
    ? typeName
    : activeSubcategory
      ? subcategoryName
      : activeCategory
        ? categoryName
        : t("Shop All", "تسوق الكل");

  const chips = [
    {
      label: t("All", "الكل"),
      active: !filters.categoryId && !filters.isOnSale,
      onClick: () => {
        router.push(routes.shop);
        setFilters({});
      },
    },
    { label: t("New Arrivals", "وصل حديثاً"), active: false, onClick: () => setSort("newest") },
    {
      label: t("On Sale", "تخفيضات"),
      active: !!filters.isOnSale,
      onClick: () => setFilters((f) => ({ ...f, isOnSale: !f.isOnSale })),
    },
    { label: t("Best Sellers", "الأكثر مبيعاً"), active: false, onClick: () => setSort("popular") },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={pageTitle}
        description={pageDescription}
        canonical={`https://mayar-shop-hero.lovable.app${canonicalPath}`}
      />
      <TopBar />
      <MainHeader />
      <NavBar />

      <main className="container py-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-foreground">
            {t("Home", "الرئيسية")}
          </Link>
          <ChevronRight size={12} />
          {activeCategory ? (
            <>
              <Link href={routes.shop} className="hover:text-foreground">
                {t("Shop", "المتجر")}
              </Link>
              <ChevronRight size={12} />
              {activeSubcategory ? (
                <>
                  <Link href={routes.category(activeCategory.slug)} className="hover:text-foreground capitalize">
                    {categoryName}
                  </Link>
                  <ChevronRight size={12} />
                  {activeProductType ? (
                    <>
                      <Link
                        href={routes.subcategory(activeCategory.slug, activeSubcategory.slug)}
                        className="hover:text-foreground"
                      >
                        {subcategoryName}
                      </Link>
                      <ChevronRight size={12} />
                      <span className="text-foreground">{typeName}</span>
                    </>
                  ) : (
                    <span className="text-foreground">{subcategoryName}</span>
                  )}
                </>
              ) : (
                <span className="text-foreground">{categoryName}</span>
              )}
            </>
          ) : (
            <span className="text-foreground">{t("Shop", "المتجر")}</span>
          )}
        </nav>

        <div className="mb-6">
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-2">{heading}</h1>
          <p className="text-sm text-muted-foreground">{pageDescription}</p>
        </div>

        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {chips.map((chip) => (
            <button
              key={chip.label}
              onClick={chip.onClick}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                chip.active
                  ? "bg-header text-header-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>

        <div className="flex gap-8">
          <aside className="hidden lg:block w-60 flex-shrink-0">
            <FilterSidebar
              filters={filters}
              onChange={setFilters}
              categories={shopCategories}
              brands={allBrands}
              colors={allColors}
              priceRange={priceRange}
            />
          </aside>

          <div className="flex-1 min-w-0">
            <SortControls
              sort={sort}
              onSortChange={setSort}
              viewMode={viewMode}
              onViewChange={setViewMode}
              resultCount={filteredProducts.length}
              onFilterToggle={() => setFilterOpen(true)}
            />

            {paginatedProducts.length > 0 ? (
              <div
                className={`mt-6 grid gap-4 md:gap-6 ${viewMode === "grid" ? "grid-cols-2 md:grid-cols-3" : "grid-cols-2 md:grid-cols-4"}`}
              >
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} compact={viewMode === "compact"} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center">
                <p className="text-muted-foreground">{t("No products match your filters.", "لا توجد منتجات مطابقة.")}</p>
                <button
                  onClick={() => {
                    setFilters({});
                    router.push(routes.shop);
                  }}
                  className="mt-2 text-sm text-brand hover:underline"
                >
                  {t("Clear filters", "مسح التصفية")}
                </button>
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
          </div>
        </div>
      </main>

      <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
        <SheetContent side={lang === "ar" ? "right" : "left"} className="w-[300px] overflow-y-auto">
          <FilterSidebar
            filters={filters}
            onChange={(f) => setFilters(f)}
            categories={shopCategories}
            brands={allBrands}
            colors={allColors}
            priceRange={priceRange}
            onClose={() => setFilterOpen(false)}
          />
        </SheetContent>
      </Sheet>

      <Footer />
    </div>
  );
};

export default ShopPage;
