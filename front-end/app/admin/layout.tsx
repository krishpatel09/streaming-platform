import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AuthGuard } from "@/components/auth/AuthGuard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard requiredRole="admin">
      <SidebarProvider>
        <TooltipProvider>
          <div className="flex h-screen w-full overflow-hidden bg-zinc-50 text-zinc-900 font-sans">
            <AdminSidebar />
            <SidebarInset className="flex flex-1 flex-col overflow-hidden bg-zinc-50">
              <AdminHeader />
              <main className="flex-1 overflow-y-auto p-6 text-zinc-900">
                {children}
              </main>
            </SidebarInset>
          </div>
        </TooltipProvider>
      </SidebarProvider>
    </AuthGuard>
  );
}
