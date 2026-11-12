import type { Metadata, Viewport } from "next";
import "@fontsource-variable/onest";
import "@fontsource-variable/fraunces/opsz.css";
import "@fontsource-variable/fraunces/opsz-italic.css";
import "@fontsource-variable/martian-mono";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";
import { Toaster } from "@/components/ui/toast";
import { THEME_BOOT } from "@/lib/theme";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://novocode.az"),
  title: { default: "NovoCode — Danış, saytın qurulsun", template: "%s · NovoCode" },
  description:
    "Azərbaycan dilində yazın və ya danışın — NovoCode süni intellektlə bir neçə dəqiqəyə dizaynı, funksionallığı və məlumat bazası olan tam işlək sayt qursun.",
  keywords: ["sayt qurucusu", "süni intellekt", "AI", "veb sayt", "Azərbaycan", "no-code", "NovoCode"],
  openGraph: {
    title: "NovoCode — Danış, saytın qurulsun",
    description: "Azərbaycanın AI sayt qurucusu. Fikrinizi yazın, saytınız dəqiqələr içində hazır olsun.",
    locale: "az_AZ",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4efe6" },
    { media: "(prefers-color-scheme: dark)", color: "#14110e" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="az" data-theme="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT }} />
      </head>
      <body className="min-h-dvh font-sans antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
