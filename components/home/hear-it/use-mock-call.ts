"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CALL_LIMIT_SECONDS, type Concept } from "@/lib/toy";

export type CallStatus = "idle" | "connecting" | "live" | "ended";
export type Line = { who: "ai" | "caller"; text: string };

const RING_MS = 1400;
const TURN_MS = 2600;

/**
 * A scripted stand-in for the real call. Same surface the live hook will
 * have: status, elapsed seconds, transcript lines, start, end, say.
 */
export function useMockCall(concept: Concept) {
  const [status, setStatus] = useState<CallStatus>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [lines, setLines] = useState<Line[]>([]);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const ticker = useRef<ReturnType<typeof setInterval> | null>(null);

  const clear = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    if (ticker.current) clearInterval(ticker.current);
    ticker.current = null;
  }, []);

  const later = useCallback((ms: number, fn: () => void) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);

  const end = useCallback(() => {
    clear();
    setStatus("ended");
  }, [clear]);

  const start = useCallback(() => {
    clear();
    setLines([]);
    setElapsed(0);
    setStatus("connecting");
    later(RING_MS, () => {
      setStatus("live");
      ticker.current = setInterval(() => setElapsed((s) => s + 1), 1000);
      concept.script.forEach((line, i) => later(400 + i * TURN_MS, () => setLines((l) => [...l, line])));
      later(CALL_LIMIT_SECONDS * 1000, end);
    });
  }, [clear, later, concept, end]);

  /** The caller says something (a "Try asking" chip). The restaurant answers. */
  const say = useCallback(
    (text: string) => {
      setLines((l) => [...l, { who: "caller", text }]);
      later(1500, () => setLines((l) => [...l, { who: "ai", text: `Sure. ${replyFor(text)}` }]));
    },
    [later],
  );

  const reset = useCallback(() => {
    clear();
    setLines([]);
    setElapsed(0);
    setStatus("idle");
  }, [clear]);

  useEffect(() => clear, [clear]);

  return { status, elapsed, lines, start, end, say, reset };
}

function replyFor(prompt: string) {
  if (/open|time|hour/i.test(prompt)) return "We're open until 10 tonight, and from 11 tomorrow.";
  if (/deal|special/i.test(prompt)) return "Today it's two large pizzas for $32.";
  if (/gluten|vegetarian|spicy|halal|fresh/i.test(prompt))
    return "Yes, and I can tell you exactly what's in it.";
  if (/deliver/i.test(prompt)) return "We deliver within 5 km. Where should it go?";
  if (/dress code|tasting/i.test(prompt))
    return "Smart casual, and the tasting menu is five courses for $95.";
  if (/size|fries|side/i.test(prompt)) return "Small or large. I'll add a large for $4.50.";
  if (/long|pickup|ready/i.test(prompt)) return "About 20 minutes right now.";
  if (/cake|order/i.test(prompt)) return "I'll pass that to the team and they'll confirm by text.";
  if (/comes with|what's in/i.test(prompt)) return "Rice, salad, hummus and a warm pita.";
  return "I can help with that.";
}
