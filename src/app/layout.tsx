import type { Metadata, Viewport } from "next";
import "@fontsource-variable/onest";
import "@fontsource-variable/fraunces";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";
import { Toaster } from "@/components/ui/toast";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://novocode.az"),
  title: { default: "Novo Code — Danış, saytın qurulsun", template: "%s · Novo Code" },
  description:
    "Azərbaycan dilində yazın və ya danışın — Novo Code süni intellektlə bir neçə dəqiqəyə dizaynı, funksionallığı və məlumat bazası olan tam işlək sayt qursun.",
  keywords: ["sayt qurucusu", "süni intellekt", "AI", "veb sayt", "Azərbaycan", "no-code", "Novo Code"],
  openGraph: {
    title: "Novo Code — Danış, saytın qurulsun",
    description: "Azərbaycanın AI sayt qurucusu. Fikrinizi yazın, saytınız dəqiqələr içində hazır olsun.",
    locale: "az_AZ",
    type: "website",
  },
};

export const viewport: Viewport = { themeColor: "#f1e9da", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="az">
      <body className="min-h-dvh font-sans antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
