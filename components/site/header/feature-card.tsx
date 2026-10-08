import Image from "next/image";
import Link from "next/link";
import type { FeatureCard as FeatureCardDef } from "@/lib/nav";
import { cn } from "@/lib/utils";

const tones: Record<NonNullable<FeatureCardDef["tone"]>, string> = {
  sky: "from-[#5B8FE8] via-[#2F6BD8] to-[#1C4FB0]",
  ink: "from-[#2A2A2E] via-[#17171A] to-[#0B0B0C]",
  paper: "from-[#ECEAE4] via-[#DCD9D1] to-[#C9C5BB]",
};

export function FeatureCard({
  card,
  onNavigate,
  className,
  compact = false,
}: {
  card: FeatureCardDef;
  onNavigate?: () => void;
  className?: string;
  /** Shorter, banner-like proportions (mobile sheet). */
  compact?: boolean;
}) {
  const tone = card.tone ?? "ink";
  const lightText = tone !== "paper";

  return (
    <Link
      href={card.href}
      onClick={onNavigate}
      className={cn(
        "group relative block overflow-hidden rounded-2xl outline-none",
        "focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2",
        className,
      )}
    >
      <div className={cn("relative w-full", compact ? "aspect-[2/1]" : "aspect-[260/200]")}>
        {card.image ? (
          <Image
            src={card.image}
            alt=""
            fill
            sizes="260px"
            className="object-cover transition-transform duration-500 ease-out-quart group-hover:scale-[1.04]"
          />
        ) : (
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-br transition-transform duration-500 ease-out-quart group-hover:scale-[1.04]",
              tones[tone],
            )}
          />
        )}
        {/* Legibility scrim */}
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-t to-transparent",
            lightText ? "from-black/60 via-black/20" : "from-white/70 via-white/10",
          )}
        />
        <div className={cn("absolute inset-x-0 bottom-0 p-4", lightText ? "text-white" : "text-ink")}>
          <p className="text-[15px] font-semibold leading-snug tracking-[-0.01em]">{card.title}</p>
          <p className={cn("mt-0.5 text-[13px] leading-snug", lightText ? "text-white/80" : "text-ink-2")}>
            {card.line}
          </p>
        </div>
      </div>
    </Link>
  );
}
