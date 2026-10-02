import type { Metadata } from "next";
import "./globals.css";
import { geistMono, geistSans, montserrat } from "@/lib/fonts";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toast";

export const metadata: Metadata = {
  title: "PlotQ",
  description:
    "Track movies, series, and anime you want to watch, are watching, have already watched, or more importantly if you've already watched a series/anime and the new season is releasing in future.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
