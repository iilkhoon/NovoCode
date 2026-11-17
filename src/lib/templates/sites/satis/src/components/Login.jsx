import { useState } from "react";
import { BarChart3, Loader2 } from "lucide-react";
import { signIn, signUp } from "@/lib/auth";

export default function Login() {
  const [mode, setMode] = useState("signup");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      if (mode === "signup") await signUp(data);
      else await signIn(data);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  const field = "w-full rounded-lg border border-border bg-card px-3.5 py-2.5 text-sm outline-none transition-shadow focus:border-primary focus:ring-4 focus:ring-primary/15";

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center px-5 py-16">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2 text-lg font-bold"><span className="grid size-8 place-items-center rounded-lg bg-primary text-white"><BarChart3 className="size-4" /></span> satış</div>
          <h1 className="mt-10 text-3xl font-bold tracking-tight">{mode === "signup" ? "Hesab yaradın" : "Xoş gördük"}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{mode === "signup" ? "Komandanızın satışlarını bir yerdə izləyin." : "Davam etmək üçün daxil olun."}</p>
          <form onSubmit={submit} className="mt-8 grid gap-4">
            {mode === "signup" && <label className="grid gap-1.5 text-sm font-medium">Ad<input required name="name" autoComplete="name" placeholder="Rəşad" className={field} /></label>}
            <label className="grid gap-1.5 text-sm font-medium">E-poçt<input required name="email" type="email" autoComplete="email" placeholder="ad@şirkət.az" className={field} /></label>
            <label className="grid gap-1.5 text-sm font-medium">Şifrə<input required name="password" type="password" minLength={6} autoComplete={mode === "signup" ? "new-password" : "current-password"} placeholder="Ən azı 6 simvol" className={field} /></label>
            {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
            <button disabled={busy} className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-foreground py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60">
              {busy && <Loader2 className="size-4 animate-spin" />}{mode === "signup" ? "Qeydiyyatdan keç" : "Daxil ol"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "signup" ? "Hesabınız var?" : "Hesabınız yoxdur?"}{" "}
            <button onClick={() => (setMode(mode === "signup" ? "signin" : "signup"), setError(""))} className="font-semibold text-foreground hover:underline">{mode === "signup" ? "Daxil olun" : "Qeydiyyat"}</button>
          </p>
        </div>
      </div>
      <div className="hidden flex-col justify-end bg-foreground p-14 text-white lg:flex">
        <p className="max-w-md text-3xl font-semibold leading-snug tracking-tight">“Satış CRM-ə keçəndən sonra heç bir müştəri unudulmur. Aylıq satışımız 30% artdı.”</p>
        <p className="mt-6 text-sm text-white/60">Kənan Əliyev · Nur Market MMC</p>
      </div>
    </div>
  );
}
