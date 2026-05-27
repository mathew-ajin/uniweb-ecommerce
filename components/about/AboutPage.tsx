"use client"
import { Eye, Target, MapPin, Phone, Mail, Clock } from "lucide-react";
import TopBar from "@/components/layout/TopBar";
import MainHeader from "@/components/layout/MainHeader";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import { useLocale } from "@/hooks/useLocale";
import { aboutPageContent, contactInfo } from "@/data/mock/siteContent";

const AboutPage = () => {
  const { t, lang } = useLocale();
  const isAr = lang === "ar";
  const c = aboutPageContent;

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <MainHeader />
      <NavBar />
      <main>
        {/* Hero */}
        <section className="bg-header text-header-foreground py-16 md:py-24">
          <div className="container text-center max-w-3xl">
            <h1 className="font-heading text-3xl md:text-5xl font-bold mb-4">{t(c.heroTitle)}</h1>
            <p className="text-header-muted text-lg md:text-xl">{t(c.heroSubtitle)}</p>
          </div>
        </section>

        {/* Who We Are */}
        <section className="py-14 md:py-20">
          <div className="container max-w-4xl">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-6">
              {isAr ? "من نحن" : "Who We Are"}
            </h2>
            {t(c.whoWeAre)
              .split("\n\n")
              .map((p, i) => (
                <p key={i} className="text-muted-foreground leading-relaxed mb-4 text-base">
                  {p}
                </p>
              ))}
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="bg-secondary/30 py-14 md:py-20">
          <div className="container max-w-5xl grid md:grid-cols-2 gap-8">
            <div className="bg-card border border-border rounded-xl p-8">
              <div className="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center mb-5">
                <Eye size={24} className="text-brand" />
              </div>
              <h3 className="font-heading text-xl font-bold text-foreground mb-4">{isAr ? "رؤيتنا" : "Our Vision"}</h3>
              <p className="text-muted-foreground leading-relaxed">{t(c.vision)}</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-8">
              <div className="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center mb-5">
                <Target size={24} className="text-brand" />
              </div>
              <h3 className="font-heading text-xl font-bold text-foreground mb-4">{isAr ? "مهمتنا" : "Our Mission"}</h3>
              <p className="text-muted-foreground leading-relaxed">{t(c.mission)}</p>
            </div>
          </div>
        </section>

        {/* Contact Strip */}
        <section className="bg-header text-header-foreground py-10">
          <div className="container max-w-4xl">
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="flex flex-col items-center gap-2">
                <MapPin size={20} className="text-brand" />
                <span className="text-xs text-header-muted">{t(contactInfo.address)}</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Phone size={20} className="text-brand" />
                <span className="text-xs text-header-muted">{contactInfo.phone}</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Mail size={20} className="text-brand" />
                <span className="text-xs text-header-muted">{contactInfo.email}</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Clock size={20} className="text-brand" />
                <span className="text-xs text-header-muted">{t(contactInfo.workingHours)}</span>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
