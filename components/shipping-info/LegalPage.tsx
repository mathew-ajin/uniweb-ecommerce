"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import TopBar from "@/components/layout/TopBar";
import MainHeader from "@/components/layout/MainHeader";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import { useLocale } from "@/hooks/useLocale";
import {
  privacyPolicyContent,
  termsContent,
  shippingInfoContent,
  returnsContent,
  contactInfo,
  type LegalPageContent,
  type ShippingPageContent,
  type ReturnsPageContent,
} from "@/data/mock/siteContent";

const pageMap: Record<string, LegalPageContent | ShippingPageContent | ReturnsPageContent> = {
  "/privacy-policy": privacyPolicyContent,
  "/terms-conditions": termsContent,
  "/shipping-info": shippingInfoContent,
  "/returns-exchange": returnsContent,
};

const LegalPage = () => {
  const { t, lang } = useLocale();
  const pathname = usePathname();
  const isAr = lang === "ar";

  const content = pageMap[pathname];
  if (!content) return null;

  const hasContactNote = "contactNote" in content;

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <MainHeader />
      <NavBar />
      <main>
        {/* Hero */}
        <section className="bg-header text-header-foreground py-12 md:py-16">
          <div className="container text-center max-w-3xl">
            <h1 className="font-heading text-3xl md:text-4xl font-bold">{t(content.title)}</h1>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container max-w-3xl">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-8">
              <Link href="/" className="hover:text-foreground">
                {isAr ? "الرئيسية" : "Home"}
              </Link>
              <ChevronRight size={12} />
              <span className="text-foreground">{t(content.title)}</span>
            </nav>

            {/* Intro */}
            <p className="text-muted-foreground leading-relaxed mb-10 text-base">{t(content.intro)}</p>

            {/* Sections */}
            <div className="space-y-8">
              {content.sections.map((section, i) => (
                <div key={i}>
                  <h2 className="font-heading text-lg font-bold text-foreground mb-3">{t(section.title)}</h2>
                  <p className="text-muted-foreground leading-relaxed text-sm">{t(section.body)}</p>
                </div>
              ))}
            </div>

            {/* Contact Note */}
            {hasContactNote && (
              <div className="mt-12 p-6 bg-secondary/50 rounded-xl border border-border">
                <h3 className="font-semibold text-foreground mb-2">{isAr ? "تواصل معنا" : "Contact Us"}</h3>
                <p className="text-sm text-muted-foreground">{t((content as LegalPageContent).contactNote)}</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default LegalPage;
