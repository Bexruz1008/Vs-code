import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/session";
import { getStripe, getStripePriceId } from "@/lib/stripe";

export async function POST(request: Request) {
  const session = await getCurrentSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { plan } = (await request.json().catch(() => ({ plan: "PRO" }))) as { plan?: "PRO" | "AGENCY" };
  const stripe = getStripe();

  if (!stripe) {
    return NextResponse.json({
      message: "Stripe is not configured yet. Set STRIPE_SECRET_KEY to enable checkout."
    });
  }

  const priceId = getStripePriceId(plan === "AGENCY" ? "AGENCY" : "PRO");
  if (!priceId) {
    return NextResponse.json({ error: "Missing Stripe price ID." }, { status: 400 });
  }

  const origin = process.env.APP_URL || "http://localhost:3000";

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: session.user.email ?? undefined,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${origin}/billing?success=1`,
    cancel_url: `${origin}/billing?canceled=1`
  });

  return NextResponse.json({
    url: checkoutSession.url
  });
}
