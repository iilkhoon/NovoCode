"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Download, FolderOpen, Home, LayoutTemplate, LogOut, Menu as MenuIcon, Moon, PanelLeftClose, PanelLeftOpen, Plus, Search, Settings, Shield, Sparkles, Sun, X } from "lucide-react";
import { LogoMark, Wordmark } from "@/components/Logo";
import { Avatar, Kbd, Menu, MenuItem, MenuSeparator, Progress } from "@/components/ui/kit";
import { useTheme } from "@/lib/theme";
import { openModal, useDailyUsage, usePrefs } from "@/lib/ui-store";
import type { Project } from "@/lib/types";
import { cn } from "@/lib/cn";
import { useT } from "@/lib/i18n";
import { signOut, useUser } from "@/lib/supabase";

/** Deterministic warm hue per project, for thumbnails and dots. */
export function projectHue(id: string) {
  let h = 0;
  for (const c of id) h = (h * 31 + c.charCodeAt(0)) % 360;
  return [12, 24, 340, 200, 160, 280, 38][h % 7];
}

export function Sidebar({ projects, onNew }: { projects: Project[]; onNew: () => void }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [q, setQ] = useState("");
  const search = useRef<HTMLInputElement>(null);
  const t = useT();

  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem("novo-sidebar") === "1");
    } catch {}
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCollapsed(false);
        setMobile(true);
        requestAnimationFrame(() => search.current?.focus());
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  const toggle = () =>
    setCollapsed((c) => {
      try {
        localStorage.setItem("novo-sidebar", c ? "0" : "1");
      } catch {}
      return !c;
    });

  const list = projects.filter((p) => p.name.toLowerCase().includes(q.trim().toLowerCase()));

  const body = (isMobile: boolean) => {
    const mini = collapsed && !isMobile;
    return (
      <div className="flex h-full flex-col gap-1 p-3">
        <div className={cn("flex h-11 items-center", mini ? "justify-center" : "justify-between pl-1.5")}>
          <Link href="/" aria-label="NovoCode ana səhifə" className="flex items-center gap-2.5 text-[16px]">
            <LogoMark className="size-7" />
            {!mini && <Wordmark caret={false} />}
          </Link>
          {isMobile ? (
            <IconBtn label={t("nav.closeMenu")} onClick={() => setMobile(false)}>
              <X />
            </IconBtn>
          ) : (
            !mini && (
              <IconBtn label={t("app.collapse")} onClick={toggle}>
                <PanelLeftClose />
              </IconBtn>
            )
          )}
        </div>
        {mini && (
          <IconBtn label={t("app.expand")} onClick={toggle} className="mx-auto">
            <PanelLeftOpen />
          </IconBtn>
        )}

        <button
          type="button"
          onClick={() => (setMobile(false), onNew())}
          className={cn("mt-2 flex h-10 items-center gap-2 rounded-xl bg-pill text-[14px] font-medium text-wool transition-[transform,box-shadow] hover:shadow-[var(--shadow-nav)] active:scale-[0.98]", mini ? "mx-auto w-10 justify-center" : "px-3")}
          aria-label={t("app.new")}
        >
          <Plus className="size-4" />
          {!mini && <span className="flex-1 text-left">{t("app.new")}</span>}
        </button>

        {!mini && (
          <label className="relative mt-2 block">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-500" />
            <input ref={search} value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("app.search")} aria-label={t("app.search")} className="h-9 w-full rounded-xl bg-ink-100/[0.05] pl-9 pr-12 text-[13.5px] text-ink-100 placeholder:text-ink-500 focus:bg-ink-1000 focus:outline-none focus:ring-2 focus:ring-nar/30" />
            <Kbd className="absolute right-2 top-1/2 -translate-y-1/2">⌘K</Kbd>
          </label>
        )}

        <nav aria-label="Tətbiq" className="mt-2 flex flex-col gap-0.5">
          <NavItem href="/app" icon={<Home />} label={t("app.home")} mini={mini} />
          <NavItem href="/app#layihələr" icon={<FolderOpen />} label={t("app.projects")} mini={mini} count={projects.length} />
          <NavItem href="/app#şablonlar" icon={<LayoutTemplate />} label={t("app.templates")} mini={mini} />
          <NavItem onClick={() => openModal("import")} icon={<Download />} label={t("app.import")} mini={mini} />
        </nav>

        {!mini && (
          <div className="mt-4 flex min-h-0 flex-1 flex-col">
            <p className="label-mono px-2.5 pb-2 text-ink-500">{t("app.recent")}</p>
            <div className="scroll-thin -mx-1 min-h-0 flex-1 overflow-y-auto px-1">
              {list.length === 0 && <p className="px-2.5 py-2 text-[13px] text-ink-500">{q ? t("app.notFound") : t("app.noProjects")}</p>}
              {list.slice(0, 30).map((p) => (
                <a key={p.id} href={`/studio/${p.id}`} className="group flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[13.5px] text-ink-300 transition-colors hover:bg-ink-100/[0.05] hover:text-ink-100">
                  <span className="size-2 shrink-0 rounded-full" style={{ background: `hsl(${projectHue(p.id)} 70% 55%)` }} />
                  <span className="truncate">{p.name}</span>
                </a>
              ))}
            </div>
          </div>
        )}
        {mini && <div className="flex-1" />}

        {!mini && <CreditCard />}
        <UserRow mini={mini} />
      </div>
    );
  };

  return (
    <>
      {/* desktop */}
      <motion.aside animate={{ width: collapsed ? 68 : 264 }} transition={{ type: "spring", stiffness: 420, damping: 40 }} className="sticky top-0 hidden h-dvh shrink-0 overflow-hidden border-r border-ink-100/8 bg-ink-950 md:block">
        {body(false)}
      </motion.aside>

      {/* mobile top bar + drawer */}
      <div className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-ink-100/8 bg-wool/85 px-3 backdrop-blur-md md:hidden">
        <IconBtn label={t("nav.openMenu")} onClick={() => setMobile(true)}>
          <MenuIcon />
        </IconBtn>
        <Link href="/" className="flex items-center gap-2 text-[15px]">
          <LogoMark className="size-6" />
          <Wordmark caret={false} />
        </Link>
        <IconBtn label={t("app.new")} onClick={onNew}>
          <Plus />
        </IconBtn>
      </div>
      {mobile && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-ink-100/30 backdrop-blur-[2px] [animation:nv-fade_.2s_ease_both]" onClick={() => setMobile(false)} />
          <aside className="absolute inset-y-0 left-0 w-[86%] max-w-[320px] bg-ink-950 shadow-[var(--shadow-panel)] [animation:sb-in_.32s_var(--ease-out-expo)_both]">{body(true)}</aside>
        </div>
      )}
    </>
  );
}

function IconBtn({ label, onClick, children, className }: { label: string; onClick: () => void; children: React.ReactNode; className?: string }) {
  return (
    <button type="button" onClick={onClick} aria-label={label} title={label} className={cn("grid size-9 shrink-0 place-items-center rounded-xl text-ink-400 transition-colors hover:bg-ink-100/[0.06] hover:text-ink-100 [&>svg]:size-[18px]", className)}>
      {children}
    </button>
  );
}

function NavItem({ href, onClick, icon, label, mini, count }: { href?: string; onClick?: () => void; icon: React.ReactNode; label: string; mini: boolean; count?: number }) {
  const path = usePathname();
  const active = href === path;
  const cls = cn(
    "flex h-9 items-center gap-2.5 rounded-xl text-[13.5px] transition-colors [&>svg]:size-[17px] [&>svg]:shrink-0",
    mini ? "mx-auto w-9 justify-center" : "px-2.5",
    active ? "bg-ink-100/[0.07] font-medium text-ink-100" : "text-ink-400 hover:bg-ink-100/[0.05] hover:text-ink-100"
  );
  const inner = (
    <>
      {icon}
      {!mini && <span className="flex-1 text-left">{label}</span>}
      {!mini && count != null && count > 0 && <span className="text-[11.5px] text-ink-500">{count}</span>}
    </>
  );
  return href ? (
    <Link href={href} className={cls} title={mini ? label : undefined} aria-current={active ? "page" : undefined}>
      {inner}
    </Link>
  ) : (
    <button type="button" onClick={onClick} className={cls} title={mini ? label : undefined}>
      {inner}
    </button>
  );
}

function CreditCard() {
  const t = useT();
  const usage = useDailyUsage();
  const low = usage.used / usage.limit >= 0.8;
  return (
    <div className="mb-2 mt-3 rounded-2xl border border-ink-100/8 bg-ink-1000 p-3.5 shadow-[var(--shadow-card)]">
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-medium text-ink-100">{t("app.plan", { plan: "Beta" })}</p>
        <p className="text-[12px] text-ink-400">
          {usage.used}/{usage.limit}
        </p>
      </div>
      <Progress value={usage.used} max={usage.limit} tone={low ? "warning" : "nar"} className="mt-2.5" label="Bu günkü mesajlar" />
      <p className="mt-2 text-[11.5px] text-ink-500">{t("app.betaNote")}</p>
      <button type="button" onClick={() => openModal("upgrade")} className="mt-3 flex h-8 w-full items-center justify-center gap-1.5 rounded-lg bg-brand text-[12.5px] font-medium text-white transition-[filter,transform] hover:brightness-105 active:scale-[0.98]">
        <Sparkles className="size-3.5" /> {t("app.upgrade")}
      </button>
    </div>
  );
}

function UserRow({ mini }: { mini: boolean }) {
  const [open, setOpen] = useState(false);
  const p = usePrefs();
  const { theme, toggle } = useTheme();
  const t = useT();
  const { user } = useUser();
  const name = user?.name || (p.name && p.name !== "Qonaq" ? p.name : t("app.guest"));
  return (
    <div className="relative">
            <button type="button" onClick={() => setOpen((o) => !o)} aria-haspopup="menu" aria-expanded={open} className={cn("flex w-full items-center gap-2.5 rounded-xl p-1.5 text-left transition-colors hover:bg-ink-100/[0.05]", mini && "justify-center")}>
        <Avatar name={name} src={user?.avatar} size={30} />
        {!mini && (
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13.5px] font-medium text-ink-100">{name}</span>
            <span className="block truncate text-[11.5px] text-ink-500">{user?.email || p.email || t("app.guestMode")}</span>
          </span>
        )}
        {!mini && <Settings className="size-4 text-ink-500" />}
      </button>
      <div className="absolute bottom-full left-0 mb-2 w-[232px]">
        <Menu open={open} onClose={() => setOpen(false)} align="start" className="!top-auto bottom-0 !mt-0">
          <MenuItem icon={<Settings />} onClick={() => (setOpen(false), openModal("settings"))}>
            {t("app.settings")}
          </MenuItem>
          <MenuItem icon={theme === "dark" ? <Sun /> : <Moon />} onClick={toggle} hint={theme === "dark" ? "Gecə" : "Gündüz"}>
            {t("app.theme")}
          </MenuItem>
          <MenuItem icon={<Sparkles />} onClick={() => (setOpen(false), openModal("upgrade"))}>
            {t("app.upgradePlan")}
          </MenuItem>
          <MenuSeparator />
          <MenuItem icon={<Shield />} onClick={() => (window.location.href = "/admin")}>
            {t("app.admin")}
          </MenuItem>
          {user ? (
            <MenuItem icon={<LogOut />} onClick={() => (setOpen(false), signOut())}>
              {t("auth.logout")}
            </MenuItem>
          ) : (
            <MenuItem icon={<LogOut />} onClick={() => (window.location.href = "/giris")}>
              {t("nav.login")}
            </MenuItem>
          )}
        </Menu>
      </div>
    </div>
  );
}
