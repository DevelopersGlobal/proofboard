import { NextResponse } from "next/server";
import { createSessionClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

// Toggle: one vote per signed-in user per product. A second call removes it.
export async function POST(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const session = await createSessionClient();
  const { data: { user } } = await session.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  const { slug } = await params;
  const supabase = createServiceClient();
  const { data: product } = await supabase.from("products").select("id").eq("slug", slug).maybeSingle();
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { data: existing } = await supabase
    .from("votes")
    .select("id")
    .eq("product_id", product.id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    await supabase.from("votes").delete().eq("id", existing.id);
    return NextResponse.json({ voted: false });
  }
  const { error } = await supabase.from("votes").insert({ product_id: product.id, user_id: user.id });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ voted: true });
}
