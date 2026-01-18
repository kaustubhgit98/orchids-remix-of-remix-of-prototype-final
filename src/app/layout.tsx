import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/auth-provider";
import { Toaster } from "sonner";
import ErrorReporter from "@/components/ErrorReporter";
import Script from "next/script";

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
        <Script
          id="orchids-browser-logs"
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts/orchids-browser-logs.js"
          strategy="afterInteractive"
          data-orchids-project-id="25752dce-b78c-432c-be38-74eae8558fea"
        />
        <ErrorReporter />
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
