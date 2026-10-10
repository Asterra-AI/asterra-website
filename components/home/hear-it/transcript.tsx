"use client";

import { AnimatePresence, motion } from "motion/react";
import type { Line } from "./use-mock-call";
import { cn } from "@/lib/utils";

export function Transcript({
  lines,
  restaurant,
  className,
}: {
  lines: Line[];
  restaurant: string;
  className?: string;
}) {
  const shown = lines.slice(-2);
  return (
    <div aria-live="polite" className={cn("flex min-h-[4.5rem] flex-col justify-end gap-2", className)}>
      <AnimatePresence initial={false} mode="popLayout">
        {shown.map((line, i) => (
          <motion.p
            key={`${lines.length - shown.length + i}-${line.who}`}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            className="text-[15px] leading-snug"
          >
            <span className={cn("mr-2 font-semibold", line.who === "ai" ? "text-ink" : "text-ink-3")}>
              {line.who === "ai" ? restaurant : "You"}
            </span>
            <span className={line.who === "ai" ? "text-ink-2" : "text-ink"}>{line.text}</span>
          </motion.p>
        ))}
      </AnimatePresence>
    </div>
  );
}
