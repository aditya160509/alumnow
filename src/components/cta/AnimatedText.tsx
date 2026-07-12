"use client";
import { useState } from "react";

interface AnimatedTextProps {
  children: string;
}

export function AnimatedText({ children }: AnimatedTextProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <span
      className="relative inline-block overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span
        className="block transition-transform duration-200 ease-out"
        style={{ transform: hovered ? "translateY(-100%)" : "translateY(0)" }}
      >
        {children}
      </span>
      <span
        className="absolute inset-0 block transition-transform duration-200 ease-out"
        style={{ transform: hovered ? "translateY(0)" : "translateY(100%)" }}
      >
        {children}
      </span>
    </span>
  );
}
