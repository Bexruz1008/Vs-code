"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/sign-in" })}
      className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/10"
    >
      Sign out
    </button>
  );
}
