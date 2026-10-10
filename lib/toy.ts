import type { LucideIcon } from "lucide-react";
import { ChefHat, Coffee, Drumstick, Fish, Flame, Hamburger, Pizza, Wine } from "lucide-react";

/** A sample restaurant on the dial. */
export type Concept = {
  id: string;
  /** Short concept label shown in the dial centre. */
  label: string;
  /** Default restaurant name. */
  name: string;
  colour: string;
  icon: LucideIcon;
  /** Three "Try asking" prompts; the first is the one the sample call plays. */
  prompts: [string, string, string];
  /** The scripted sample call: alternating turns, starting with the restaurant. */
  script: { who: "ai" | "caller"; text: string }[];
};

const greeting = (name: string) => `Thanks for calling ${name}. What can I get started for you?`;

export const concepts: Concept[] = [
  {
    id: "pizza",
    label: "Pizza",
    name: "Chomp Pizza",
    colour: "#FF3B30",
    icon: Pizza,
    prompts: [
      "Large pepperoni and garlic bread for pickup",
      "What's the deal of the day?",
      "How long for pickup right now?",
    ],
    script: [
      { who: "ai", text: greeting("Chomp Pizza") },
      { who: "caller", text: "Can I get a large pepperoni and a garlic bread for pickup?" },
      {
        who: "ai",
        text: "One large pepperoni and one garlic bread, that's $27.40. Ready in about 20 minutes. What name is it under?",
      },
      { who: "caller", text: "Sam." },
      { who: "ai", text: "Thanks Sam. I've sent that to the kitchen. See you at 6:45." },
    ],
  },
  {
    id: "wings",
    label: "Wings",
    name: "Wing Theory",
    colour: "#FF8A00",
    icon: Drumstick,
    prompts: [
      "Two pounds honey garlic, boneless",
      "Do you have anything not spicy?",
      "Can I add a side of fries?",
    ],
    script: [
      { who: "ai", text: greeting("Wing Theory") },
      { who: "caller", text: "Two pounds of honey garlic, boneless please." },
      { who: "ai", text: "Two pounds boneless honey garlic. Ranch or blue cheese with that?" },
      { who: "caller", text: "Ranch." },
      { who: "ai", text: "Ranch it is. That's $31.95, ready in 25 minutes for pickup." },
    ],
  },
  {
    id: "middle-eastern",
    label: "Middle Eastern",
    name: "Layali Grill",
    colour: "#2DBE60",
    icon: Flame,
    prompts: ["بدي شاورما دجاج", "Is the lamb halal?", "What comes with the mixed grill?"],
    script: [
      { who: "ai", text: greeting("Layali Grill") },
      { who: "caller", text: "بدي شاورما دجاج." },
      { who: "ai", text: "أكيد، شاورما دجاج. على الصحن أو لفّة؟" },
      { who: "caller", text: "Actually, can we do this in English? A chicken shawarma wrap." },
      { who: "ai", text: "Of course. One chicken shawarma wrap, garlic sauce and pickles. That's $12.50." },
    ],
  },
  {
    id: "fine-dining",
    label: "Fine dining",
    name: "Maison Ember",
    colour: "#9B51E0",
    icon: Wine,
    prompts: [
      "Table for four Saturday at 7, it's our anniversary",
      "Is there a dress code?",
      "Do you offer a tasting menu?",
    ],
    script: [
      { who: "ai", text: "Good evening, thank you for calling Maison Ember. How may I help you?" },
      { who: "caller", text: "A table for four on Saturday at seven. It's our anniversary." },
      {
        who: "ai",
        text: "Happy anniversary. Seven is taken, but I have 6:30 or 7:45 on Saturday. Would either suit?",
      },
      { who: "caller", text: "7:45 works." },
      {
        who: "ai",
        text: "Lovely. Four guests, Saturday at 7:45, with a note for the occasion. We look forward to seeing you.",
      },
    ],
  },
  {
    id: "turkish",
    label: "Turkish",
    name: "Anatolia Kitchen",
    colour: "#FF2D6F",
    icon: ChefHat,
    prompts: ["What's in the Iskender?", "Do you have vegetarian options?", "Can I order for delivery?"],
    script: [
      { who: "ai", text: greeting("Anatolia Kitchen") },
      { who: "caller", text: "What's in the Iskender?" },
      {
        who: "ai",
        text: "Sliced döner over pieces of pide, with tomato sauce, yogurt and browned butter. It's $19.",
      },
      { who: "caller", text: "I'll take one for pickup." },
      { who: "ai", text: "One Iskender for pickup, ready in 20 minutes. What name should I put it under?" },
    ],
  },
  {
    id: "burgers",
    label: "Burgers",
    name: "Stack House",
    colour: "#FFC700",
    icon: Hamburger,
    prompts: [
      "Double cheeseburger combo, no onions",
      "What sizes do the fries come in?",
      "Are you open past 11?",
    ],
    script: [
      { who: "ai", text: greeting("Stack House") },
      { who: "caller", text: "Double cheeseburger combo, no onions." },
      { who: "ai", text: "Double cheese combo, no onions. What drink with that?" },
      { who: "caller", text: "Coke." },
      { who: "ai", text: "Got it. $16.75, ready in 15 minutes for pickup." },
    ],
  },
  {
    id: "cafe",
    label: "Café",
    name: "Morning Hours Café",
    colour: "#00B8A9",
    icon: Coffee,
    prompts: [
      "Anything gluten-free?",
      "What time do you open on Sunday?",
      "Can I order a cake for Saturday?",
    ],
    script: [
      { who: "ai", text: "Morning Hours Café, how can I help?" },
      { who: "caller", text: "Do you have anything gluten-free?" },
      {
        who: "ai",
        text: "Yes. The almond loaf, the flourless chocolate cake and all our egg bowls are gluten-free today.",
      },
      { who: "caller", text: "I'll grab an almond loaf slice and an oat latte." },
      { who: "ai", text: "One almond loaf and one oat latte. That's $11.25. Ready in 5 minutes." },
    ],
  },
  {
    id: "sushi",
    label: "Sushi",
    name: "Kumo Sushi",
    colour: "#0A84FF",
    icon: Fish,
    prompts: [
      "A party tray for ten, tomorrow at noon",
      "Is the salmon sashimi fresh today?",
      "Do you do lunch specials?",
    ],
    script: [
      { who: "ai", text: greeting("Kumo Sushi") },
      { who: "caller", text: "I need a party tray for ten, tomorrow at noon." },
      {
        who: "ai",
        text: "Our large party tray serves ten, 96 pieces, for $145. Pickup tomorrow at noon. Shall I place it?",
      },
      { who: "caller", text: "Yes please." },
      { who: "ai", text: "Done. A large party tray for pickup tomorrow at 12:00. What name is it under?" },
    ],
  },
];

/** Holes on the dial with no concept. */
export const BLANK_HOLE_COLOUR = "#2A2A2C";

/** Sample calls end after this many seconds. */
export const CALL_LIMIT_SECONDS = 90;
