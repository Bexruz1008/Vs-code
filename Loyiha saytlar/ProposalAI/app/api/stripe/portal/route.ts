import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/session";
import { getStripe } from "@/lib/stripe";

export async function POST() {
  const session = await getCurrentSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({
      message: "Stripe is not configured yet. Set STRIPE_SECRET_KEY to enable the customer portal."
    });
  }

  const origin = process.env.APP_URL || "http://localhost:3000";
  const customer = await stripe.customers.list({
    email: session.user.email ?? undefined,
    limit: 1
  });

  if (!customer.data.length) {
    return NextResponse.json({ error: "No Stripe customer found for this account." }, { status: 404 });
  }

  const portal = await stripe.billingPortal.sessions.create({
    customer: customer.data[0].id,
    return_url: `${origin}/billing`
  });

  return NextResponse.json({ url: portal.url });
}
