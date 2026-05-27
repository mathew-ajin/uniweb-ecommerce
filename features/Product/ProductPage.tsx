"use client";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import ProductSection from "@/components/home/ProductSection";
import Footer from "@/components/layout/Footer";
import MainHeader from "@/components/layout/MainHeader";
import NavBar from "@/components/layout/NavBar";
import TopBar from "@/components/layout/TopBar";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import ProductTabs from "@/components/product/ProductTabs";
import ReviewsSection from "@/components/product/ReviewsSection";
import { getProductBySlug, getRelatedProducts, products } from "@/data/mock/products";
import { useLocale } from "@/hooks/useLocale";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";

const ProductPage = () => {
  const params = useParams();
  const slug = params.productSlug as string;
  const searchParams = useSearchParams();
  const { t, lang } = useLocale();
  const { viewedIds, addViewed } = useRecentlyViewed();
    const product = getProductBySlug(slug || "");
    // console.log("URL slug:", slug);
    // console.log("Found product:", getProductBySlug(slug));

  // Resolve initial variant from URL params
  const initialColor = useMemo(() => {
    const c = searchParams.get("color");
    if (c && product) return product.colors.find((cl) => cl.id === c)?.id || product.colors[0]?.id || "";
    return product?.colors[0]?.id || "";
  }, [searchParams, product]);

  const initialSize = useMemo(() => {
    const s = searchParams.get("size");
    if (s && product) return product.sizes.find((sz) => sz.id === s)?.id || "";
    return "";
  }, [searchParams, product]);

  const [selectedColorId, setSelectedColorId] = useState(initialColor);

  useEffect(() => {
    if (product) addViewed(product.id);
    window.scrollTo(0, 0);
  }, [product, addViewed]);

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <TopBar />
        <MainHeader />
        <NavBar />
        <div className="container py-20 text-center">
          <h1 className="font-heading text-2xl font-bold text-foreground mb-4">
            {lang === "ar" ? "المنتج غير موجود" : "Product Not Found"}
          </h1>
          <Link href="/shop" className="text-brand hover:underline">
            {lang === "ar" ? "تصفح المتجر" : "Browse Shop"}
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const related = getRelatedProducts(product.id);
  const recentProducts = viewedIds
    .filter((id) => id !== product.id)
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean) as typeof products;

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <MainHeader />
      <NavBar />

      <main className="container py-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6 overflow-x-auto">
          <Link href="/" className="hover:text-foreground whitespace-nowrap">
            {lang === "ar" ? "الرئيسية" : "Home"}
          </Link>
          <ChevronRight size={12} />
          <Link href="/shop" className="hover:text-foreground whitespace-nowrap">
            {lang === "ar" ? "المتجر" : "Shop"}
          </Link>
          <ChevronRight size={12} />
          <span className="text-foreground truncate">{t(product.name)}</span>
        </nav>

        {/* Product main */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
          <ProductGallery images={product.images} selectedColorId={selectedColorId} />
          <ProductInfo
            product={product}
            onColorChange={setSelectedColorId}
            initialColor={initialColor}
            initialSize={initialSize}
          />
        </div>

        <ProductTabs product={product} />

        <div className="mt-12">
          <ReviewsSection reviews={product.reviews} rating={product.rating} reviewCount={product.reviewCount} />
        </div>
      </main>

      {related.length > 0 && (
        <ProductSection titleEn="Related Products" titleAr="منتجات مشابهة" products={related} viewAllHref="/shop" />
      )}

      {recentProducts.length > 0 && (
        <ProductSection titleEn="Recently Viewed" titleAr="شاهدتها مؤخراً" products={recentProducts} viewAllHref="/shop" />
      )}

      <Footer />
    </div>
  );
};

export default ProductPage;
