"use client";
import { useState } from "react";
import { Button as AxButton } from "@astryxdesign/core/Button";
import { Badge as AxBadge } from "@astryxdesign/core/Badge";
import { TextInput } from "@astryxdesign/core/TextInput";
import { Switch } from "@astryxdesign/core/Switch";
import { SegmentedControl, SegmentedControlItem } from "@astryxdesign/core/SegmentedControl";
import { ProgressBar } from "@astryxdesign/core/ProgressBar";
import { Tooltip } from "@astryxdesign/core/Tooltip";
import { Table } from "@astryxdesign/core/Table";
import { Dialog, DialogHeader } from "@astryxdesign/core/Dialog";
import { Rocket } from "lucide-react";
import { AstryxTheme } from "@/components/AstryxTheme";
import { Glass } from "@/components/landing/Section";

type Row = { name: string; status: string; visits: number } & Record<string, unknown>;
/** Deterministic "12 480" — toLocaleString differs between Node and browsers (hydration mismatch). */
const formatThousands = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "\u00a0");

const ROWS: Row[] = [
  { name: "Çay evi «Dəmlə»", status: "Canlı", visits: 1240 },
  { name: "Dizayn studiyası", status: "Qaralama", visits: 0 },
  { name: "Qəbələ tur", status: "Canlı", visits: 860 },
];

const label = "mb-4 font-mono text-[10.5px] uppercase tracking-[0.2em] text-ink-500";

export function AstryxShowcase() {
  const [name, setName] = useState("Mənim saytım");
  const [on, setOn] = useState(true);
  const [view, setView] = useState("desktop");
  const [open, setOpen] = useState(false);

  return (
    <AstryxTheme className="mt-12 grid gap-4 lg:grid-cols-2">
      <Glass className="p-6">
        <div className={label}>Düymələr · nişanlar</div>
        <div className="flex flex-wrap items-center gap-3">
          <AxButton variant="primary" label="Yayımla" icon={<Rocket className="size-4" />} onClick={() => setOpen(true)} />
          <AxButton label="Önizləmə" />
          <AxButton variant="ghost" label="Ləğv et" />
          <Tooltip content="Bu əməliyyat geri qaytarılmır">
            <AxButton variant="destructive" label="Sil" />
          </Tooltip>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <AxBadge label="Canlı" variant="success" />
          <AxBadge label="Qaralama" variant="neutral" />
          <AxBadge label="Vurğu" variant="gray" />
          <AxBadge label="Sapfir" variant="blue" />
        </div>
      </Glass>

      <Glass className="space-y-5 p-6">
        <div className={label}>Forma</div>
        <TextInput label="Layihənin adı" value={name} onChange={setName} />
        <Switch label="Avtomatik düzəltmə" value={on} onChange={setOn} />
        <SegmentedControl label="Cihaz" value={view} onChange={setView}>
          <SegmentedControlItem value="desktop" label="Kompüter" />
          <SegmentedControlItem value="tablet" label="Planşet" />
          <SegmentedControlItem value="mobile" label="Telefon" />
        </SegmentedControl>
        <ProgressBar label="Build" value={68} />
      </Glass>

      <Glass className="p-6 lg:col-span-2">
        <div className={label}>Cədvəl</div>
        <Table<Row>
          data={ROWS}
          columns={[
            { key: "name", header: "Layihə" },
            { key: "status", header: "Status", renderCell: (r) => <AxBadge label={r.status} variant={r.status === "Canlı" ? "success" : "neutral"} /> },
            { key: "visits", header: "Ziyarət", align: "end", renderCell: (r) => formatThousands(r.visits) },
          ]}
        />
      </Glass>

      <Dialog isOpen={open} onOpenChange={setOpen} width={420}>
        <DialogHeader title="Saytı yayımla" subtitle="Astryx Dialog · Novo mövzusu" onOpenChange={setOpen} />
        <div className="space-y-4 p-5 text-[14px] text-ink-300">
          <p>Fokus dialoqun içində qalır, Esc ilə bağlanır və fokus düyməyə qayıdır.</p>
          <div className="flex justify-end gap-2">
            <AxButton variant="ghost" label="Ləğv et" onClick={() => setOpen(false)} />
            <AxButton variant="primary" label="Davam et" onClick={() => setOpen(false)} />
          </div>
        </div>
      </Dialog>
    </AstryxTheme>
  );
}
