"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Loader2, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { updateSessionPricing, deleteSessionType } from "@/actions/alumni-profile.actions";

const TYPE_LABELS: Record<string, string> = {
  call_30: "30-min 1:1 call",
  call_45: "45-min 1:1 call",
  call_60: "60-min 1:1 call",
  group_40: "40-min group session",
};

interface Offering {
  id: string;
  type: string;
  pricePaise: number;
  maxParticipants: number;
}

interface PricingEditorProps {
  offerings: Offering[];
}

export function PricingEditor({ offerings }: PricingEditorProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [prices, setPrices] = useState<Record<string, number>>(
    Object.fromEntries(offerings.map((o) => [o.type, o.pricePaise]))
  );
  const [maxParticipants, setMaxParticipants] = useState<Record<string, number>>(
    Object.fromEntries(offerings.map((o) => [o.type, o.maxParticipants]))
  );

  async function handleSave(type: string) {
    setSaving(true);
    const result = await updateSessionPricing({
      type,
      pricePaise: prices[type] ?? 0,
      maxParticipants: maxParticipants[type] ?? 1,
    });
    setSaving(false);
    if (result.success) {
      toast.success(`${TYPE_LABELS[type] ?? type} price updated`);
      router.refresh();
    } else {
      toast.error(result.error ?? "Failed to update pricing");
    }
  }

  async function handleDelete(type: string) {
    const offering = offerings.find((o) => o.type === type);
    if (!offering) return;
    const result = await deleteSessionType(offering.id);
    if (result.success) {
      toast.success(`${TYPE_LABELS[type] ?? type} removed`);
      router.refresh();
    } else {
      toast.error(result.error ?? "Failed to delete session type");
    }
  }

  function formatPrice(paise: number) {
    return `₹${(paise / 100).toLocaleString("en-IN")}`;
  }

  if (offerings.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">No session types configured yet.</p>
      </Card>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      {offerings.map((offering) => (
        <Card key={offering.id} className="p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-primary">{TYPE_LABELS[offering.type] ?? offering.type}</h3>
              <p className="mt-0.5 text-sm text-muted-foreground">Current: {formatPrice(offering.pricePaise)}</p>
            </div>
            <div className="flex items-center gap-3">
              <div>
                <label className="mb-0.5 block text-xs text-muted-foreground">Price (₹)</label>
                <Input
                  type="number"
                  value={Math.round((prices[offering.type] ?? 0) / 100)}
                  onChange={(e) => setPrices({ ...prices, [offering.type]: Number(e.target.value) * 100 })}
                  className="h-9 w-24"
                  min={0}
                />
              </div>
              {offering.type === "group_40" && (
                <div>
                  <label className="mb-0.5 block text-xs text-muted-foreground">Max</label>
                  <Input
                    type="number"
                    value={maxParticipants[offering.type] ?? 6}
                    onChange={(e) => setMaxParticipants({ ...maxParticipants, [offering.type]: Number(e.target.value) })}
                    className="h-9 w-16"
                    min={1}
                    max={20}
                  />
                </div>
              )}
              <div className="flex gap-2 pt-4">
                <Button size="sm" variant="primary" onClick={() => handleSave(offering.type)} disabled={saving}>
                  {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleDelete(offering.type)} className="text-destructive">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </motion.div>
  );
}
