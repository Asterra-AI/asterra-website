import { TOY_ANCHOR } from "@/lib/site";
import { ToyGate } from "./toy-gate";

/** Home 3 · Hear it for yourself. The hero's search bar scrolls here. */
export function HearIt() {
  return (
    <section
      id={TOY_ANCHOR}
      className="relative isolate scroll-mt-16 overflow-hidden bg-white py-24 lg:py-32"
    >
      <div className="container-site">
        <ToyGate />
      </div>
    </section>
  );
}
