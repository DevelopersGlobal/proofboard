import Link from "next/link";
import { createSessionClient } from "@/lib/supabase/server";

export default async function Header() {
  const supabase = await createSessionClient();
  const { data: { user } } = await supabase.auth.getUser();
  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-bold tracking-tight">
          ProofBoard
        </Link>
        <nav className="flex items-center gap-4 text-sm text-neutral-600">
          <Link href="/leaderboard" className="hover:text-black">Leaderboard</Link>
          <Link href="/certified" className="hover:text-black">Certified</Link>
          <Link href="/about" className="hover:text-black">About</Link>
          <Link href="/submit" className="rounded-md bg-black px-3 py-1.5 font-medium text-white hover:bg-neutral-800">
            New launch
          </Link>
          {user ? (
            <form action="/signout" method="post">
              <button className="hover:text-black">Sign out</button>
            </form>
          ) : (
            <Link href="/signin" className="hover:text-black">Sign in</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
