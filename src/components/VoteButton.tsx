"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export default function VoteButton({
  slug,
  count,
  signedIn,
  voted,
}: {
  slug: string;
  count: number;
  signedIn: boolean;
  voted: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onVote() {
    if (!signedIn) {
      router.push("/signin");
      return;
    }
    startTransition(async () => {
      setError(null);
      const res = await fetch(`/api/products/${slug}/vote`, { method: "POST" });
      if (!res.ok) {
        setError("Vote failed");
        return;
      }
      router.refresh();
    });
  }

  return (
    <button
      onClick={onVote}
      disabled={pending}
      title={error ?? (voted ? "Remove vote" : "Vote")}
      className={`flex w-14 flex-col items-center rounded-md border px-2 py-1.5 text-sm transition ${
        voted
          ? "border-black bg-black text-white"
          : "border-neutral-300 bg-white hover:border-black"
      }`}
    >
      <span aria-hidden>▲</span>
      <span className="font-semibold">{count}</span>
    </button>
  );
}
