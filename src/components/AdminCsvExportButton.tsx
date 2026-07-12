"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { exportBookingsCsv } from "@/actions/admin.actions";
import { toast } from "@/components/ui/Toaster";

export function AdminCsvExportButton() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleExport = async (filtered: boolean) => {
    setLoading(true);
    try {
      const csv = await exportBookingsCsv(filtered ? { startDate, endDate } : {});
      const url = URL.createObjectURL(new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = `alumnow-bookings${filtered ? "-filtered" : ""}.csv`;
      link.click();
      URL.revokeObjectURL(url);
      toast({ title: "Exported", description: "CSV file downloaded." });
    } catch {
      toast({ title: "Export failed", description: "Could not generate CSV.", variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-end gap-3">
      <label className="text-sm">
        <span className="block text-xs text-muted-foreground mb-1">From</span>
        <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="h-9 text-xs" />
      </label>
      <label className="text-sm">
        <span className="block text-xs text-muted-foreground mb-1">To</span>
        <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="h-9 text-xs" />
      </label>
      <Button variant="outline" size="sm" disabled={loading} onClick={() => handleExport(true)}>Export filtered</Button>
      <Button variant="outline" size="sm" disabled={loading} onClick={() => handleExport(false)}>Export all</Button>
    </div>
  );
}
