"use client";

import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { springs } from "@/lib/motion";
import { primaryCta, type MenuId } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DesktopNav } from "./desktop-nav";
import { Logo } from "./logo";
import { MobileMenu } from "./mobile-menu";

const SCROLL_THRESHOLD = 24;

/** Routes whose first screen is the painted sky, so the bar starts transparent with white content. */
function hasOverlayHero(pathname: string) {
  return pathname === "/" || pathname.startsWith("/for/");
}

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<MenuId | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const overlay = hasOverlayHero(pathname);
  // Opening a dropdown does not change the bar; only scrolling (or the mobile sheet) does.
  const solid = !overlay || scrolled || mobileOpen;

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      setScrolled(window.scrollY > SCROLL_THRESHOLD);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Close everything on navigation (state adjusted during render, per React guidance).
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setOpenMenu(null);
    setMobileOpen(false);
  }

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300 ease-out-quart",
          solid && !mobileOpen && "glass-light",
          mobileOpen && "bg-paper",
        )}
      >
        <div
          ref={containerRef}
          className="container-site relative flex h-[4.5rem] items-center justify-between lg:grid lg:grid-cols-[1fr_auto_1fr]"
        >
          <Logo solid={solid} />

          <DesktopNav
            solid={solid}
            openMenu={openMenu}
            onOpenChange={setOpenMenu}
            containerRef={containerRef}
          />

          <div className="flex items-center gap-2 lg:justify-self-end">
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={springs.hover}
              className="flex"
            >
              <Button
                href={primaryCta.href}
                size="sm"
                variant={solid ? "secondary" : "glass"}
                className="active:scale-100 lg:h-10 lg:rounded-[16px] lg:px-5 lg:text-[15px]"
              >
                {primaryCta.label}
              </Button>
            </motion.div>

            <button
              type="button"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              onClick={() => setMobileOpen((v) => !v)}
              className={cn(
                "relative flex size-10 items-center justify-center rounded-[14px] outline-none transition-colors duration-200 lg:hidden",
                "focus-visible:ring-2 focus-visible:ring-current",
                solid ? "text-ink hover:bg-ink/[0.05]" : "text-white hover:bg-white/10",
              )}
            >
              <span className="relative block size-5">
                <Bar className={mobileOpen ? "translate-y-0 rotate-45" : "-translate-y-[6px]"} />
                <Bar className={mobileOpen ? "scale-x-0 opacity-0" : ""} />
                <Bar className={mobileOpen ? "translate-y-0 -rotate-45" : "translate-y-[6px]"} />
              </span>
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={mobileOpen} onClose={closeMobile} />
    </>
  );
}

function Bar({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "absolute left-0 top-1/2 h-[1.5px] w-5 -translate-y-1/2 rounded-full bg-current transition-[transform,opacity] duration-250 ease-out-quart",
        className,
      )}
    />
  );
}
