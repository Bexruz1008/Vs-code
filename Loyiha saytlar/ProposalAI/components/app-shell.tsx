import type { ReactNode } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { SignOutButton } from "@/components/sign-out-button";
import { canAccessAdmin } from "@/lib/permissions";
import { type Session } from "next-auth";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/proposals", label: "Proposals" },
  { href: "/proposals/new", label: "New Proposal" },
  { href: "/billing", label: "Billing" }
];

export function AppShell({ children, session }: { children: ReactNode; session: Session }) {
  return (
    <div className="min-h-screen bg-ink-950 text-white">
      <div className="border-b border-white/10 bg-ink-950/80 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/dashboard" className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-fuchsia-500 text-lg font-bold text-white shadow-glow">
              P
            </span>
            <div>
              <p className="font-display text-lg font-bold tracking-tight">ProposalAI</p>
              <p className="text-xs text-slate-400">{session.user.email}</p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <SignOutButton />
          </div>
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[260px_1fr] lg:px-8">
        <aside className="rounded-3xl border border-white/10 bg-white/5 p-4">
          <div className="space-y-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-2xl px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/10"
              >
                {link.label}
              </Link>
            ))}
            {canAccessAdmin(session.user.role) ? (
              <Link href="/admin" className="block rounded-2xl px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/10">
                Admin
              </Link>
            ) : null}
          </div>

          <div className="mt-6 rounded-3xl border border-white/10 bg-ink-900/70 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Current plan</p>
            <p className="mt-2 font-display text-2xl font-bold">Workspace</p>
            <p className="mt-2 text-sm text-slate-300">Premium proposal creation, exports, and team controls.</p>
          </div>
        </aside>

        <section>{children}</section>
      </div>
    </div>
  );
}
