import SignInForm from "@/components/SignInForm";

export const metadata = { title: "Sign in" };

export default function SignInPage() {
  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Sign in</h1>
      <SignInForm />
    </div>
  );
}
