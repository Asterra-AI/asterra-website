import type { Metadata } from "next";
import { BlindSpot, HearIt, Hero } from "@/components/home";
import { site } from "@/lib/site";

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
      <HearIt />
    </>
  );
}
