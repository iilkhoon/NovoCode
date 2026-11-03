"use client";
import dynamic from "next/dynamic";
import { use } from "react";

const Studio = dynamic(() => import("@/components/studio/Studio"), {
  ssr: false,
  loading: () => <div className="grid h-dvh place-items-center text-sm text-ink-400">Studiya açılır…</div>,
});

export default function StudioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <Studio id={id} />;
}
