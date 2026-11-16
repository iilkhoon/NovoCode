import type { Metadata } from "next";
import { Workspace } from "@/components/app/Workspace";

export const metadata: Metadata = { title: "Layihələrim", robots: { index: false } };

export default function AppPage() {
  return <Workspace />;
}
