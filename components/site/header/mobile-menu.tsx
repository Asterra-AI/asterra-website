"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { menus, navOrder, primaryCta, type MenuId } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FeatureCard } from "./feature-card";
import { MenuItem } from "./menu-item";

const rowClass =
  "flex h-14 w-full items-center justify-between text-[17px] font-medium text-ink outline-none " +
  "focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-inset";

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  // Lock page scroll while the sheet is open; Esc closes.
  useEffect(() => {
    if (!open) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  // Close if the viewport grows past the desktop breakpoint.
  useEffect(() => {
    if (!open) return;
    const mq = window.matchMedia("(min-width: 64rem)");
    const onChange = (e: MediaQueryListEvent) => e.matches && onClose();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="sheet"
          id="mobile-menu"
          initial={{ y: "-100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
          className="fixed inset-0 z-40 flex flex-col bg-paper lg:hidden"
        >
          <SheetContent onClose={onClose} />

          <div className="fixed inset-x-0 bottom-0 border-t border-hairline bg-paper/90 p-5 backdrop-blur-md [padding-bottom:max(1.25rem,env(safe-area-inset-bottom))]">
            <Button href={primaryCta.href} size="lg" className="w-full" onClick={onClose}>
              {primaryCta.label}
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Mounted with the sheet, so accordion state resets every time it opens. */
function SheetContent({ onClose }: { onClose: () => void }) {
  const [expanded, setExpanded] = useState<MenuId | null>(null);

  return (
    <div className="no-scrollbar container-site flex-1 overflow-y-auto overscroll-contain pt-[4.5rem] pb-28">
      <ul className="divide-y divide-hairline border-b border-hairline">
        {navOrder.map((entry) => {
          if (typeof entry === "string") {
            const def = menus[entry];
            const isOpen = expanded === entry;
            return (
              <li key={entry}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`mobile-${entry}`}
                  onClick={() => setExpanded(isOpen ? null : entry)}
                  className={rowClass}
                >
                  {def.label}
                  <ChevronDown
                    aria-hidden
                    strokeWidth={2}
                    className={cn(
                      "size-5 text-ink-3 transition-transform duration-200 ease-out-quart",
                      isOpen && "rotate-180",
                    )}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`mobile-${entry}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: [0.25, 1, 0.5, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-col gap-6 pb-5">
                        {def.columns.flat().map((group, gi) => (
                          <div key={group.label ?? gi}>
                            {group.label && (
                              <p className="mb-1.5 text-[12.5px] font-medium text-ink-3">{group.label}</p>
                            )}
                            <ul className="-mx-2.5 flex flex-col">
                              {group.items.map((item) => (
                                <li key={item.label}>
                                  <MenuItem
                                    item={item}
                                    described={def.layout === "compact"}
                                    onNavigate={onClose}
                                  />
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                        {entry === "product" && (
                          <FeatureCard
                            card={def.cards[0]}
                            onNavigate={onClose}
                            compact
                            className="max-w-[360px]"
                          />
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          }
          return (
            <li key={entry.href}>
              <Link href={entry.href} onClick={onClose} className={rowClass}>
                {entry.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
