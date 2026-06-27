import type { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "@/components/auth-form";

export const metadata: Metadata = {
  title: "Sign up",
  description: "Create a ProposalAI account to start generating proposals."
};

export default function SignUpPage() {
  return (
    <div className="surface p-8">
      <p className="section-kicker">Sign up</p>
      <h1 className="section-title mt-2">Create your ProposalAI account</h1>
      <p className="mt-4 text-sm leading-7 text-slate-300">Create a workspace and start generating proposals immediately.</p>
      <div className="mt-6">
        <AuthForm mode="signup" />
      </div>
      <p className="mt-6 text-sm text-slate-400">
        Already have an account?{" "}
        <Link href="/sign-in" className="font-semibold text-brand-500">
          Sign in
        </Link>
      </p>
    </div>
  );
}
