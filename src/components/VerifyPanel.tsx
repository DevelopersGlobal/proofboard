"use client";

import { useState, useTransition } from "react";

export default function VerifyPanel({
  slug,
  token,
  domain,
  siteUrl,
}: {
  slug: string;
  token: string;
  domain: string;
  siteUrl: string;
}) {
  const [result, setResult] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const snippet = `<a href="${siteUrl}/product/${slug}" data-truetop-token="${token}">Verified on TrueTop</a>`;

  function runCheck() {
    startTransition(async () => {
      const res = await fetch(`/api/products/${slug}/verify`, { method: "POST" });
      const body = await res.json().catch(() => ({}));
      setResult(
        res.ok && body.ok
          ? `Verified - ${body.detail}.`
          : `Not found yet - ${body.detail ?? "the token is not visible on your domain"}. Place it and run the check again.`
      );
    });
  }

  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm">
      <h2 className="font-semibold">Verify this listing</h2>
      <p className="mt-1 text-neutral-700">
        Prove control of <span className="font-mono">{domain}</span> with either method, then run the check.
        The proof is re-checked on a rolling cycle; if it disappears, the verified mark drops at the next check.
      </p>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-neutral-700">
        <li>
          Serve a file at <span className="font-mono">https://{domain}/.well-known/truetop.txt</span> containing:
          <code className="mt-1 block break-all rounded bg-white p-2 font-mono text-xs">{token}</code>
        </li>
        <li>
          Or place this badge in your homepage HTML:
          <code className="mt-1 block break-all rounded bg-white p-2 font-mono text-xs">{snippet}</code>
        </li>
      </ol>
      <button
        onClick={runCheck}
        disabled={pending}
        className="mt-3 rounded-md bg-black px-3 py-1.5 font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
      >
        {pending ? "Checking..." : "Run the check now"}
      </button>
      {result && <p className="mt-2 text-neutral-700">{result}</p>}
    </div>
  );
}
