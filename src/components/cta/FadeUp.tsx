"use client";
import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

interface FadeUpProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}

export function FadeUp({ children, delay = 0, y = 24, className }: FadeUpProps) {
  const variants: Variants = {
    hidden: { opacity: 0, y },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}
