import type { Metadata } from "next";
import { BlindSpot, Hero } from "@/components/home";
import { site, TOY_ANCHOR } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: `Voice AI for Restaurants · ${site.name}` },
  description: site.description,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <BlindSpot />
      {/* Home 2–12 land here, section by section. The toy section keeps this id. */}
      <section id={TOY_ANCHOR} aria-hidden className="min-h-screen scroll-mt-20 bg-white" />
    </>
  );
}
