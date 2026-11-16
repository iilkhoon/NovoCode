"use client";
import { createClient, type Session, type SupabaseClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

/**
 * Accounts and cloud sync via Supabase. Everything is optional: without
 * NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY the app runs in guest mode
 * (projects in this browser only) and the login buttons explain that.
 */
const URL_ = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let client: SupabaseClient | null = null;
export function supabase(): SupabaseClient | null {
  if (!URL_ || !KEY || typeof window === "undefined") return null;
  client ??= createClient(URL_, KEY, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } });
  return client;
}
export const authEnabled = () => !!(URL_ && KEY);

export interface NovoUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

function toUser(s: Session | null): NovoUser | null {
  const u = s?.user;
  if (!u) return null;
  const m = u.user_metadata ?? {};
  return { id: u.id, email: u.email ?? "", name: m.full_name || m.name || m.user_name || (u.email ?? "").split("@")[0], avatar: m.avatar_url || m.picture };
}

/** Current signed-in user (null for guests). */
export function useUser(): { user: NovoUser | null; ready: boolean } {
  const [state, setState] = useState<{ user: NovoUser | null; ready: boolean }>({ user: null, ready: !authEnabled() });
  useEffect(() => {
    const sb = supabase();
    if (!sb) return;
    sb.auth.getSession().then(({ data }) => setState({ user: toUser(data.session), ready: true }));
    const { data } = sb.auth.onAuthStateChange((_e, s) => setState({ user: toUser(s), ready: true }));
    return () => data.subscription.unsubscribe();
  }, []);
  return state;
}

export async function signInWith(provider: "google" | "github") {
  const sb = supabase();
  if (!sb) throw new Error("auth-disabled");
  const { error } = await sb.auth.signInWithOAuth({ provider, options: { redirectTo: `${location.origin}/app` } });
  if (error) throw error;
}

export async function sendMagicLink(email: string) {
  const sb = supabase();
  if (!sb) throw new Error("auth-disabled");
  const { error } = await sb.auth.signInWithOtp({ email, options: { emailRedirectTo: `${location.origin}/app` } });
  if (error) throw error;
}

export async function signOut() {
  await supabase()?.auth.signOut();
}
