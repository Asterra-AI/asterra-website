"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { concepts, type Concept } from "@/lib/toy";
import { cn } from "@/lib/utils";

type Props = {
  selected: Concept;
  onSelect: (c: Concept) => void;
  disabled?: boolean;
  /** What the centre card shows for the selected restaurant. */
  children: ReactNode;
  className?: string;
};

const SIDE = 216;
const GAP = 14;
const n = concepts.length;
const glide = { type: "spring", stiffness: 170, damping: 26, mass: 1 } as const;
const fade = { duration: 0.28, ease: [0.25, 1, 0.5, 1] as const };

/**
 * A coverflow. The selected restaurant is one large frosted card in the
 * middle; its neighbours sit smaller and quieter to either side. Click a side
 * card to bring it to the centre. Loops.
 */
export function Stage({ selected, onSelect, disabled, children, className }: Props) {
  const reduceMotion = useReducedMotion();
  const index = concepts.findIndex((c) => c.id === selected.id);
  const frame = useRef<HTMLDivElement | null>(null);
  const activeRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(1200);
  const [height, setHeight] = useState(172);

  const centre = Math.min(600, width - 32);
  const step1 = centre / 2 + GAP + SIDE / 2;
  const step2 = step1 + SIDE + GAP;

  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // The frame takes the centre card's height, so the call UI can grow.
  useEffect(() => {
    const el = activeRef.current;
    if (!el) return;
    const measure = () => setHeight(el.getBoundingClientRect().height);
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    measure();
    return () => ro.disconnect();
  }, [selected.id]);

  const offsetOf = (i: number) => ((((i - index) % n) + n + n / 2) % n) - n / 2;
  const pick = (dir: number) => {
    if (!dir || disabled) return;
    onSelect(concepts[(((index + dir) % n) + n) % n]);
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      pick(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      pick(-1);
    }
  };
  const posFor = (o: number) => (o === 0 ? 0 : Math.sign(o) * (Math.abs(o) === 1 ? step1 : step2));
  const spring = reduceMotion ? { duration: 0 } : glide;

  return (
    <div
      ref={frame}
      role="radiogroup"
      aria-label="Sample restaurants"
      tabIndex={0}
      onKeyDown={onKey}
      className={cn("relative w-full outline-none", className)}
    >
      <motion.div animate={{ height }} transition={spring} className="relative">
        {concepts.map((c, i) => {
          const o = offsetOf(i);
          const d = Math.abs(o);
          const active = o === 0;
          const Icon = c.icon;
          return (
            <motion.div
              key={c.id}
              data-concept={c.id}
              ref={active ? activeRef : undefined}
              role={active ? undefined : "radio"}
              aria-checked={active ? undefined : false}
              aria-label={active ? undefined : `${c.label}: ${c.name}`}
              tabIndex={-1}
              onClick={() => !active && pick(o)}
              initial={false}
              animate={{
                // x and width ride the same spring, so the card's centre never jumps.
                x: posFor(o) - (active ? centre : SIDE) / 2,
                scale: active ? 1 : d === 1 ? 0.94 : 0.86,
                opacity: d > 2 ? 0 : active ? 1 : d === 1 ? 0.9 : 0.55,
                width: active ? centre : SIDE,
              }}
              transition={spring}
              style={{
                left: "50%",
                zIndex: 10 - d,
                pointerEvents: d > 2 ? "none" : undefined,
              }}
              className={cn(
                "absolute top-0 overflow-hidden rounded-[28px] text-left backdrop-blur-2xl",
                "transition-[background-color,box-shadow] duration-500",
                active
                  ? "bg-white/70 shadow-[0_30px_80px_-36px_rgb(11_11_12/0.4),0_0_0_1px_rgb(11_11_12/0.08)]"
                  : "cursor-pointer bg-white/45 shadow-[0_0_0_1px_rgb(11_11_12/0.06)] hover:bg-white/60",
                !active && disabled && "cursor-default",
              )}
            >
              {/* Contents cross-fade at a fixed width, so nothing reflows while the card resizes. */}
              <AnimatePresence initial={false} mode="popLayout">
                {active ? (
                  <motion.div
                    key="full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={fade}
                    style={{ width: centre }}
                    className="p-5 sm:p-6"
                  >
                    {children}
                  </motion.div>
                ) : (
                  <motion.div
                    key="compact"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={fade}
                    style={{ width: SIDE }}
                    className="flex h-[172px] flex-col justify-between p-5"
                  >
                    <span
                      style={{ backgroundColor: c.colour }}
                      className="flex size-10 items-center justify-center rounded-full"
                    >
                      <Icon aria-hidden strokeWidth={2} className="size-[18px] text-ink/85" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[15.5px] font-semibold leading-tight text-ink">
                        {c.label}
                      </span>
                      <span className="mt-1 block truncate text-[13px] text-ink-3">{c.name}</span>
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
