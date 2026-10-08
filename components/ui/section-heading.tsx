import { cn } from "@/lib/utils";

type Props = {
  title: string;
  line?: string;
  align?: "center" | "left";
  /** Light text for dark sections. */
  tone?: "light" | "dark";
  as?: "h1" | "h2";
  /** `lg` for sections that lead with type. */
  size?: "md" | "lg";
  className?: string;
};

/** Headline + one line, the pattern every section on the site uses. Never a paragraph. */
export function SectionHeading({
  title,
  line,
  align = "center",
  tone = "dark",
  as: Tag = "h2",
  size = "md",
  className,
}: Props) {
  const light = tone === "light";
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start",
        className,
      )}
    >
      <Tag
        className={cn(
          "type-display max-w-[20ch]",
          size === "lg" ? "[font-size:clamp(2.25rem,4.6vw,4rem)]" : "[font-size:clamp(2rem,3.8vw,3.25rem)]",
          light ? "text-white" : "text-ink",
        )}
      >
        {title}
      </Tag>
      {line && (
        <p
          className={cn(
            "max-w-[46ch] text-pretty text-[17px] leading-relaxed sm:text-lg",
            light ? "text-white/70" : "text-ink-2",
          )}
        >
          {line}
        </p>
      )}
    </div>
  );
}
