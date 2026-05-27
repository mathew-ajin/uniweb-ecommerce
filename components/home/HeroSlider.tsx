"use client"
import { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale } from '@/hooks/useLocale';
import { heroSlides } from '@/data/mock/heroSlides';
import Image from 'next/image';

const AUTOPLAY_MS = 6000;

const contentVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

const HeroSlider = () => {
  const { t, formatPrice, dir } = useLocale();
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Preload all hero images before showing slider
  useEffect(() => {
    let mounted = true;

    const promises = heroSlides.map(
      (slide) =>
        new Promise<void>((resolve) => {
          const img = new window.Image();

          img.onload = () => resolve();
          img.onerror = () => resolve();

          img.src = typeof slide.image === "string" ? slide.image : slide.image.src;
        }),
    );

    Promise.all(promises).then(() => {
      if (mounted) setImagesLoaded(true);
    });

    return () => {
      mounted = false;
    };
  }, []);

  const goTo = useCallback((index: number, dir: number) => {
    setDirection(dir);
    setCurrent(index);
  }, []);

  const next = useCallback(() => {
    goTo((current + 1) % heroSlides.length, 1);
  }, [current, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + heroSlides.length) % heroSlides.length, -1);
  }, [current, goTo]);

  // Autoplay
  useEffect(() => {
    if (!imagesLoaded) return;
    timerRef.current = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % heroSlides.length);
    }, AUTOPLAY_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [imagesLoaded]);

  const slide = heroSlides[current];

  // Horizontal slide variants — adjust for RTL
  const isRtl = dir === 'rtl';
  const slideVariants = {
    enter: (d: number) => ({
      x: `${(isRtl ? -d : d) * 100}%`,
      opacity: 1,
    }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({
      x: `${(isRtl ? d : -d) * 100}%`,
      opacity: 1,
    }),
  };

  if (!imagesLoaded) {
    return (
      <section className="relative w-full overflow-hidden bg-secondary">
        <div className="aspect-[16/7] md:aspect-[16/6] lg:aspect-[16/5.5] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full overflow-hidden bg-secondary">
      <div className="relative aspect-[16/7] md:aspect-[16/6] lg:aspect-[16/5.5]">
        {/* Sliding images only */}
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={slide.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute inset-0 will-change-transform"
          >
            <Image src={slide.image} alt={t(slide.productTitle)} fill className="object-cover" loading="eager" priority />
          </motion.div>
        </AnimatePresence>

        {/* Fixed promotional card – only inner content animates */}
        <div className="absolute bottom-6 start-3 md:bottom-12 md:start-12 lg:bottom-16 lg:start-16 z-10">
          <div className="bg-background/90 backdrop-blur-sm rounded-lg md:rounded-xl px-2.5 py-2 md:p-6 shadow-hero max-w-[160px] md:max-w-sm overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                variants={contentVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                {slide.productSubtitle && (
                  <p className="hidden md:block text-sm font-medium text-brand uppercase tracking-wider mb-1">
                    {t(slide.productSubtitle)}
                  </p>
                )}
                <h2 className="text-[13px] md:text-xl lg:text-2xl font-heading font-bold text-foreground leading-tight mb-1 md:mb-3">
                  {t(slide.productTitle)}
                </h2>
                <div className="flex items-center gap-1.5 md:gap-3 mb-1.5 md:mb-4">
                  <span className="text-muted-foreground line-through text-[10px] md:text-sm">
                    {formatPrice(slide.oldPrice)}
                  </span>
                  <span className="text-brand font-bold text-[13px] md:text-xl">{formatPrice(slide.newPrice)}</span>
                </div>
                <a
                  href={slide.ctaHref}
                  className="inline-flex items-center justify-center px-3 py-1 md:px-6 md:py-2.5 bg-header text-header-foreground text-[11px] md:text-sm font-medium rounded-md hover:bg-header/90 transition-colors"
                >
                  {t(slide.ctaLabel)}
                </a>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Arrows */}
        <button
          onClick={prev}
          className="hidden md:flex absolute top-1/2 start-3 -translate-y-1/2 bg-background/60 backdrop-blur-sm hover:bg-background/80 rounded-full p-2 transition-colors z-10"
          aria-label="Previous"
        >
          {dir === "rtl" ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
        <button
          onClick={next}
          className="hidden md:flex absolute top-1/2 end-3 -translate-y-1/2 bg-background/60 backdrop-blur-sm hover:bg-background/80 rounded-full p-2 transition-colors z-10"
          aria-label="Next"
        >
          {dir === "rtl" ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>

        {/* Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i, i > current ? 1 : -1)}
              className={`rounded-full transition-all ${i === current ? "w-6 h-2 bg-brand" : "w-2 h-2 bg-foreground/30"}`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;
