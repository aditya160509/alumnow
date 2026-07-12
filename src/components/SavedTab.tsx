"use client";
import { Button } from "@/components/ui/Button";
export function SavedTab({ tab, onTabChange, savedCount }: { tab: "browse" | "saved"; onTabChange: (tab: "browse" | "saved") => void; savedCount: number }) {
  return (
    <div className="flex gap-2">
      <Button variant={tab === "browse" ? "primary" : "outline"} onClick={() => onTabChange("browse")}>
        Browse
      </Button>
      <Button variant={tab === "saved" ? "primary" : "outline"} onClick={() => onTabChange("saved")}>
        Saved {savedCount > 0 && <span className="ml-1.5 rounded-full bg-accent px-1.5 text-xs text-primary">{savedCount}</span>}
      </Button>
    </div>
  );
}
