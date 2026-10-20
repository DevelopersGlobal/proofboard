import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, getVoterState } from "@/lib/data";
import { BADGE_BONUS, scoreOf } from "@/lib/ranking";
import VoteButton from "@/components/VoteButton";
import VerifyPanel from "@/components/VerifyPanel";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();
  const { userId, votedIds } = await getVoterState([product.id]);
  const isOwner = userId === product.user_id;
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://truetop.vercel.app").replace(/\/+$/, "");
  const verified = Boolean(product.verified_at);

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        {product.logo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.logo_url} alt="" className="h-16 w-16 rounded-lg object-cover" />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-neutral-100 text-2xl font-bold text-neutral-500">
            {product.name.slice(0, 1).toUpperCase()}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">{product.name}</h1>
            {verified ? (
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">Verified</span>
            ) : (
              <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-500">Unverified</span>
            )}
          </div>
          <p className="mt-1 text-neutral-600">{product.tagline}</p>
          <p className="mt-1 text-sm text-neutral-400">
            <Link href={`/categories/${encodeURIComponent(product.category)}`} className="hover:underline">{product.category}</Link>
            {product.tags.length > 0 ? ` · ${product.tags.join(", ")}` : ""}
          </p>
        </div>
        <VoteButton slug={product.slug} count={product.vote_count} signedIn={Boolean(userId)} voted={votedIds.has(product.id)} />
      </div>

      <div className="rounded-lg border border-neutral-200 bg-white p-4 text-sm">
        <h2 className="font-semibold">Ranking inputs</h2>
        <dl className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1 text-neutral-600 sm:grid-cols-3">
          <div><dt className="text-xs text-neutral-400">Votes</dt><dd>{product.vote_count}</dd></div>
          <div><dt className="text-xs text-neutral-400">Badge bonus</dt><dd>{product.badge_live ? `+${BADGE_BONUS}` : "0"}</dd></div>
          <div><dt className="text-xs text-neutral-400">Score</dt><dd>{scoreOf(product)}</dd></div>
          <div><dt className="text-xs text-neutral-400">Evidence band</dt><dd>{verified ? "Verified" : "Unverified"}</dd></div>
          <div>
            <dt className="text-xs text-neutral-400">Proof last checked</dt>
            <dd>{product.badge_last_checked ? new Date(product.badge_last_checked).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "never"}</dd>
          </div>
          <div>
            <dt className="text-xs text-neutral-400">Launched</dt>
            <dd>{new Date(product.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</dd>
          </div>
        </dl>
        <p className="mt-3 text-xs text-neutral-400">
          Verified products rank in a band above unverified ones; votes and the badge bonus
          order products within each band. The proof is re-checked on a rolling cycle and the
          mark drops if it disappears.
        </p>
      </div>

      <a
        href={product.url}
        rel={verified ? "dofollow" : "ugc nofollow"}
        className="inline-block rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
      >
        Visit {product.domain}
      </a>

      {isOwner && !verified && (
        <VerifyPanel slug={product.slug} token={product.verification_token} domain={product.domain} siteUrl={siteUrl} />
      )}
      {isOwner && verified && (
        <p className="text-sm text-neutral-500">
          You own this listing. Keep the proof on {product.domain} - the mark drops at the next re-check if it disappears.
        </p>
      )}
    </div>
  );
}
