"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const BARS = [0.5, 0.9, 0.6, 1, 0.7, 0.95, 0.45];

export function Waveform({
  active,
  colour,
  className,
}: {
  active: boolean;
  colour: string;
  className?: string;
}) {
  return (
    <div aria-hidden className={cn("flex items-center gap-[3px]", className)}>
      {BARS.map((peak, i) => (
        <motion.span
          key={i}
          style={{ backgroundColor: colour }}
          animate={active ? { scaleY: [0.25, peak, 0.35, peak * 0.8, 0.25] } : { scaleY: 0.25 }}
          transition={
            active
              ? { duration: 1.1 + (i % 3) * 0.2, repeat: Infinity, ease: "easeInOut", delay: i * 0.08 }
              : { duration: 0.3 }
          }
          className="block h-full w-[3px] origin-center rounded-full"
        />
      ))}
    </div>
  );
}
