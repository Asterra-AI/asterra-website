"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Fragment, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const words = (phrase: string) => phrase.split(" ");

/** Parent: no motion of its own on enter, it only staggers its words. */
const phraseVariants = {
  hidden: { y: 0, opacity: 1 },
  visible: { y: 0, opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.02 } },
};

const wordVariants = {
  hidden: { y: "70%", opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const wordTransition = { type: "spring", stiffness: 380, damping: 26, mass: 0.8 } as const;
const exitTransition = { type: "spring", stiffness: 300, damping: 28, mass: 0.9 } as const;

type Props = {
  phrases: readonly string[];
  /** Milliseconds each phrase stays. */
  interval?: number;
  className?: string;
};

/**
 * Cycles through phrases with a slide-up. The first phrase is server-rendered,
 * so the H1 in the page source reads as a complete sentence. Rotation is
 * visual only: aria-live is off and it stops under reduced motion.
 */
export function RotatingPhrase({ phrases, interval = 2500, className }: Props) {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduceMotion || phrases.length < 2) return;
    let id: ReturnType<typeof setInterval> | null = null;
    const start = () => {
      if (id === null) id = setInterval(() => setIndex((i) => (i + 1) % phrases.length), interval);
    };
    const stop = () => {
      if (id !== null) clearInterval(id);
      id = null;
    };
    const onVisibility = () => (document.hidden ? stop() : start());
    start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduceMotion, interval, phrases.length]);

  return (
    <motion.span
      layout
      aria-live="off"
      className={cn("relative block overflow-hidden py-[0.1em] [margin-block:-0.1em]", className)}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {/* Words enter one at a time (staggered); the whole phrase leaves together, sliding up. */}
        <motion.span
          key={index}
          variants={phraseVariants}
          initial="hidden"
          animate="visible"
          exit={{ y: "-105%", opacity: 0, transition: exitTransition }}
          className="block"
        >
          {words(phrases[index]).map((word, i, all) => (
            <Fragment key={i}>
              <motion.span variants={wordVariants} transition={wordTransition} className="inline-block">
                {word}
                {i === all.length - 1 && "."}
              </motion.span>
              {i < all.length - 1 && " "}
            </Fragment>
          ))}
        </motion.span>
      </AnimatePresence>
    </motion.span>
  );
}
