import { NextResponse } from "next/server";
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { assertSameOrigin, errorResponse, HttpError, readJson } from "@/lib/api/guard";
import { authorizeAdmin } from "@/lib/api/admin-auth";
import { allSkills, CUSTOM_DIR, DISABLED_FILE, invalidateSkills } from "@/lib/skills/load";
import { parseSkill } from "@/lib/skills/select";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const list = () => allSkills(true).map(({ name, description, triggers, always, source, enabled, body }) => ({ name, description, triggers, always, source, enabled, size: body.length }));

export async function GET(req: Request) {
  try {
    authorizeAdmin(req);
    return NextResponse.json({ skills: list() });
  } catch (e) {
    return errorResponse(e);
  }
}

/** POST { content } — upload a skill (markdown with name/description/triggers frontmatter). */
export async function POST(req: Request) {
  try {
    assertSameOrigin(req);
    authorizeAdmin(req);
    const { content } = await readJson<{ content?: string }>(req, 64 * 1024);
    if (!content || typeof content !== "string") throw new HttpError(400, "Fayl boşdur");
    const s = parseSkill(content);
    if (!/^[a-z0-9][a-z0-9-]{1,40}$/.test(s.name)) throw new HttpError(400, "Frontmatter-də `name:` kiçik hərf, rəqəm və “-” olmalıdır");
    if (!s.body.trim()) throw new HttpError(400, "Skill-in təlimat hissəsi boşdur");
    if (allSkills(true).some((x) => x.name === s.name && x.source === "builtin")) throw new HttpError(409, "Bu ad daxili skill-ə məxsusdur");
    await mkdir(CUSTOM_DIR, { recursive: true });
    await writeFile(path.join(CUSTOM_DIR, `${s.name}.md`), content);
    invalidateSkills();
    return NextResponse.json({ skills: list() });
  } catch (e) {
    return errorResponse(e);
  }
}

/** PUT { disabled: string[] } — switch skills on/off. */
export async function PUT(req: Request) {
  try {
    assertSameOrigin(req);
    authorizeAdmin(req);
    const { disabled } = await readJson<{ disabled?: string[] }>(req, 16 * 1024);
    const names = new Set(allSkills(true).map((s) => s.name));
    const clean = (disabled ?? []).filter((n) => typeof n === "string" && names.has(n) && n !== "core");
    await mkdir(path.dirname(DISABLED_FILE), { recursive: true });
    await writeFile(DISABLED_FILE, JSON.stringify(clean));
    invalidateSkills();
    return NextResponse.json({ skills: list() });
  } catch (e) {
    return errorResponse(e);
  }
}

/** DELETE ?name= — remove an uploaded skill. */
export async function DELETE(req: Request) {
  try {
    assertSameOrigin(req);
    authorizeAdmin(req);
    const name = new URL(req.url).searchParams.get("name") ?? "";
    const s = allSkills(true).find((x) => x.name === name && x.source === "custom");
    if (!s) throw new HttpError(404, "Yüklənmiş skill tapılmadı");
    await rm(path.join(CUSTOM_DIR, s.file), { force: true });
    invalidateSkills();
    return NextResponse.json({ skills: list() });
  } catch (e) {
    return errorResponse(e);
  }
}
