import { Clock3 } from "lucide-react";
export function ResponseTimeBadge({ hours }: { hours: number | null }) { return hours == null ? null : <span className="inline-flex items-center gap-1 text-xs text-muted-foreground"><Clock3 size={14} />Responds within {hours < 1 ? "an hour" : `${Math.round(hours)}h`}</span>; }
