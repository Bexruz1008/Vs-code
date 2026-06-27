import { NextResponse } from "next/server";
import { Stripe } from "stripe";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe is not configured." }, { status: 400 });
  }

  const signature = request.headers.get("stripe-signature");
  const body = await request.text();

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Webhook secret missing." }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid webhook signature." },
      { status: 400 }
    );
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.customer && session.subscription && session.customer_email) {
        const user = await prisma.user.findUnique({
          where: {
            email: session.customer_email
          },
          include: {
            memberships: {
              take: 1,
              include: {
                organization: true
              }
            }
          }
        });

        await prisma.subscription.upsert({
          where: {
            stripeSubscriptionId: String(session.subscription)
          },
          update: {
            stripeCustomerId: String(session.customer),
            userId: user?.id ?? undefined,
            organizationId: user?.memberships[0]?.organizationId,
            status: "ACTIVE"
          },
          create: {
            stripeCustomerId: String(session.customer),
            stripeSubscriptionId: String(session.subscription),
            userId: user?.id,
            organizationId: user?.memberships[0]?.organizationId,
            plan: "PRO",
            status: "ACTIVE"
          }
        });
      }
      break;
    }
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const plan = resolvePlan(subscription.items.data[0]?.price.id);
      const status =
        subscription.status === "active"
          ? "ACTIVE"
          : subscription.status === "trialing"
            ? "TRIALING"
            : "CANCELED";
      await prisma.subscription.upsert({
        where: {
          stripeSubscriptionId: subscription.id
        },
        update: {
          plan,
          status,
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
          currentPeriodEnd: new Date(subscription.current_period_end * 1000)
        },
        create: {
          stripeSubscriptionId: subscription.id,
          stripeCustomerId: String(subscription.customer),
          plan,
          status,
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
          currentPeriodEnd: new Date(subscription.current_period_end * 1000)
        }
      });
      break;
    }
  }

  return NextResponse.json({ received: true });
}

function resolvePlan(priceId?: string): "FREE" | "PRO" | "AGENCY" {
  if (priceId === process.env.STRIPE_PRICE_AGENCY) {
    return "AGENCY";
  }

  if (priceId === process.env.STRIPE_PRICE_PRO) {
    return "PRO";
  }

  return "FREE";
}
