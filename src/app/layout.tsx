import "./globals.css";
import { ReactNode } from "react";
import { ThemeProvider } from "@/components/context/theme-provider";
import { Toaster } from "sonner";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Toaster richColors position="top-right" />
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col">
              <Topbar />
              <main className="p-6 bg-gray-50 dark:bg-zinc-950 min-h-[calc(100vh-56px)]">
                {children}
              </main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
