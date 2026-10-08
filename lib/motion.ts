import type { Transition } from "motion/react";

/** Shared spring presets so every hover, press and slide on the site feels like one material. */
export const springs = {
  /** Hover scales: quick, with a small overshoot that settles. */
  hover: { type: "spring", stiffness: 340, damping: 20, mass: 0.8 } satisfies Transition,
  /** Press-down: snappy, almost no bounce. */
  press: { type: "spring", stiffness: 600, damping: 32, mass: 0.6 } satisfies Transition,
  /** Moving UI between positions (nav highlight, panel resize). */
  slide: { type: "spring", stiffness: 420, damping: 34, mass: 0.8 } satisfies Transition,
} as const;
