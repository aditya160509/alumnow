import { cn } from "@/lib/utils";
import type { InputHTMLAttributes } from "react";

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-[10px] border border-border bg-white px-3.5 text-sm text-navy outline-none placeholder:text-navy/30 transition-[border-color,box-shadow] duration-150 focus:border-gold focus:ring-4 focus:ring-gold/10 disabled:cursor-not-allowed disabled:bg-cream disabled:text-navy/30",
        className
      )}
      {...props}
    />
  );
}
