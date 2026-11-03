import type { Metadata } from "next";
import { DesignSystem } from "./DesignSystem";

export const metadata: Metadata = { title: "Dizayn sistemi", description: "Novo Code — Nar 2.0 dizayn sistemi: rənglər, tipoqrafiya, komponentlər və hərəkət." };

export default function Page() {
  return <DesignSystem />;
}
