"use client";

import { useState } from "react";

type Plan = "FREE" | "PRO" | "AGENCY";

export function BillingActions({ currentPlan }: { currentPlan: Plan }) {
  const [loading, setLoading] = useState<Plan | "PORTAL" | "">("");
  const [message, setMessage] = useState("");

  async function startCheckout(plan: Exclude<Plan, "FREE">) {
    setLoading(plan);
    setMessage("");

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan })
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Checkout failed.");
      }

      if (payload.url) {
        window.location.href = payload.url;
        return;
      }

      setMessage(payload.message || "Checkout session created.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Checkout failed.");
    } finally {
      setLoading("");
    }
  }

  async function openPortal() {
    setLoading("PORTAL");
    setMessage("");

    try {
      const response = await fetch("/api/stripe/portal", { method: "POST" });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Portal failed.");
      }

      if (payload.url) {
        window.location.href = payload.url;
        return;
      }

      setMessage(payload.message || "Customer portal opened.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Portal failed.");
    } finally {
      setLoading("");
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="section-kicker">Actions</p>
        <h2 className="mt-2 font-display text-2xl font-bold">Manage your subscription</h2>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => startCheckout("PRO")}
          className="btn-primary"
          disabled={loading !== ""}
        >
          {loading === "PRO" ? "Starting..." : currentPlan === "PRO" ? "Current Pro plan" : "Upgrade to Pro"}
        </button>
        <button
          type="button"
          onClick={() => startCheckout("AGENCY")}
          className="btn-secondary"
          disabled={loading !== ""}
        >
          {loading === "AGENCY" ? "Starting..." : currentPlan === "AGENCY" ? "Current Agency plan" : "Upgrade to Agency"}
        </button>
        <button type="button" onClick={openPortal} className="btn-secondary" disabled={loading !== ""}>
          {loading === "PORTAL" ? "Opening..." : "Customer portal"}
        </button>
      </div>

      {message ? <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">{message}</div> : null}
    </div>
  );
}
