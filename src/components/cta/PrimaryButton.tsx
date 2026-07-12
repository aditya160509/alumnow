"use client";
import { cn } from "@/lib/utils";
import { AnimatedText } from "./AnimatedText";

interface PrimaryButtonProps {
  as?: "a" | "button";
  href?: string;
  children: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: "h-9 px-6 text-xs",
  md: "h-10 px-7 text-sm",
  lg: "h-12 px-9 text-sm",
};

export function PrimaryButton({
  as: Tag = "a",
  href,
  children,
  className,
  size = "lg",
}: PrimaryButtonProps) {
  return (
    <Tag
      href={href}
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-white/80 text-black font-medium leading-none transition-colors hover:bg-white",
        sizes[size],
        className
      )}
    >
      <AnimatedText>{children}</AnimatedText>
    </Tag>
  );
}
