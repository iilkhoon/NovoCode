import "server-only";
import { timingSafeEqual } from "node:crypto";
import { HttpError, rateLimit } from "./guard";

/** Admin routes: the NOVO_ADMIN_PASSWORD must come in the x-novo-admin header. */
export function authorizeAdmin(req: Request) {
  rateLimit(req, "admin", 60, 10 * 60_000);
  const pass = process.env.NOVO_ADMIN_PASSWORD;
  if (!pass) throw new HttpError(503, "Admin panel bağlıdır: serverdə NOVO_ADMIN_PASSWORD təyin edin.");
  const given = Buffer.from(req.headers.get("x-novo-admin") ?? "");
  const want = Buffer.from(pass);
  if (given.length !== want.length || !timingSafeEqual(given, want)) throw new HttpError(401, "Şifrə yanlışdır");
}
