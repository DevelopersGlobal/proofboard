import { createServiceClient } from "@/lib/supabase/service";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const metadata = { title: "Certified sites" };

export default async function CertifiedPage() {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("products")
    .select("slug, name, tagline, domain, badge_last_checked")
    .eq("badge_live", true)
    .order("badge_last_checked", { ascending: false });
  const sites = data ?? [];
  const distinct = new Set(sites.map((s) => s.domain)).size;
  const lastCheck = sites[0]?.badge_last_checked ?? null;

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Certified sites</h1>
      <p className="mt-2 max-w-2xl text-sm text-neutral-600">
        These domains serve the ProofBoard badge from their own site. The badge is re-fetched on a
        rolling cycle; if it comes down, the listing drops off this page and loses its bonus at the
        next check. Everything here was verified as of the date shown.
      </p>
      <div className="mt-6 grid grid-cols-3 gap-4 text-center">
        <div className="rounded-lg border border-neutral-200 bg-white p-4">
          <div className="text-2xl font-bold">{sites.length}</div>
          <div className="text-xs text-neutral-500">Certified sites</div>
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white p-4">
          <div className="text-2xl font-bold">{distinct}</div>
          <div className="text-xs text-neutral-500">Distinct domains</div>
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white p-4">
          <div className="text-2xl font-bold">{lastCheck ? new Date(lastCheck).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "-"}</div>
          <div className="text-xs text-neutral-500">Last check</div>
        </div>
      </div>
      <ul className="mt-6 divide-y divide-neutral-200 rounded-lg border border-neutral-200 bg-white">
        {sites.map((s) => (
          <li key={s.slug} className="flex items-center justify-between gap-4 p-4">
            <div className="min-w-0">
              <Link href={`/product/${s.slug}`} className="font-semibold hover:underline">{s.name}</Link>
              <p className="truncate text-sm text-neutral-600">{s.tagline}</p>
            </div>
            <div className="shrink-0 text-right text-xs text-neutral-500">
              <div className="font-mono">{s.domain}</div>
              <div>checked {s.badge_last_checked ? new Date(s.badge_last_checked).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "-"}</div>
            </div>
          </li>
        ))}
        {sites.length === 0 && (
          <li className="p-8 text-center text-sm text-neutral-500">No live badges right now.</li>
        )}
      </ul>
    </div>
  );
}
