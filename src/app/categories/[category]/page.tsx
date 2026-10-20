import { listProducts, getVoterState } from "@/lib/data";
import { rankProducts } from "@/lib/ranking";
import ProductRow from "@/components/ProductRow";

export const dynamic = "force-dynamic";

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const decoded = decodeURIComponent(category);
  const products = rankProducts((await listProducts()).filter((p) => p.category === decoded));
  const { userId, votedIds } = await getVoterState(products.map((p) => p.id));
  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold tracking-tight">Category: {decoded}</h1>
      {products.length === 0 ? (
        <p className="rounded-lg border border-dashed border-neutral-300 bg-white p-8 text-center text-neutral-500">
          Nothing in this category yet.
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
