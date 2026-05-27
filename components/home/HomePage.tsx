import TopBar from "@/components/layout/TopBar";
import MainHeader from "@/components/layout/MainHeader";
import NavBar from "@/components/layout/NavBar";
import HeroSlider from "@/components/home/HeroSlider";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import ProductSection from "@/components/home/ProductSection";
import PromoBanners from "@/components/home/PromoBanners";
import NewsletterBlock from "@/components/home/NewsletterBlock";
import Footer from "@/components/layout/Footer";
import LoadingScreen from "@/components/layout/LoadingScreen";
import { getBestSellers, getNewArrivals } from "@/data/mock/products";

const bestSellers = getBestSellers();
const newArrivals = getNewArrivals();

const HomePage = () => {
  return (
    <>
      <LoadingScreen />
      <div className="min-h-screen bg-background">
        <TopBar />
        <MainHeader />
        <NavBar />
        <main>
          <HeroSlider />
          <FeaturedCategories />
          <ProductSection
            titleEn="Best Sellers"
            titleAr="الأكثر مبيعاً"
            products={bestSellers}
            viewAllHref="/shop?sort=popular"
          />
          <PromoBanners />
          <ProductSection
            titleEn="New Arrivals"
            titleAr="وصل حديثاً"
            products={newArrivals}
            viewAllHref="/shop?sort=newest"
          />
          <NewsletterBlock />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default HomePage;
