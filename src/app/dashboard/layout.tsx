import { DashboardSidebar } from "@/components/DashboardSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#F4F6FA]">
      <DashboardSidebar />
      <main className="flex-1 overflow-y-auto lg:pl-[220px] transition-all duration-300">
        {children}
      </main>
    </div>
  );
}
