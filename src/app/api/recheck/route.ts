import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { checkDomain } from "@/lib/verification";

// Rolling re-check of every listing that carries proof. Called daily by the
// scheduler in vercel.json. A proof that has disappeared stops counting here.
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const supabase = createServiceClient();
  const { data: products } = await supabase
    .from("products")
    .select("id, domain, verification_token, verified_at")
    .not("verified_at", "is", null);

  const results: { id: string; ok: boolean; badge: boolean }[] = [];
  for (const p of products ?? []) {
    const result = await checkDomain(p.domain, p.verification_token);
    await supabase
      .from("products")
      .update({
        verified_at: result.ok ? p.verified_at : null,
        badge_live: result.badge,
        badge_last_checked: result.checkedAt,
      })
      .eq("id", p.id);
    results.push({ id: p.id, ok: result.ok, badge: result.badge });
  }

  return NextResponse.json({ checked: results.length, results });
}
