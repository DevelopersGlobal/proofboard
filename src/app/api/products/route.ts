import { NextResponse } from "next/server";
import { createSessionClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { randomBytes } from "crypto";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "product";
}

export async function POST(request: Request) {
  const session = await createSessionClient();
  const { data: { user } } = await session.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const url = String(body.url ?? "").trim();
  const tagline = String(body.tagline ?? "").trim();
  const category = String(body.category ?? "other").trim().toLowerCase();
  const tags = Array.isArray(body.tags) ? body.tags.map(String).slice(0, 8) : [];
  const platforms = Array.isArray(body.platforms) ? body.platforms.map(String).slice(0, 6) : [];
  const logoUrl = body.logo_url ? String(body.logo_url) : null;

  if (!name || !url || !tagline) {
    return NextResponse.json({ error: "Name, URL and tagline are required" }, { status: 400 });
  }

  let domain: string;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") throw new Error("bad protocol");
    domain = parsed.hostname.toLowerCase();
  } catch {
    return NextResponse.json({ error: "URL must be a valid http(s) address" }, { status: 400 });
  }

  const supabase = createServiceClient();
  const base = slugify(name);
  let slug = base;
  for (let i = 2; ; i++) {
    const { data } = await supabase.from("products").select("id").eq("slug", slug).maybeSingle();
    if (!data) break;
    slug = `${base}-${i}`;
  }

  const { error } = await supabase.from("products").insert({
    user_id: user.id,
    slug,
    name,
    url,
    domain,
    tagline,
    category,
    tags,
    platforms,
    logo_url: logoUrl,
    verification_token: randomBytes(16).toString("hex"),
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ slug });
}
