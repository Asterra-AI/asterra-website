/**
 * The restaurant name typed in the hero, handed to the toy. The toy loads
 * lazily, so the value is kept here as well as dispatched as an event.
 */
let current = "";
const listeners = new Set<(name: string) => void>();

export const heroName = {
  get: () => current,
  set(name: string) {
    current = name;
    listeners.forEach((l) => l(name));
  },
  subscribe(l: (name: string) => void) {
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  },
};
