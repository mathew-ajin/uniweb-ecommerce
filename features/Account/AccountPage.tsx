"use client";
import AccountAddresses from "@/components/account/AccountAddresses";
import AccountDashboard from "@/components/account/AccountDashboard";
import AccountNotifications from "@/components/account/AccountNotifications";
import AccountOrders from "@/components/account/AccountOrders";
import AccountProfile from "@/components/account/AccountProfile";
import AccountRecentlyViewed from "@/components/account/AccountRecentlyViewed";
import AccountSecurity from "@/components/account/AccountSecurity";
import AccountTracking from "@/components/account/AccountTracking";
import AccountWishlistSection from "@/components/account/AccountWishlist";
import Footer from "@/components/layout/Footer";
import MainHeader from "@/components/layout/MainHeader";
import NavBar from "@/components/layout/NavBar";
import TopBar from "@/components/layout/TopBar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/context/AuthContext";
import { useLocale } from "@/hooks/useLocale";
import {
  Bell,
  ChevronRight,
  Clock,
  Heart,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  Package,
  Shield,
  ShoppingBag,
  User,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type AccountSection =
  | "dashboard"
  | "profile"
  | "orders"
  | "tracking"
  | "addresses"
  | "wishlist"
  | "recently-viewed"
  | "notifications"
  | "security";

const sidebarItems: { id: AccountSection; icon: typeof LayoutDashboard; label: { en: string; ar: string } }[] = [
  { id: "dashboard", icon: LayoutDashboard, label: { en: "Dashboard", ar: "لوحة التحكم" } },
  { id: "profile", icon: User, label: { en: "Profile Details", ar: "تفاصيل الحساب" } },
  { id: "orders", icon: ShoppingBag, label: { en: "My Orders", ar: "طلباتي" } },
  { id: "tracking", icon: Package, label: { en: "Order Tracking", ar: "تتبع الطلب" } },
  { id: "addresses", icon: MapPin, label: { en: "Addresses", ar: "العناوين" } },
  { id: "wishlist", icon: Heart, label: { en: "Wishlist", ar: "المفضلة" } },
  { id: "recently-viewed", icon: Clock, label: { en: "Recently Viewed", ar: "شوهد مؤخراً" } },
  { id: "notifications", icon: Bell, label: { en: "Notifications", ar: "الإشعارات" } },
  { id: "security", icon: Shield, label: { en: "Security", ar: "الأمان" } },
];

const AccountPage = () => {
  const { lang } = useLocale();
  const { isLoggedIn, isLoading, user, logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);

  const section = (searchParams.get("section") as AccountSection) || "dashboard";

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.replace("/login");
    }
  }, [isLoading, isLoggedIn, router]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const t = (en: string, ar: string) => (lang === "ar" ? ar : en);

  const setSection = (s: AccountSection) => {
    router.push(`/account?section=${s}`);
    setMobileOpen(false);
  };

  if (isLoading || !isLoggedIn) return null;

  const SidebarContent = () => (
    <div className="space-y-1">
      {/* User info */}
      <div className="p-4 border-b border-border mb-2">
        <div className="w-12 h-12 rounded-full bg-brand/10 text-brand flex items-center justify-center font-heading text-lg font-bold mb-2">
          {user?.fullName?.charAt(0) || "M"}
        </div>
        <p className="font-medium text-foreground text-sm">{user?.fullName || "User"}</p>
        <p className="text-xs text-muted-foreground">{user?.email || user?.phone}</p>
      </div>

      {sidebarItems.map((item) => {
        const Icon = item.icon;
        const active = section === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setSection(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg transition-colors ${
              active ? "bg-brand/10 text-brand font-medium" : "text-foreground hover:bg-secondary"
            }`}
          >
            <Icon size={18} />
            <span>{lang === "ar" ? item.label.ar : item.label.en}</span>
            {active && <ChevronRight size={14} className="ms-auto" />}
          </button>
        );
      })}

      <button
        onClick={() => {
          logout();
          router.push("/");
        }}
        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/5 rounded-lg transition-colors mt-4"
      >
        <LogOut size={18} />
        <span>{t("Logout", "تسجيل خروج")}</span>
      </button>
    </div>
  );

  const renderSection = () => {
    switch (section) {
      case "profile":
        return <AccountProfile />;
      case "orders":
        return <AccountOrders />;
      case "tracking":
        return <AccountTracking />;
      case "addresses":
        return <AccountAddresses />;
      case "wishlist":
        return <AccountWishlistSection />;
      case "recently-viewed":
        return <AccountRecentlyViewed />;
      case "notifications":
        return <AccountNotifications />;
      case "security":
        return <AccountSecurity />;
      default:
        return <AccountDashboard onNavigate={setSection} />;
    }
  };

  const currentLabel = sidebarItems.find((i) => i.id === section);

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <MainHeader />
      <NavBar />

      <main className="container py-6 md:py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
          <a href="/" className="hover:text-foreground">
            {t("Home", "الرئيسية")}
          </a>
          <ChevronRight size={12} />
          <span className="text-foreground">{t("My Account", "حسابي")}</span>
          {section !== "dashboard" && currentLabel && (
            <>
              <ChevronRight size={12} />
              <span className="text-foreground">{lang === "ar" ? currentLabel.label.ar : currentLabel.label.en}</span>
            </>
          )}
        </nav>

        <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-6">{t("My Account", "حسابي")}</h1>

        <div className="flex gap-8">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-card rounded-xl border border-border p-2 sticky top-24">
              <SidebarContent />
            </div>
          </aside>

          {/* Mobile nav trigger */}
          <div className="lg:hidden fixed bottom-4 end-4 z-30">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <button className="bg-brand text-brand-foreground p-3 rounded-full shadow-lg">
                  <User size={22} />
                </button>
              </SheetTrigger>
              <SheetContent side={lang === "ar" ? "right" : "left"} className="w-[280px] p-4">
                <SidebarContent />
              </SheetContent>
            </Sheet>
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0">{renderSection()}</div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AccountPage;
