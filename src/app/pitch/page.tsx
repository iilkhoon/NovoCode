import type { Metadata } from "next";
import { Deck } from "@/components/pitch/Deck";

export const metadata: Metadata = {
  title: "Təqdimat",
  description: "NovoCode — investor təqdimatı.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <Deck />;
}
