import Stripe from "stripe";

export function getStripe() {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return null;
  }

  return new Stripe(secret, {
    apiVersion: "2025-01-27.acacia"
  });
}

export function getStripePriceId(plan: "FREE" | "PRO" | "AGENCY") {
  if (plan === "PRO") {
    return process.env.STRIPE_PRICE_PRO;
  }

  if (plan === "AGENCY") {
    return process.env.STRIPE_PRICE_AGENCY;
  }

  return process.env.STRIPE_PRICE_FREE;
}
