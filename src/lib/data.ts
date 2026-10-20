import { createServiceClient } from "@/lib/supabase/service";
import { currentWeekWindow } from "@/lib/week";

export type Product = {
  id: string;
  user_id: string;
  slug: string;
  name: string;
  url: string;
  domain: string;
  tagline: string;
  category: string;
  tags: string[];
  platforms: string[];
  logo_url: string | null;
  verification_token: string;
  verified_at: string | null;
  badge_live: boolean;
  badge_last_checked: string | null;
  created_at: string;
  vote_count: number;
};

export async function listProducts(opts: { weekOnly?: boolean } = {}): Promise<Product[]> {
  const supabase = createServiceClient();
  let query = supabase.from("products").select("*").order("created_at", { ascending: true });
  if (opts.weekOnly) {
    const { start, end } = currentWeekWindow();
    query = query.gte("created_at", start.toISOString()).lt("created_at", end.toISOString());
  }
  const { data: products, error } = await query;
  if (error) throw new Error(error.message);

  const { data: votes, error: votesError } = await supabase.from("votes").select("product_id");
  if (votesError) throw new Error(votesError.message);
  const counts = new Map<string, number>();
  (votes ?? []).forEach((v) => counts.set(v.product_id, (counts.get(v.product_id) ?? 0) + 1));

  return (products ?? []).map((p) => ({ ...p, vote_count: counts.get(p.id) ?? 0 }));
}

export async function getProduct(slug: string): Promise<Product | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase.from("products").select("*").eq("slug", slug).maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;
  const { count } = await supabase
    .from("votes")
    .select("id", { count: "exact", head: true })
    .eq("product_id", data.id);
  return { ...data, vote_count: count ?? 0 };
}

export async function getVoterState(productIds: string[]): Promise<{ userId: string | null; votedIds: Set<string> }> {
  const { createSessionClient } = await import("@/lib/supabase/server");
  const session = await createSessionClient();
  const { data: { user } } = await session.auth.getUser();
  if (!user) return { userId: null, votedIds: new Set() };
  const supabase = createServiceClient();
  const { data } = await supabase.from("votes").select("product_id").eq("user_id", user.id).in("product_id", productIds);
  return { userId: user.id, votedIds: new Set((data ?? []).map((v) => v.product_id)) };
}
