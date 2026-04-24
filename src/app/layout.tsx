import type { Metadata } from "next";
import { Outfit, Inter, MuseoModerno, Lobster_Two } from "next/font/google";
import "./css/globals.css";
import "./css/responsive.css";
import "./css/external.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from '@clerk/ui/themes'
import Navigation from "@/components/layouts/navigation/navigation";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const lobster = Lobster_Two({
  variable: "--font-lobster",
  subsets: ["latin"],
  weight: ['400', '700'],
});

const musemoderno = MuseoModerno({
  variable: "--font-musemoderno",
  subsets: ["latin"],
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
      className={`${outfit.variable} ${inter.variable} ${lobster.variable} ${musemoderno.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ClerkProvider appearance={{ theme: dark }}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            disableTransitionOnChange
          >
            <Navigation>
              <div className="bg-zinc-950">
                {children}
              </div>
            </Navigation>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
