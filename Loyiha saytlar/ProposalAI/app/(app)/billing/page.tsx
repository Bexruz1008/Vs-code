import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { monthKey } from "@/lib/utils";
import { BillingActions } from "@/components/billing-actions";

export default async function BillingPage() {
  const session = await requireSession();
  const subscription = await prisma.subscription.findFirst({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" }
  });

  const usage = await prisma.usageRecord.findUnique({
    where: {
      userId_month: {
        userId: session.user.id,
        month: monthKey()
      }
    }
  });

  const plan = subscription?.plan ?? "FREE";

  return (
    <div className="space-y-6">
      <section className="surface p-6">
        <p className="section-kicker">Billing</p>
        <h1 className="section-title mt-2">Subscription and usage</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
          Manage your Free, Pro, or Agency plan. Stripe checkout and portal routes are wired in the API layer.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Plan", value: plan },
          { label: "Proposals this month", value: usage?.proposalCount ?? 0 },
          { label: "Exports this month", value: usage?.exportCount ?? 0 }
        ].map((item) => (
          <article key={item.label} className="surface p-5">
            <p className="text-sm text-slate-400">{item.label}</p>
            <p className="mt-2 font-display text-3xl font-bold">{item.value}</p>
          </article>
        ))}
      </section>

      <section className="surface p-6">
        <BillingActions currentPlan={plan} />
      </section>
    </div>
  );
}
