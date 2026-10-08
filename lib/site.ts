export const site = {
  name: "Asterra",
  legalName: "Asterra Solutions Inc.",
  url: "https://asterra.ca",
  dashboardUrl: "https://dashboard.asterra.ca",
  email: "contact@asterra.ca",
  region: "Ontario, Canada",
  tagline: "The voice AI restaurants use to answer every call.",
  description:
    "The voice AI restaurants use to answer every call: orders into your POS, tables booked, 20+ languages. Hear it answer, free.",
  social: {
    linkedin: "https://www.linkedin.com/company/asterra",
    instagram: "https://www.instagram.com/asterra",
  },
} as const;

/** The home-page section the hero scrolls to. */
export const TOY_ANCHOR = "toy";

/** Fired on `window` when the hero form is submitted. `detail` is the typed restaurant name. */
export const HERO_SUBMIT_EVENT = "asterra:hero-submit";
