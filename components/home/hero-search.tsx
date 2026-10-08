"use client";

import { Search } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useState, type FormEvent } from "react";
import { springs } from "@/lib/motion";
import { HERO_SUBMIT_EVENT, TOY_ANCHOR } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function HeroSearch({ className }: { className?: string }) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const reduceMotion = useReducedMotion();

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const name = value.trim();
    window.dispatchEvent(new CustomEvent<string>(HERO_SUBMIT_EVENT, { detail: name }));
    document.getElementById(TOY_ANCHOR)?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
  }

  return (
    <motion.form
      role="search"
      onSubmit={onSubmit}
      onFocus={() => setFocused(true)}
      onBlur={(e) => setFocused(e.currentTarget.contains(e.relatedTarget as Node))}
      whileHover={{ scale: 1.02 }}
      animate={{ scale: focused ? 1.02 : 1 }}
      transition={springs.hover}
      className={cn(
        "glass-dark flex h-16 w-full max-w-[540px] items-center rounded-[26px] p-2 pl-4 sm:pl-5",
        "bg-[linear-gradient(180deg,rgb(255_255_255/0.16),rgb(255_255_255/0.08))]",
        "transition-[background-color,box-shadow] duration-200 ease-out-quart focus-within:bg-white/15",
        className,
      )}
    >
      <Search aria-hidden strokeWidth={2.25} className="size-5 shrink-0 text-white/80" />
      <label htmlFor="hero-restaurant" className="sr-only">
        Your restaurant&apos;s name
      </label>
      <input
        id="hero-restaurant"
        name="restaurant"
        type="text"
        autoComplete="organization"
        spellCheck={false}
        placeholder="Your restaurant's name"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="min-w-0 flex-1 bg-transparent px-3 text-[16px] text-white outline-none placeholder:text-white/65 sm:text-[17px]"
      />
      <Button
        type="submit"
        variant="white"
        size="lg"
        className="h-12 shrink-0 px-4 text-[15px] sm:px-6 sm:text-base"
      >
        Hear it answer
      </Button>
    </motion.form>
  );
}
