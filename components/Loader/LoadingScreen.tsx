"use client";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";

const LoadingScreen = () => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setVisible(false), 2700); // 2.7s total
        return () => clearTimeout(timer);
    }, []);
    return (
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center"
          >
            {/* Animated cart icon */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative mb-8"
            >
              {/* Cart with bounce */}
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}>
                <div className="relative">
                  <ShoppingBag size={48} className="text-header" strokeWidth={1.5} />
                  {/* Little items popping in */}
                  <motion.div
                    animate={{ opacity: [0, 1, 0], y: [-2, -12, -2], scale: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
                    className="absolute -top-2 -end-1 w-3 h-3 rounded-full bg-brand"
                  />
                  <motion.div
                    animate={{ opacity: [0, 1, 0], y: [-2, -10, -2], scale: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.7 }}
                    className="absolute -top-1 start-1 w-2 h-2 rounded-full bg-brand-warm"
                  />
                  <motion.div
                    animate={{ opacity: [0, 1, 0], y: [-2, -14, -2], scale: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1.2 }}
                    className="absolute -top-3 start-4 w-2.5 h-2.5 rounded-sm bg-header/60"
                  />
                </div>
              </motion.div>
            </motion.div>

            {/* Logo reveal */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-center"
            >
              <h1 className="text-3xl md:text-4xl font-heading tracking-tight">
                <span className="font-bold text-foreground">Uniweb</span>
                <span className="font-light text-brand ms-2">Shop</span>
              </h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="text-xs text-muted-foreground mt-2 tracking-widest uppercase"
              >
                Premium Shopping Experience
              </motion.p>
            </motion.div>

            {/* Progress bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-8 w-32 h-0.5 bg-secondary rounded-full overflow-hidden"
            >
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2.5, ease: "easeInOut" }}
                className="h-full bg-brand rounded-full"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
};

export default LoadingScreen;