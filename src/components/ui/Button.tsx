import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";

const variants = cva(
  "inline-flex items-center justify-center gap-2 rounded-[10px] px-4 py-2.5 text-sm font-semibold outline-none transition-[background-color,box-shadow,transform,color] duration-150 ease-out focus-visible:ring-2 focus-visible:ring-gold/30 disabled:pointer-events-none disabled:opacity-50 active:scale-[.97]",
  {
    variants: {
      variant: {
        primary:
          "bg-navy text-white shadow-sm hover:bg-navy-light hover:shadow-md",
        accent:
          "bg-gold text-white shadow-sm hover:bg-gold-light hover:shadow-md",
        outline:
          "border border-navy/15 bg-white text-navy shadow-sm hover:bg-navy/5 hover:shadow-md",
        ghost: "text-navy/70 hover:bg-navy/5",
        danger: "bg-red-600 text-white hover:bg-red-700",
      },
      size: {
        sm: "px-3 py-2 text-xs",
        md: "px-4 py-2.5 text-sm",
        lg: "px-5 py-3 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export function Button({
  className,
  variant,
  size,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof variants>) {
  return (
    <button
      type={type}
      className={cn(variants({ variant, size }), className)}
      {...props}
    />
  );
}
