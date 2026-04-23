import type { Metadata } from "next";
import { Geist, Inter, MuseoModerno } from "next/font/google";
import "./css/globals.css";
import "./css/responsive.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from '@clerk/ui/themes'
import Navigation from "@/components/layouts/navigation/navigation";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
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
      className={`${geist.variable} ${inter.variable} ${musemoderno.variable} h-full antialiased`}
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
              {children}
            </Navigation>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
