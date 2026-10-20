import { listProducts, getVoterState } from "@/lib/data";
import { rankProducts } from "@/lib/ranking";
import ProductRow from "@/components/ProductRow";

export const dynamic = "force-dynamic";
export const metadata = { title: "All-time leaderboard" };

export default async function LeaderboardPage() {
  const products = rankProducts(await listProducts());
  const { userId, votedIds } = await getVoterState(products.map((p) => p.id));
  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold tracking-tight">All-time leaderboard</h1>
      <p className="mb-8 max-w-2xl text-sm text-neutral-600">
        Every launch, ranked on evidence rather than launch-day votes. Verified band first,
        then score: votes plus a live-badge bonus. Proofs are re-checked, and a proof that
        disappears stops counting.
      </p>
      {products.length === 0 ? (
        <p className="rounded-lg border border-dashed border-neutral-300 bg-white p-8 text-center text-neutral-500">
          Nothing on the board yet.
        </p>
      ) : (
        <ol className="space-y-3">
          {products.map((p, i) => (
            <ProductRow key={p.id} product={p} rank={i + 1} signedIn={Boolean(userId)} voted={votedIds.has(p.id)} />
          ))}
        </ol>
      )}
    </div>
  );
}
