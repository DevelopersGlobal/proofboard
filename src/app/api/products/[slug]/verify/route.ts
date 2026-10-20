import { NextResponse } from "next/server";
import { createSessionClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { checkDomain } from "@/lib/verification";

// On-demand check, run by the listing owner from the product page.
export async function POST(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const session = await createSessionClient();
  const { data: { user } } = await session.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  const { slug } = await params;
  const supabase = createServiceClient();
  const { data: product } = await supabase.from("products").select("*").eq("slug", slug).maybeSingle();
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (product.user_id !== user.id) return NextResponse.json({ error: "Only the listing owner can run the check" }, { status: 403 });

  const result = await checkDomain(product.domain, product.verification_token);
  await supabase
    .from("products")
    .update({
      verified_at: result.ok ? product.verified_at ?? result.checkedAt : null,
      badge_live: result.badge,
      badge_last_checked: result.checkedAt,
    })
    .eq("id", product.id);

  return NextResponse.json(result, { status: result.ok ? 200 : 422 });
}
