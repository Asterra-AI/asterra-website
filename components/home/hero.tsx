import Image from "next/image";
import heroBackground from "@/public/herobackground.png";
import { HeroSearch } from "./hero-search";
import { RotatingPhrase } from "./rotating-phrase";

export const heroPhrases = [
  "answer every call",
  "take orders",
  "book tables",
  "sell more",
  "handle the rush",
  "get orders right",
  "speak 20+ languages",
  "track phone sales",
  "answer after hours",
  "keep staff on the floor",
] as const;

export function Hero() {
  return (
    <section className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-white">
      {/* Static import: the URL is content-hashed, so swapping the file never serves a stale copy. */}
      <Image
        src={heroBackground}
        alt=""
        fill
        priority
        placeholder="blur"
        sizes="100vw"
        className="object-cover object-[center_top]"
      />
      {/* Guarantee a pure-white seam into the next section. */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[22%] bg-gradient-to-b from-transparent to-white"
      />

      <div className="container-site relative flex flex-1 flex-col items-center justify-center pb-[22vh] pt-24 text-center sm:pt-28">
        <h1 className="type-display w-full max-w-[1200px] text-white [font-size:clamp(2.375rem,5.4vw,4.75rem)] [text-shadow:0_2px_30px_rgb(0_0_0/0.12)]">
          <span className="block text-white/[0.92]">The voice AI restaurants use to</span>{" "}
          <RotatingPhrase phrases={heroPhrases} />
        </h1>

        <HeroSearch className="mt-12 sm:mt-16" />

        <p className="mt-6 text-[13.5px] text-white/80 [text-shadow:0_1px_12px_rgb(0_0_0/0.18)] sm:text-sm">
          Free · No sign-up · Talk to it right in your browser
        </p>
      </div>
    </section>
  );
}
