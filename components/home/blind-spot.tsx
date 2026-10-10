"use client";

import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { smoothArea, smoothLine } from "@/lib/sparkline";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------------------
   Illustration data. One believable day, a different shape on every line.
   These are not claims.
--------------------------------------------------------------------------- */
const channels = [
  {
    key: "apps",
    label: "Delivery apps",
    value: "58",
    unit: "orders today",
    points: [2, 3, 5, 4, 6, 8, 7, 9],
  },
  {
    key: "online",
    label: "Online ordering",
    value: "41",
    unit: "orders today",
    points: [1, 2, 2, 4, 5, 4, 6, 8],
  },
  {
    key: "pos",
    label: "POS",
    value: "$4,212",
    unit: "in sales today",
    points: [3, 4, 6, 5, 7, 9, 8, 10],
  },
];

const phone = {
  value: 64,
  unit: "calls today",
  details: [
    { value: 22, label: "orders" },
    { value: 9, label: "reservations" },
  ],
  points: [2, 3, 3, 5, 6, 6, 8, 9, 11, 13],
};

const displayType = "type-display [font-size:clamp(2.75rem,6.4vw,5.5rem)] leading-[0.95]";

/**
 * Home 2 · The phone was the one channel that never reported.
 * The channels that always reported sit stacked as large type. Each darkens as
 * it nears the middle of the screen; when it gets there it "catches" and its
 * figure opens up beneath it. Then the phone arrives in its own dark container.
 */
export function BlindSpot() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <section id="blind-spot" className="bg-white pb-24 pt-8 sm:pt-12 lg:pb-36 lg:pt-16">
      <div className="container-site">
        <Reveal>
          <SectionHeading size="lg" title="You already know these numbers." />
        </Reveal>

        <div className="mt-16 flex flex-col items-center gap-5 sm:gap-7 lg:mt-24">
          {channels.map((c) => (
            <ChannelWord
              key={c.key}
              channel={c}
              active={active === c.key}
              onCatch={() => setActive(c.key)}
              onRelease={() => setActive((cur) => (cur === c.key ? null : cur))}
            />
          ))}

          <LeadLine />
          <PhoneBlock />
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------------
   Focus: 1 when the element's centre is at the middle of the viewport, falling
   to 0 as it moves away. Measured from the live rect on every scroll (and on
   any layout change), so rows opening and closing never leave it stale.
--------------------------------------------------------------------------- */
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

type HoldWindow = { from: number; to: number };

/**
 * `hold`: builds from 0 to 1 as the element's centre rises from `from` to `to`
 * (fractions of the viewport height below centre), then holds at 1.
 */
function useFocus(ref: React.RefObject<HTMLElement | null>, hold?: HoldWindow) {
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const raw = useMotionValue(0);
  const from = hold?.from;
  const to = hold?.to;

  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight;
    // Distance of the element's centre from the viewport centre, as a fraction of the viewport.
    const d = (r.top + r.height / 2 - vh / 2) / vh;
    const v =
      from !== undefined && to !== undefined
        ? clamp01((from - d) / (from - to))
        : clamp01(1 - (Math.abs(d) - 0.045) / 0.1); // tight window either side of centre
    raw.set(v);
  }, [ref, from, to, raw]);

  useMotionValueEvent(scrollY, "change", measure);
  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  const sprung = useSpring(raw, { stiffness: 130, damping: 26, mass: 0.7 });
  const one = useTransform(() => 1);
  return { raw, focus: reduceMotion ? one : sprung, reduceMotion };
}

/** The figure row opening: unhurried, with a small settle at the end. */
const openSpring = { type: "spring", stiffness: 210, damping: 22, mass: 1 } as const;

type Channel = (typeof channels)[number];

function ChannelWord({
  channel,
  active,
  onCatch,
  onRelease,
}: {
  channel: Channel;
  active: boolean;
  onCatch: () => void;
  onRelease: () => void;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { raw, focus, reduceMotion } = useFocus(ref);
  const opacity = useTransform(focus, [0, 1], [0.14, 1]);

  // The catch: fully centred activates; drifting right out releases (unless
  // another word has already taken over).
  useMotionValueEvent(raw, "change", (v) => {
    if (v >= 0.98) onCatch();
    else if (v <= 0.02) onRelease();
  });

  const open = active || !!reduceMotion;

  return (
    <div ref={ref} className="flex flex-col items-center text-center">
      <motion.h3 style={{ opacity }} className={cn(displayType, "text-ink")}>
        {channel.label}
      </motion.h3>

      {/* Opens space beneath the word and slides the figure up into it. */}
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ height: openSpring, opacity: { duration: 0.4, ease: [0.25, 1, 0.5, 1] } }}
        className="overflow-hidden"
      >
        <motion.p
          initial={false}
          animate={{ y: open ? 0 : 32 }}
          transition={openSpring}
          className="flex items-center gap-4 pb-6 pt-5 text-[17px] text-ink-2 sm:pb-8 sm:text-lg"
        >
          <span>
            <span className="font-semibold tabular-nums text-ink">{channel.value}</span> {channel.unit}
          </span>
          <Line points={channel.points} width={100} height={40} className="h-6 w-16 stroke-ink/40" />
        </motion.p>
      </motion.div>
    </div>
  );
}

/** The line finishes arriving just below centre; the phone starts only after that. */
const LEAD_WINDOW: HoldWindow = { from: 0.42, to: 0.12 };
const PHONE_WINDOW: HoldWindow = { from: 0.3, to: 0.02 };

/* ---------------------------------------------------------------------------
   The lead-in line: invisible until it rises toward the centre, like the phone.
--------------------------------------------------------------------------- */
function LeadLine() {
  const ref = useRef<HTMLParagraphElement | null>(null);
  const { focus } = useFocus(ref, LEAD_WINDOW);
  const y = useTransform(focus, [0, 1], [24, 0]);
  return (
    <motion.p
      ref={ref}
      style={{ opacity: focus, y }}
      className="type-display mt-16 text-center text-ink [font-size:clamp(1.5rem,2.6vw,2.25rem)] lg:mt-20"
    >
      Meet the missing piece.
    </motion.p>
  );
}

/* ---------------------------------------------------------------------------
   The phone: in its own container, arriving as the missing piece.
--------------------------------------------------------------------------- */
function PhoneBlock() {
  const ref = useRef<HTMLDivElement | null>(null);
  const { focus } = useFocus(ref, PHONE_WINDOW);
  const opacity = useTransform(focus, [0, 1], [0, 1]);
  const y = useTransform(focus, [0, 1], [48, 0]);
  const scale = useTransform(focus, [0, 1], [0.96, 1]);
  const pathLength = useTransform(focus, [0.2, 1], [0, 1]);
  const fillOpacity = useTransform(focus, [0.5, 1], [0, 1]);

  return (
    <motion.div
      ref={ref}
      style={{ opacity, y, scale }}
      className="mt-2 w-full max-w-[900px] rounded-[32px] bg-ink px-6 py-12 text-center text-white sm:px-12 sm:py-16 lg:mt-8"
    >
      <h3 className={displayType}>Phone calls</h3>
      <p className="mt-6 text-[17px] text-white/70 sm:text-lg">
        <span className="font-semibold tabular-nums text-white">
          <Count focus={focus} to={phone.value} range={[0.25, 1]} />
        </span>{" "}
        {phone.unit}
        {phone.details.map((d, i) => (
          <span key={d.label}>
            {" · "}
            <span className="font-semibold tabular-nums text-white">
              <Count focus={focus} to={d.value} range={[0.35 + i * 0.1, 1]} />
            </span>{" "}
            {d.label}
          </span>
        ))}
      </p>
      <svg
        aria-hidden
        viewBox="0 0 640 112"
        preserveAspectRatio="xMidYMax meet"
        className="mx-auto mt-12 h-[112px] w-full max-w-[640px] overflow-visible stroke-white"
      >
        <defs>
          <linearGradient id="phone-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="white" stopOpacity="0.14" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path
          d={smoothArea(phone.points, 640, 112)}
          fill="url(#phone-fill)"
          stroke="none"
          style={{ opacity: fillOpacity }}
        />
        <motion.path
          d={smoothLine(phone.points, 640, 112)}
          fill="none"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ pathLength }}
        />
      </svg>
      <p className="mt-10 text-[12.5px] text-white/40">Sample data</p>
    </motion.div>
  );
}

/** Integer driven by focus over `range`. */
function Count({ focus, to, range }: { focus: MotionValue<number>; to: number; range: [number, number] }) {
  const value = useTransform(focus, range, [0, to]);
  const text = useTransform(value, (v) => String(Math.round(v)));
  return <motion.span>{text}</motion.span>;
}

function Line({
  points,
  width,
  height,
  className,
}: {
  points: number[];
  width: number;
  height: number;
  className?: string;
}) {
  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid meet"
      className={cn("overflow-visible", className)}
    >
      <path
        d={smoothLine(points, width, height)}
        fill="none"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
