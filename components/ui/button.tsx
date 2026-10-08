import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "glass" | "white";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium " +
  "transition-[background-color,color,border-color,scale,box-shadow] duration-200 ease-out-quart " +
  "active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 select-none";

const variants: Record<Variant, string> = {
  primary: "bg-ink text-white hover:bg-ink/85",
  secondary: "bg-ink/[0.06] text-ink hover:bg-ink/[0.1]",
  ghost: "text-ink hover:bg-ink/[0.05]",
  glass: "glass-dark text-white hover:bg-white/10",
  white: "bg-white/85 text-ink backdrop-blur-md shadow-[0_1px_2px_rgb(0_0_0/0.06)] hover:bg-white/95",
};

const sizes: Record<Size, string> = {
  sm: "h-9 rounded-[14px] px-4 text-[13.5px]",
  md: "h-11 rounded-[16px] px-5 text-[15px]",
  lg: "h-12 rounded-[18px] px-6 text-base",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

type ButtonAsButton = CommonProps &
  Omit<ComponentPropsWithoutRef<"button">, "className" | "children"> & { href?: undefined };

type ButtonAsLink = CommonProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, "className" | "children"> & { href: string };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button({ variant = "primary", size = "md", className, children, ...props }: ButtonProps) {
  const classes = cn(base, variants[variant], sizes[size], className);

  if (props.href !== undefined) {
    const { href, ...rest } = props as ButtonAsLink;
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  const { type = "button", ...rest } = props as ButtonAsButton;
  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  );
}
