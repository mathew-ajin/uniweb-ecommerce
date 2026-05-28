import { useTrackingPopup } from "@/context/TrackingPopupContext";
import { useLocale } from "@/hooks/useLocale";
import logoImg from "@/public/assets/company/logo.png";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { X } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const TrackingPopupGlobal = () => {
  const { lang } = useLocale();
  const { isOpen, close } = useTrackingPopup();
  const router = useRouter();
  const pathname = usePathname();
  const isAr = lang === "ar";
  const isHome = pathname === "/";

  const [mobile, setMobile] = useState("");
  const [trackingId, setTrackingId] = useState("");
  const [error, setError] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);

  // Preload logo image
  useEffect(() => {
    const preloadLink = document.createElement("link");
    preloadLink.rel = "preload";
    preloadLink.as = "image";
    preloadLink.href = typeof logoImg === "string" ? logoImg : logoImg.src;
    document.head.appendChild(preloadLink);
    return () => {
      document.head.removeChild(preloadLink);
    };
  }, []);

  // Reset error when popup closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => setError(""), 0);
    }
  }, [isOpen]);

  // Close on outside click if not home
  useEffect(() => {
    if (!isOpen || isHome) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        close();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen, isHome, close]);

  // If on home page, rely on FloatingTrackingBar
  if (isHome) return null;

  const handleTrack = () => {
    if (!mobile.trim() || !trackingId.trim()) {
      setError(isAr ? "يرجى إدخال رقم الجوال ورقم التتبع" : "Please enter mobile number and tracking ID");
      return;
    }
    setError("");
    router.push(`/track-order?mobile=${encodeURIComponent(mobile.trim())}&id=${encodeURIComponent(trackingId.trim())}`);
    close();
    setMobile("");
    setTrackingId("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-md" ref={panelRef}>
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.97 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <div className="bg-card border border-border rounded-2xl shadow-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <Image src={logoImg} alt="Uniweb" className="h-6 w-auto" loading="eager" priority={true} />
                  <h3 className="text-sm font-semibold text-foreground font-display">
                    {isAr ? "تتبع الطرد" : "Track Package"}
                  </h3>
                </div>
                <button onClick={close} className="p-1 text-muted-foreground hover:text-foreground transition-colors">
                  <X size={16} />
                </button>
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                {isAr ? "تتبع طلبك في الوقت الحقيقي بأمان" : "Safe & secure real-time order tracking"}
              </p>
              <div className="space-y-3">
                <input
                  type="tel"
                  placeholder={isAr ? "رقم الجوال" : "Mobile Number"}
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full h-10 px-3 bg-secondary border-0 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <input
                  type="text"
                  placeholder={isAr ? "رقم التتبع (مثال: MYR-2024-001)" : "Tracking ID (e.g. MYR-2024-001)"}
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  className="w-full h-10 px-3 bg-secondary border-0 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                {error && <p className="text-xs text-destructive">{error}</p>}
                <button
                  onClick={handleTrack}
                  className="w-full h-10 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  {isAr ? "تتبع" : "Track"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TrackingPopupGlobal;
