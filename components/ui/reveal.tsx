"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Seconds to wait once in view. */
  delay?: number;
  /** How much of the element must be visible before it reveals (0–1). */
  amount?: number;
  className?: string;
};

/** Fades and rises content into place the first time it scrolls into view. */
export function Reveal({ children, delay = 0, amount = 0.5, className }: Props) {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return <div className={className}>{children}</div>;
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
