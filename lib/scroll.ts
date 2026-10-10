import { animate } from "motion/react";

/**
 * Eased scroll that lands an element at `offset` px from the top of the viewport.
 * The target is re-read from the live layout every frame, so content that
 * resizes during the scroll (scroll-driven sections) can't make it land short.
 */
export function scrollToElement(el: HTMLElement, { offset = 0, duration = 0.8, instant = false } = {}) {
  const target = () => el.getBoundingClientRect().top + window.scrollY - offset;
  // The site sets `scroll-behavior: smooth`, which would turn each step into its
  // own queued smooth scroll. Steps must apply immediately.
  const jump = (y: number) => window.scrollTo({ top: y, behavior: "instant" });
  if (instant) {
    jump(target());
    return;
  }
  const ease = (t: number) => 1 - Math.pow(1 - t, 3);
  let prev = 0;
  animate(0, 1, {
    duration,
    ease: "linear",
    onUpdate: (t) => {
      const e = ease(t);
      const step = prev >= 1 ? 1 : (e - prev) / (1 - prev);
      prev = e;
      jump(window.scrollY + (target() - window.scrollY) * step);
    },
    onComplete: () => jump(target()),
  });
}
