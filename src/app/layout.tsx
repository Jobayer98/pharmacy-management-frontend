import "./globals.css";
import { ReactNode } from "react";
import { ThemeProvider } from "@/components/context/theme-provider";
import { Toaster } from "sonner";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Toaster richColors position="top-right" />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
