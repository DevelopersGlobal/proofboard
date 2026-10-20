import { listProducts, getVoterState } from "@/lib/data";
import { rankProducts } from "@/lib/ranking";
import { currentWeekWindow } from "@/lib/week";
import ProductRow from "@/components/ProductRow";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = rankProducts(await listProducts({ weekOnly: true }));
  const { userId, votedIds } = await getVoterState(products.map((p) => p.id));
  const { start, end } = currentWeekWindow();
  const closes = new Date(end.getTime() - 1);

  return (
    <div>
      <section className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">This week&apos;s board</h1>
        <p className="mt-2 max-w-2xl text-sm text-neutral-600">
          Boards run Monday to Sunday. Verified products - the ones whose makers proved
          control of the domain behind the listing - rank in a band above unverified ones.
          Votes move a product within its band, never past it.
        </p>
        <p className="mt-1 text-xs text-neutral-400">
          Week of {start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - closes{" "}
          {closes.toLocaleDateString("en-US", { month: "short", day: "numeric" })} (UTC)
        </p>
      </section>
      {products.length === 0 ? (
        <p className="rounded-lg border border-dashed border-neutral-300 bg-white p-8 text-center text-neutral-500">
          No launches yet this week. Be the first to submit one.
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
