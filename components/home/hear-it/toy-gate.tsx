"use client";

import dynamic from "next/dynamic";
import { useInView } from "motion/react";
import { useRef } from "react";
import { SectionHeading } from "@/components/ui/section-heading";

/** Loads the interactive toy only when the visitor scrolls near it. */
const Toy = dynamic(() => import("./toy").then((m) => m.Toy), { ssr: false, loading: () => <ToySkeleton /> });

export function ToyGate() {
  const ref = useRef<HTMLDivElement | null>(null);
  const near = useInView(ref, { once: true, margin: "900px 0px" });
  return <div ref={ref}>{near ? <Toy /> : <ToySkeleton />}</div>;
}

/** Same layout, static. Keeps the headline in the HTML and holds the space while the toy loads. */
export function ToySkeleton() {
  return (
    <div className="flex flex-col items-center">
      <SectionHeading
        title="Hear it for yourself."
        line="Pick a concept and call it, just like your customers would."
      />
      <div className="mt-12 h-[220px] w-full max-w-[600px] rounded-[28px] bg-white/60 ring-1 ring-ink/[0.08]" />
    </div>
  );
}
