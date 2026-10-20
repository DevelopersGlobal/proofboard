"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

const CATEGORIES = ["ai", "saas", "devtool", "marketing", "productivity", "design", "education", "health", "other"];
const PLATFORMS = ["Web", "iOS", "Android", "macOS", "Windows", "CLI"];

export default function SubmitForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [platforms, setPlatforms] = useState<string[]>([]);

  function togglePlatform(p: string) {
    setPlatforms((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));
  }

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    startTransition(async () => {
      setError(null);
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          url: form.get("url"),
          tagline: form.get("tagline"),
          category: form.get("category"),
          tags: String(form.get("tags") ?? "").split(",").map((t) => t.trim()).filter(Boolean),
          logo_url: form.get("logo_url") || null,
          platforms,
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(body.error ?? "Submission failed");
        return;
      }
      router.push(`/product/${body.slug}`);
    });
  }

  const input = "mt-1 w-full rounded-md border border-neutral-300 px-3 py-2";

  return (
    <form onSubmit={submit} className="space-y-4">
      <label className="block text-sm">
        <span className="text-neutral-600">Product name</span>
        <input name="name" required maxLength={60} className={input} />
      </label>
      <label className="block text-sm">
        <span className="text-neutral-600">URL</span>
        <input name="url" type="url" required className={input} placeholder="https://yourproduct.com" />
      </label>
      <label className="block text-sm">
        <span className="text-neutral-600">Tagline</span>
        <input name="tagline" required maxLength={120} className={input} />
      </label>
      <label className="block text-sm">
        <span className="text-neutral-600">Category</span>
        <select name="category" className={input} defaultValue="other">
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </label>
      <label className="block text-sm">
        <span className="text-neutral-600">Tags (comma separated)</span>
        <input name="tags" className={input} placeholder="ai, cli, open-source" />
      </label>
      <label className="block text-sm">
        <span className="text-neutral-600">Logo URL (optional)</span>
        <input name="logo_url" type="url" className={input} />
      </label>
      <fieldset className="text-sm">
        <legend className="text-neutral-600">Platforms</legend>
        <div className="mt-1 flex flex-wrap gap-2">
          {PLATFORMS.map((p) => (
            <button
              type="button"
              key={p}
              onClick={() => togglePlatform(p)}
              className={`rounded-full border px-3 py-1 text-xs ${platforms.includes(p) ? "border-black bg-black text-white" : "border-neutral-300"}`}
            >
              {p}
            </button>
          ))}
        </div>
      </fieldset>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
      >
        {pending ? "Launching..." : "Launch"}
      </button>
      <p className="text-xs text-neutral-400">
        Your listing goes live immediately as unverified. Verify your domain afterwards from the product page to enter the verified band.
      </p>
    </form>
  );
}
