import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Both logo variants are stacked and cross-faded so the swap on scroll is a
 * smooth opacity change rather than an image replacement.
 */
export function Logo({ solid, className }: { solid: boolean; className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Asterra home"
      className={cn("relative flex h-7 shrink-0 items-center", className)}
    >
      {/* Full wordmark (≥ 380px) */}
      <span className="relative hidden h-7 w-[106px] min-[380px]:block">
        <Image
          src="/brand/whitelogo.png"
          alt=""
          fill
          sizes="106px"
          priority
          className={cn(
            "object-contain transition-opacity duration-300",
            solid ? "opacity-0" : "opacity-100",
          )}
        />
        <Image
          src="/brand/darklogo.png"
          alt="Asterra"
          fill
          sizes="106px"
          priority
          className={cn(
            "object-contain transition-opacity duration-300",
            solid ? "opacity-100" : "opacity-0",
          )}
        />
      </span>
      {/* Square mark on very narrow screens */}
      <span className="relative block h-7 w-7 min-[380px]:hidden">
        <Image src="/brand/squarelogo.png" alt="Asterra" fill sizes="28px" className="object-contain" />
      </span>
    </Link>
  );
}
