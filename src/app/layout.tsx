import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/auth-provider";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "MetaPrompt - AI Prompt Engineering Studio",
  description: "Analyze, optimize, and enhance your AI prompts for superior results",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          <AuthProvider>
            <div className="mesh-gradient-premium" aria-hidden="true" />
            <div className="living-particles" aria-hidden="true">
              <div className="particle" />
              <div className="particle" />
              <div className="particle" />
              <div className="particle" />
              <div className="particle" />
              <div className="particle" />
              <div className="particle" />
              <div className="particle" />
              <div className="particle" />
              <div className="particle" />
            </div>
            <div className="relative min-h-screen">
              {children}
            </div>
            <Toaster position="top-center" richColors />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
