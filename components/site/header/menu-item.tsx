import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { NavItem } from "@/lib/nav";
import { cn } from "@/lib/utils";

export function MenuItem({
  item,
  described = false,
  onNavigate,
}: {
  item: NavItem;
  described?: boolean;
  onNavigate?: () => void;
}) {
  const Icon = item.icon;
  const externalProps = item.external ? { target: "_blank", rel: "noopener noreferrer" } : {};

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      {...externalProps}
      className={cn(
        "group/item flex items-start gap-3 rounded-xl outline-none transition-colors duration-150",
        "hover:bg-ink/[0.04] focus-visible:bg-ink/[0.04]",
        described ? "px-3 py-2.5" : "px-2.5 py-2",
      )}
    >
      <Icon
        aria-hidden
        strokeWidth={1.75}
        className={cn(
          "size-[18px] shrink-0 text-ink-3 transition-colors duration-150 group-hover/item:text-ink group-focus-visible/item:text-ink",
          described ? "mt-0.5" : "mt-px",
        )}
      />
      <span className="min-w-0">
        <span className="flex items-center gap-1 text-[14px] font-medium leading-5 text-ink">
          {item.label}
          {item.external && (
            <ArrowUpRight
              aria-hidden
              strokeWidth={2}
              className="size-3.5 text-ink-3 transition-transform duration-150 group-hover/item:-translate-y-px group-hover/item:translate-x-px"
            />
          )}
          {item.external && <span className="sr-only">(opens in a new tab)</span>}
        </span>
        {described && item.description && (
          <span className="mt-0.5 block text-[13px] leading-[18px] text-ink-3">{item.description}</span>
        )}
      </span>
    </Link>
  );
}
