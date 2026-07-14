"use client";
import { useEffect, useState } from "react";
export function CountdownTimer({ target }: { target: string | Date }) {
  const [remaining, setRemaining] = useState(0);
  useEffect(() => {
    const tick = () => setRemaining(Math.max(0, new Date(target).getTime() - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);
  const total = Math.floor(remaining / 1000);
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const mins = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  return (
    <span className="font-mono text-sm text-primary">
      {days ? `${days}d ` : ""}
      {String(hours).padStart(2, "0")}h {String(mins).padStart(2, "0")}m{" "}
      {String(secs).padStart(2, "0")}s
    </span>
  );
}
