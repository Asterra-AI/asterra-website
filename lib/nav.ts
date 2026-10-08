import type { LucideIcon } from "lucide-react";
import {
  AudioLines,
  Building2,
  CalendarCheck,
  ChartLine,
  CircleHelp,
  Coffee,
  Languages,
  LogIn,
  Mail,
  MessageCircleQuestion,
  Monitor,
  Phone,
  PhoneForwarded,
  Pizza,
  Radio,
  Sandwich,
  Server,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  Users,
  Utensils,
  Wine,
} from "lucide-react";
import { site } from "@/lib/site";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  description?: string;
  external?: boolean;
};

export type NavGroup = {
  label?: string;
  items: NavItem[];
};

export type FeatureCard = {
  title: string;
  line: string;
  href: string;
  /** Path under /public. Optional until real imagery lands. */
  image?: string;
  /** Placeholder tint while there's no image. */
  tone?: "sky" | "ink" | "paper";
};

export type MenuId = "product" | "company" | "resources";

export type MenuDef = {
  id: MenuId;
  label: string;
  /** Desktop panel width in px. */
  width: number;
  /** `wide` = two item columns + stacked cards. `compact` = one described column + one card. */
  layout: "wide" | "compact";
  columns: NavGroup[][];
  cards: FeatureCard[];
};

export type PlainLink = { label: string; href: string };

export const productMenu: MenuDef = {
  id: "product",
  label: "Product",
  width: 1100,
  layout: "wide",
  columns: [
    [
      {
        label: "Answer every call",
        items: [
          { label: "Phone orders", href: "/product#orders", icon: ShoppingBag },
          { label: "Reservations", href: "/product#reservations", icon: CalendarCheck },
          { label: "Questions", href: "/product#questions", icon: MessageCircleQuestion },
          { label: "Staff handoff", href: "/product#handoff", icon: PhoneForwarded },
          { label: "20+ languages", href: "/product#languages", icon: Languages },
        ],
      },
      {
        label: "See every call",
        items: [
          { label: "Live calls", href: "/product#dashboard-live", icon: Radio },
          { label: "Recordings & transcripts", href: "/product#dashboard-calls", icon: AudioLines },
          { label: "Phone analytics", href: "/product#dashboard-analytics", icon: ChartLine },
          { label: "Your controls", href: "/product#dashboard-controls", icon: SlidersHorizontal },
        ],
      },
    ],
    [
      {
        label: "Made for",
        items: [
          { label: "Pizza & wings", href: "/for/pizza", icon: Pizza },
          { label: "Quick service", href: "/for/quick-service", icon: Sandwich },
          { label: "Casual dining", href: "/for/casual-dining", icon: Utensils },
          { label: "Fine dining", href: "/for/fine-dining", icon: Wine },
          { label: "Cafés & bakeries", href: "/for/cafes", icon: Coffee },
          { label: "Groups & franchises", href: "/for/groups", icon: Building2 },
        ],
      },
      {
        label: "Works with",
        items: [
          { label: "Clover POS", href: "/product#works-with", icon: Monitor },
          { label: "Your existing number", href: "/product#works-with", icon: Phone },
        ],
      },
    ],
  ],
  cards: [
    {
      title: "Hear it answer.",
      line: "Call a sample restaurant in your browser.",
      href: "/#toy",
      tone: "sky",
    },
    {
      title: "Live in about two weeks.",
      line: "From your demo to your real line.",
      href: "/how-it-works",
      tone: "ink",
    },
  ],
};

export const companyMenu: MenuDef = {
  id: "company",
  label: "Company",
  width: 600,
  layout: "compact",
  columns: [
    [
      {
        items: [
          { label: "About", href: "/about", icon: Users, description: "Who we are and how we work." },
          {
            label: "Contact",
            href: "/contact",
            icon: Mail,
            description: "Talk to a person. We reply within a day.",
          },
        ],
      },
    ],
  ],
  cards: [
    {
      title: "Set up in person.",
      line: "We build and test every restaurant ourselves.",
      href: "/about",
      tone: "paper",
    },
  ],
};

export const resourcesMenu: MenuDef = {
  id: "resources",
  label: "Resources",
  width: 600,
  layout: "compact",
  columns: [
    [
      {
        items: [
          { label: "FAQ", href: "/faq", icon: CircleHelp, description: "Every common question, answered." },
          {
            label: "Security & privacy",
            href: "/security",
            icon: ShieldCheck,
            description: "How we protect your calls and data.",
          },
          {
            label: "Sub-processors",
            href: "/subprocessors",
            icon: Server,
            description: "The providers behind every call.",
          },
          {
            label: "Client login",
            href: site.dashboardUrl,
            icon: LogIn,
            description: "Your Asterra dashboard.",
            external: true,
          },
        ],
      },
    ],
  ],
  cards: [
    {
      title: "Build my demo.",
      line: "Free, on your menu, in 48 hours.",
      href: "/demo",
      tone: "ink",
    },
  ],
};

export const menus: Record<MenuId, MenuDef> = {
  product: productMenu,
  company: companyMenu,
  resources: resourcesMenu,
};

/** Desktop nav order. A string refers to a menu id; an object is a plain link. */
export const navOrder: Array<MenuId | PlainLink> = [
  "product",
  { label: "How it works", href: "/how-it-works" },
  { label: "Pricing", href: "/pricing" },
  "company",
  "resources",
];

export const primaryCta: PlainLink = { label: "Build my demo", href: "/demo" };
