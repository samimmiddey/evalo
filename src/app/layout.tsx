import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter, Lobster, Geist } from "next/font/google";
import "./css/globals.css";
import "./css/responsive.css";
import "./css/external.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from '@clerk/ui/themes';
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TopLoader } from "@/components/common/top-loader";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const lobster = Lobster({
  variable: "--font-lobster",
  subsets: ["latin"],
  weight: ['400'],
});

export const metadata: Metadata = {
  title: "Evalo",
  description: "Evaluate talent with clarity and confidence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${geist.variable} ${inter.variable} ${lobster.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ClerkProvider appearance={{ theme: dark }}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            disableTransitionOnChange
          >
            <TopLoader />
            <div className="bg-zinc-950">
              <TooltipProvider>{children}</TooltipProvider>
            </div>
            <Toaster position="top-center" richColors />
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
