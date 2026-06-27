import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Manrope, Space_Grotesk } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope"
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk"
});

export const metadata: Metadata = {
  title: {
    default: "ProposalAI",
    template: "%s | ProposalAI"
  },
  description: "Premium AI-powered proposal generator for freelancers, agencies, software teams, and consultants."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${spaceGrotesk.variable}`} suppressHydrationWarning>
      <body className="bg-ink-950 text-white antialiased">
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (() => {
                try {
                  const saved = localStorage.getItem("proposalai-theme");
                  const theme = saved === "light" ? "light" : "dark";
                  document.documentElement.dataset.theme = theme;
                } catch (error) {}
              })();
            `
          }}
        />
        {children}
      </body>
    </html>
  );
}
