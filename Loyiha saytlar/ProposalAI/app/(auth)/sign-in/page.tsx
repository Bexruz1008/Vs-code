import type { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "@/components/auth-form";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to ProposalAI using email/password or Google."
};

export default function SignInPage() {
  return (
    <div className="surface p-8">
      <p className="section-kicker">Sign in</p>
      <h1 className="section-title mt-2">Welcome back</h1>
      <p className="mt-4 text-sm leading-7 text-slate-300">Use email/password or Google sign-in to access your workspace.</p>
      <div className="mt-6">
        <AuthForm mode="signin" />
      </div>
      <p className="mt-6 text-sm text-slate-400">
        New here?{" "}
        <Link href="/sign-up" className="font-semibold text-brand-500">
          Create an account
        </Link>
      </p>
    </div>
  );
}
