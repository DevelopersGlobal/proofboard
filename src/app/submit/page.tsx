import { createSessionClient } from "@/lib/supabase/server";
import SubmitForm from "@/components/SubmitForm";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const metadata = { title: "New launch" };

export default async function SubmitPage() {
  const supabase = await createSessionClient();
  const { data: { user } } = await supabase.auth.getUser();
  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-6 text-2xl font-bold tracking-tight">New launch</h1>
      {user ? (
        <SubmitForm />
      ) : (
        <p className="rounded-lg border border-neutral-200 bg-white p-4 text-sm text-neutral-600">
          You need to <Link href="/signin" className="font-medium underline">sign in</Link> to launch a product.
        </p>
      )}
    </div>
  );
}
