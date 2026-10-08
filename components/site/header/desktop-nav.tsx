"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { springs } from "@/lib/motion";
import { menus, navOrder, type MenuId } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { MenuPanelContent } from "./menu-panel";

const OPEN_DELAY = 50;
const CLOSE_DELAY = 140;

const spring = springs.slide;

type Geom = { x: number; width: number };

type Props = {
  /** Dark text on a light bar (scrolled) vs. white text over the hero. */
  solid: boolean;
  openMenu: MenuId | null;
  onOpenChange: (id: MenuId | null) => void;
  /** The header's inner container; panels are positioned relative to it. */
  containerRef: React.RefObject<HTMLDivElement | null>;
};

export function DesktopNav({ solid, openMenu, onOpenChange, containerRef }: Props) {
  const triggerRefs = useRef<Partial<Record<MenuId, HTMLButtonElement | null>>>({});
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const measureRef = useRef<HTMLDivElement | null>(null);
  const regionRef = useRef<HTMLDivElement | null>(null);

  const [hovered, setHovered] = useState<string | null>(null);
  const [itemGeoms, setItemGeoms] = useState<Record<string, Geom>>({});
  const [geom, setGeom] = useState<Geom | null>(null);
  const [height, setHeight] = useState<number | null>(null);

  const clearTimers = () => {
    if (openTimer.current) clearTimeout(openTimer.current);
    if (closeTimer.current) clearTimeout(closeTimer.current);
    openTimer.current = closeTimer.current = null;
  };

  /** Panel position and width for a menu, relative to the header container. */
  const computeGeom = useCallback(
    (id: MenuId): Geom | null => {
      const container = containerRef.current?.getBoundingClientRect();
      if (!container) return null;
      const def = menus[id];
      const width = Math.min(def.width, container.width);
      if (def.layout === "wide") return { x: (container.width - width) / 2, width };
      const trigger = triggerRefs.current[id]?.getBoundingClientRect();
      const centre = trigger ? trigger.left + trigger.width / 2 - container.left : container.width / 2;
      return { x: Math.max(0, Math.min(centre - width / 2, container.width - width)), width };
    },
    [containerRef],
  );

  // Geometry is set in the same render as the menu id, so a fresh open never
  // starts from the previous menu's size.
  const open = useCallback(
    (id: MenuId) => {
      setGeom(computeGeom(id));
      onOpenChange(id);
    },
    [computeGeom, onOpenChange],
  );

  const close = useCallback(() => {
    clearTimers();
    onOpenChange(null);
  }, [onOpenChange]);

  const scheduleOpen = (id: MenuId) => {
    clearTimers();
    openTimer.current = setTimeout(() => open(id), openMenu ? 0 : OPEN_DELAY);
  };

  const scheduleClose = () => {
    clearTimers();
    closeTimer.current = setTimeout(() => onOpenChange(null), CLOSE_DELAY);
  };

  useEffect(() => {
    if (!openMenu) return;
    const onResize = () => setGeom(computeGeom(openMenu));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [openMenu, computeGeom]);

  // Animate panel height as content swaps.
  useLayoutEffect(() => {
    const el = measureRef.current;
    if (!el || !openMenu) return;
    const ro = new ResizeObserver(([entry]) => setHeight(entry.contentRect.height));
    ro.observe(el);
    setHeight(el.getBoundingClientRect().height);
    return () => ro.disconnect();
  }, [openMenu]);

  // Escape closes and returns focus. Outside click closes.
  useEffect(() => {
    if (!openMenu) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        const id = openMenu;
        close();
        triggerRefs.current[id]?.focus();
      }
    };
    const onPointer = (e: PointerEvent) => {
      if (regionRef.current && !regionRef.current.contains(e.target as Node)) close();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [openMenu, close]);

  useEffect(() => clearTimers, []);

  // The highlight follows the hovered item, or rests on the open menu's trigger.
  // Geometry is captured when an item is entered, so render never reads refs.
  const highlightKey = hovered ?? openMenu;
  const highlight = highlightKey ? (itemGeoms[highlightKey] ?? null) : null;

  const rememberGeom = (key: string, el: HTMLElement) => {
    const next = { x: el.offsetLeft, width: el.offsetWidth };
    setItemGeoms((prev) =>
      prev[key]?.x === next.x && prev[key]?.width === next.width ? prev : { ...prev, [key]: next },
    );
  };

  const linkClass = cn(
    "relative flex h-9 items-center gap-1 rounded-[14px] px-3.5 text-[15px] font-medium outline-none",
    "transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-current",
    solid ? "text-ink/75 hover:text-ink" : "text-white/85 hover:text-white",
  );

  const current = openMenu ? menus[openMenu] : null;

  return (
    <div ref={regionRef} onMouseLeave={scheduleClose} className="contents">
      <nav aria-label="Main" className="hidden lg:block">
        <ul className="relative flex items-center gap-1" onMouseLeave={() => setHovered(null)}>
          {/* One highlight that slides and resizes between items. It mounts where it
              appears and fades out where it is, so it never flies in or out. */}
          <AnimatePresence>
            {highlight && (
              <motion.span
                key="highlight"
                aria-hidden
                initial={{ x: highlight.x, width: highlight.width, opacity: 0, scale: 0.9 }}
                animate={{ x: highlight.x, width: highlight.width, opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{
                  x: spring,
                  width: spring,
                  opacity: { duration: 0.2, ease: [0.25, 1, 0.5, 1] },
                  scale: { duration: 0.22, ease: [0.25, 1, 0.5, 1] },
                }}
                className={cn(
                  "pointer-events-none absolute top-0 left-0 h-9 rounded-[14px] transition-colors duration-300",
                  solid ? "bg-ink/[0.06]" : "bg-white/15",
                )}
              />
            )}
          </AnimatePresence>

          {navOrder.map((entry) => {
            const key = typeof entry === "string" ? entry : entry.href;
            const isMenu = typeof entry === "string";
            const active = isMenu && openMenu === entry;

            return (
              <li
                key={key}
                className="relative"
                onMouseEnter={(e) => {
                  rememberGeom(key, e.currentTarget);
                  setHovered(key);
                  if (isMenu) scheduleOpen(entry);
                  else scheduleClose();
                }}
              >
                {isMenu ? (
                  <button
                    ref={(el) => {
                      triggerRefs.current[entry] = el;
                    }}
                    type="button"
                    aria-haspopup="true"
                    aria-expanded={active}
                    aria-controls={`menu-${entry}`}
                    onClick={(e) => {
                      rememberGeom(entry, e.currentTarget.parentElement as HTMLElement);
                      if (active) close();
                      else {
                        clearTimers();
                        open(entry);
                      }
                    }}
                    className={cn(linkClass, active && (solid ? "text-ink" : "text-white"))}
                  >
                    {menus[entry].label}
                    <ChevronDown
                      aria-hidden
                      strokeWidth={2}
                      className={cn(
                        "size-4 transition-transform duration-300 ease-out-quart",
                        active && "rotate-180",
                      )}
                    />
                  </button>
                ) : (
                  <Link href={entry.href} className={linkClass}>
                    {entry.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Dropdown panel */}
      <AnimatePresence>
        {current && geom && (
          <motion.div
            key="panel"
            id={`menu-${current.id}`}
            onMouseEnter={clearTimers}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6, transition: { duration: 0.14 } }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-x-0 top-full hidden pt-2 lg:block"
          >
            <motion.div
              initial={false}
              animate={{ x: geom.x, width: geom.width, ...(height !== null ? { height } : {}) }}
              transition={{ type: "spring", stiffness: 480, damping: 44, mass: 0.7 }}
              className="overflow-hidden rounded-3xl bg-white shadow-panel ring-1 ring-ink/[0.06]"
            >
              <div ref={measureRef}>
                <AnimatePresence mode="popLayout" initial={false}>
                  {/* Content is laid out at its final width, so text never re-wraps while the panel resizes. */}
                  <motion.div
                    key={current.id}
                    style={{ width: geom.width }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.12 }}
                  >
                    <MenuPanelContent menu={current} onNavigate={close} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
