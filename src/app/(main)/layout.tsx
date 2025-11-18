import { ReactNode } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { SidebarProvider } from "@/contexts/SidebarContext";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <SidebarProvider>
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <Topbar />
            <main className="p-4 md:p-6 bg-gray-50 dark:bg-zinc-950 min-h-[calc(100vh-56px)]">
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </QueryProvider>
  );
}
