import { getProduct } from "@/lib/data";
import { BADGE_BONUS, scoreOf } from "@/lib/ranking";

export const dynamic = "force-dynamic";

// Plain-markdown twin of the product page, for answer engines and agents.
export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return new Response("Not found", { status: 404 });
  const lines = [
    `# ${product.name}`,
    "",
    product.tagline,
    "",
    `- URL: ${product.url}`,
    `- Category: ${product.category}`,
    product.tags.length ? `- Tags: ${product.tags.join(", ")}` : null,
    product.platforms.length ? `- Platforms: ${product.platforms.join(", ")}` : null,
    `- Domain control: ${product.verified_at ? "verified (proof served from the product's own domain)" : "unverified"}`,
    `- Proof last checked: ${product.badge_last_checked ?? "never"}`,
    `- Live badge bonus: ${product.badge_live ? `+${BADGE_BONUS}` : "0"}`,
    `- Votes: ${product.vote_count}`,
    `- Score: ${scoreOf(product)}`,
    `- Launched: ${product.created_at}`,
    "",
    "Verification proves only that whoever controls the domain stood behind this listing on the date shown. It says nothing about whether the product is good or worth your money.",
  ].filter((l): l is string => l !== null);
  return new Response(lines.join("\n"), { headers: { "content-type": "text/markdown; charset=utf-8" } });
}
