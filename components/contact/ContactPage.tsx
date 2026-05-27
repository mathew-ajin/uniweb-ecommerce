"use client"
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import TopBar from "@/components/layout/TopBar";
import MainHeader from "@/components/layout/MainHeader";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import { useLocale } from "@/hooks/useLocale";
import { contactInfo } from "@/data/mock/siteContent";

const ContactPage = () => {
  const { t, lang } = useLocale();
  const isAr = lang === "ar";

  const infoCards = [
    {
      icon: MapPin,
      label: isAr ? "العنوان" : "Address",
      value: t(contactInfo.address),
      href: "https://www.google.com/maps/search/Shuwaikh+Port+Free+Trade+Zone+Kuwait+City+Kuwait",
    },
    { icon: Phone, label: isAr ? "الهاتف" : "Phone", value: contactInfo.phone, href: "tel:+96550404099" },
    {
      icon: Mail,
      label: isAr ? "البريد الإلكتروني" : "Email",
      value: contactInfo.email,
      href: "mailto:uniwebonline.com",
    },
    { icon: MessageCircle, label: isAr ? "واتساب" : "WhatsApp", value: "+965 50404099", href: "https://wa.me/96550404099" },
    { icon: Clock, label: isAr ? "ساعات العمل" : "Working Hours", value: t(contactInfo.workingHours), href: undefined },
  ];

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <MainHeader />
      <NavBar />
      <main>
        {/* Hero */}
        <section className="bg-header text-header-foreground py-14 md:py-20">
          <div className="container text-center max-w-3xl">
            <h1 className="font-heading text-3xl md:text-5xl font-bold mb-3">{isAr ? "تواصل معنا" : "Contact Us"}</h1>
            <p className="text-header-muted text-lg" style={{textAlign:"center"}}>
              {isAr ? "نحن هنا لمساعدتك. تواصل معنا في أي وقت." : "We're here to help. Reach out to us anytime."}
            </p>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="py-12">
          <div className="container max-w-5xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {infoCards.map((c) => {
              const content = (
                <>
                  <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center mx-auto mb-3">
                    <c.icon size={18} className="text-brand" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">{c.label}</h3>
                  <p className="text-xs text-muted-foreground">{c.value}</p>
                </>
              );

              return c.href ? (
                <a
                  key={c.label}
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-card border border-border rounded-xl p-5 text-center cursor-pointer transition-all duration-200 hover:border-brand/40 hover:shadow-md"
                >
                  {content}
                </a>
              ) : (
                <div key={c.label} className="bg-card border border-border rounded-xl p-5 text-center">
                  {content}
                </div>
              );
            })}
          </div>
        </section>

        {/* Map */}
        <section className="pb-16">
          <div className="container max-w-5xl">
            <div className="rounded-xl overflow-hidden border border-border" style={{ height: 400 }}>
              <iframe
                src={contactInfo.mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Uniweb"
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;
