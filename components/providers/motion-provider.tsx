"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/** Site-wide Motion defaults. `reducedMotion="user"` disables transform/layout animation for people who ask for it. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
