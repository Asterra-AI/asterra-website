"use client";

import { Phone, PhoneOff, RotateCcw } from "lucide-react";
import {
  AnimatePresence,
  animate,
  motion,
  useAnimate,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
} from "motion/react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { heroName } from "@/lib/hero-name";
import { springs } from "@/lib/motion";
import { concepts, type Concept } from "@/lib/toy";
import { cn } from "@/lib/utils";
import { Stage } from "./stage";
import { Transcript } from "./transcript";
import { useMockCall } from "./use-mock-call";
import { Waveform } from "./waveform";

const TYPE_MS = 400;

export function Toy() {
  const [concept, setConcept] = useState<Concept>(concepts[0]);
  const [name, setName] = useState("");
  const call = useMockCall(concept);
  const resetCall = call.reset;
  const [cta, animateCta] = useAnimate();
  const typing = useRef<ReturnType<typeof setInterval> | null>(null);

  // The hero hands over a name: start fresh, type it in, then pulse the button once.
  useEffect(() => {
    const receive = (value: string) => {
      if (typing.current) clearInterval(typing.current);
      resetCall();
      if (!value) return;
      let i = 0;
      const step = Math.max(16, TYPE_MS / value.length);
      typing.current = setInterval(() => {
        i += 1;
        setName(value.slice(0, i));
        if (i >= value.length) {
          if (typing.current) clearInterval(typing.current);
          animateCta(cta.current, { scale: [1, 1.05, 1] }, { duration: 0.6, ease: "easeInOut" });
        }
      }, step);
    };
    if (heroName.get()) receive(heroName.get());
    const unsubscribe = heroName.subscribe(receive);
    return () => {
      unsubscribe();
      if (typing.current) clearInterval(typing.current);
    };
  }, [animateCta, cta, resetCall]);

  // Switching restaurants always starts fresh.
  const choose = (c: Concept) => {
    resetCall();
    setConcept(c);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (call.status === "live" || call.status === "connecting") call.end();
    else call.start();
  };

  const restaurant = name.trim() || concept.name;
  const inCall = call.status === "connecting" || call.status === "live";
  const ended = call.status === "ended";
  const Icon = concept.icon;

  return (
    <div className="relative flex flex-col items-center">
      <SectionHeading
        title="Hear it for yourself."
        line="Pick a concept and call it, just like your customers would."
      />
      <Aura colour={concept.colour} />

      <Stage selected={concept} onSelect={choose} disabled={inCall} className="mt-12">
        {/* Who you're calling */}
        <div className="flex items-center gap-4">
          <span
            style={{ backgroundColor: concept.colour, boxShadow: `0 0 24px 2px ${concept.colour}55` }}
            className="flex size-12 shrink-0 items-center justify-center rounded-full sm:size-14"
          >
            <Icon aria-hidden strokeWidth={2} className="size-5 text-ink/85 sm:size-6" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink-3">{concept.label}</p>
            <p className="truncate text-[22px] font-semibold leading-tight text-ink sm:text-[26px]">
              {restaurant}
            </p>
          </div>
          {inCall && (
            <div className="flex shrink-0 items-center gap-3">
              <span className="flex items-center gap-2">
                <span
                  className={cn(
                    "size-2 rounded-full",
                    call.status === "live" ? "bg-[#1DB874]" : "animate-pulse bg-ink/30",
                  )}
                />
                <span className="hidden text-[11px] font-medium uppercase tracking-[0.18em] text-ink-3 sm:block">
                  {call.status === "live" ? "Live" : "Ringing"}
                </span>
              </span>
              <span className="text-[18px] font-semibold tabular-nums text-ink">
                {formatTime(call.elapsed)}
              </span>
              <Waveform active={call.status === "live"} colour={concept.colour} className="h-5" />
            </div>
          )}
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {ended ? (
            <motion.div key="after" {...swap} className="mt-6 border-t border-hairline pt-6">
              <p className="type-display text-[26px] text-ink sm:text-[30px]">Now hear yours.</p>
              <p className="mt-1.5 text-[16px] text-ink-2">Built on your real menu, ready in 48 hours.</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button href="/demo" size="lg">
                  Build my demo
                </Button>
                <Button variant="secondary" size="lg" onClick={call.reset}>
                  <RotateCcw aria-hidden className="size-4" strokeWidth={2} />
                  Try another
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div key="call" {...swap}>
              <form onSubmit={onSubmit} className="mt-5 flex flex-col gap-3 sm:flex-row">
                <label htmlFor="toy-name" className="sr-only">
                  Restaurant name
                </label>
                <input
                  id="toy-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Use your restaurant's name"
                  disabled={inCall}
                  autoComplete="organization"
                  spellCheck={false}
                  className={cn(
                    "h-12 min-w-0 flex-1 rounded-[18px] bg-white/70 px-5 text-[16px] text-ink outline-none ring-1 ring-ink/[0.08]",
                    "placeholder:text-ink-3 transition-[background-color,box-shadow] duration-200",
                    "focus:bg-white focus-visible:ring-2 focus-visible:ring-ink disabled:opacity-60",
                  )}
                />
                <motion.div ref={cta} whileTap={{ scale: 0.98 }} transition={springs.press} className="flex">
                  <Button
                    type="submit"
                    size="lg"
                    variant={inCall ? "secondary" : "primary"}
                    disabled={call.status === "connecting"}
                    className="w-full sm:w-auto"
                  >
                    {call.status === "idle" && (
                      <>
                        <Phone aria-hidden className="size-4" strokeWidth={2} /> Call it now
                      </>
                    )}
                    {call.status === "connecting" && "Ringing…"}
                    {call.status === "live" && (
                      <>
                        <PhoneOff aria-hidden className="size-4" strokeWidth={2} /> End call
                      </>
                    )}
                  </Button>
                </motion.div>
              </form>

              <AnimatePresence initial={false}>
                {call.status === "live" && (
                  <motion.div
                    key="transcript"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ height: springs.slide, opacity: { duration: 0.25 } }}
                    className="overflow-hidden"
                  >
                    <div className="mt-5 border-t border-hairline pt-5">
                      <Transcript lines={call.lines} restaurant={restaurant} />
                      <p className="mt-5 text-[12px] font-medium uppercase tracking-[0.16em] text-ink-3">
                        Try asking
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {concept.prompts.map((p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => call.say(p)}
                            className="rounded-[12px] bg-white/70 px-3.5 py-2 text-[13.5px] text-ink ring-1 ring-ink/[0.08] transition-colors duration-150 hover:bg-white"
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </Stage>

      <p className="mt-8 max-w-[560px] text-center text-[13px] leading-relaxed text-ink-3">
        Sample restaurants · Calls end after 90 seconds · Your mic is used only during the call. No mic? Call
        us and we&apos;ll demo it live.
      </p>
    </div>
  );
}

/** A soft pool of the restaurant's colour behind the glass, so the frost has something to catch. */
function Aura({ colour }: { colour: string }) {
  const reduceMotion = useReducedMotion();
  const tint = useMotionValue(colour);
  useEffect(() => {
    const controls = animate(tint, colour, { duration: reduceMotion ? 0 : 1.2, ease: [0.25, 1, 0.5, 1] });
    return () => controls.stop();
  }, [colour, tint, reduceMotion]);
  const pool = useMotionTemplate`radial-gradient(closest-side, ${tint} 0%, rgba(255, 255, 255, 0) 72%)`;
  const drift = (dx: number, dy: number, s: number) =>
    reduceMotion
      ? {}
      : {
          x: [0, dx, 0],
          y: [0, dy, 0],
          transition: { duration: s, repeat: Infinity, ease: "easeInOut" as const },
        };
  return (
    <>
      <motion.div
        aria-hidden
        style={{ background: pool }}
        animate={drift(30, -16, 14)}
        className="pointer-events-none absolute left-1/2 top-[30%] aspect-square w-[560px] -translate-x-[72%] opacity-[0.26]"
      />
      <motion.div
        aria-hidden
        style={{ background: pool }}
        animate={drift(-24, 20, 18)}
        className="pointer-events-none absolute left-1/2 top-[40%] aspect-square w-[520px] -translate-x-[28%] opacity-[0.2]"
      />
    </>
  );
}

const swap = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as const },
};

function formatTime(s: number) {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}
