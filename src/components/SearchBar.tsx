"use client";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { useEffect, useState } from "react";

export function SearchBar({ value, onChange, disabled }: { value: string; onChange: (value: string) => void; disabled?: boolean }) {
  const [local, setLocal] = useState(value);

  useEffect(() => { setLocal(value); }, [value]);

  const debounced = useDebounce(local, 300);

  useEffect(() => {
    if (debounced !== value) onChange(debounced);
  }, [debounced]);

  const clear = () => { setLocal(""); onChange(""); };

  return (
    <div role="search" className="relative block">
      <Search aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
      <Input
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Escape") clear(); }}
        className="pl-10 pr-10"
        placeholder="Search universities or courses..."
        aria-label="Search alumni"
        disabled={disabled}
      />
      {local && (
        <button
          onClick={clear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          aria-label="Clear search"
          type="button"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
