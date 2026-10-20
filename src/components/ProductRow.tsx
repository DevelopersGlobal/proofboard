import Link from "next/link";
import { BADGE_BONUS, scoreOf } from "@/lib/ranking";
import type { Product } from "@/lib/data";
import VoteButton from "./VoteButton";

export default function ProductRow({
  product,
  rank,
  signedIn,
  voted,
}: {
  product: Product;
  rank: number;
  signedIn: boolean;
  voted: boolean;
}) {
  const verified = Boolean(product.verified_at);
  return (
    <li className="flex items-center gap-4 rounded-lg border border-neutral-200 bg-white p-4">
      <span className="w-8 text-center font-mono text-lg text-neutral-400">#{rank}</span>
      {product.logo_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={product.logo_url} alt="" className="h-10 w-10 rounded-md object-cover" />
      ) : (
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-neutral-100 font-bold text-neutral-500">
          {product.name.slice(0, 1).toUpperCase()}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <Link href={`/product/${product.slug}`} className="truncate font-semibold hover:underline">
            {product.name}
          </Link>
          {verified ? (
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">Verified</span>
          ) : (
            <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-500">Unverified</span>
          )}
          {product.platforms.map((p) => (
            <span key={p} className="rounded-full border border-neutral-200 px-2 py-0.5 text-xs text-neutral-500">{p}</span>
          ))}
        </div>
        <p className="truncate text-sm text-neutral-600">{product.tagline}</p>
        <p className="text-xs text-neutral-400">
          {product.category} · score {scoreOf(product)}
          {product.badge_live ? ` (includes +${BADGE_BONUS} live badge)` : ""}
          {product.badge_last_checked
            ? ` · proof checked ${new Date(product.badge_last_checked).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
            : ""}
        </p>
      </div>
      <VoteButton slug={product.slug} count={product.vote_count} signedIn={signedIn} voted={voted} />
    </li>
  );
}
