import { prisma } from "@/lib/prisma";
import { AdminPlatformSettings } from "@/components/AdminPlatformSettings";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const [upiSetting, qrSetting, stats] = await Promise.all([
    prisma.platformSetting.findUnique({ where: { key: "upi_id" } }),
    prisma.platformSetting.findUnique({ where: { key: "upi_qr_code" } }),
    prisma.platformStat.findMany(),
  ]);

  const statsMap: Record<string, number> = {};
  stats.forEach((s) => { statsMap[s.key] = s.value; });

  return (
    <div>
      <Breadcrumbs items={[{ label: "Settings" }]} />
      <h1 className="text-3xl font-semibold text-primary">Platform settings</h1>
      <p className="mt-2 text-sm text-muted-foreground">Keep payment and public metric configuration current.</p>
      <div className="mt-8">
        <AdminPlatformSettings
          initialUpi={upiSetting?.value ?? "alumnow@upi"}
          initialStats={statsMap}
          initialQrCode={qrSetting?.value ?? null}
        />
      </div>
    </div>
  );
}
