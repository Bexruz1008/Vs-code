import type { Role, Plan, SubscriptionStatus } from "@prisma/client";

export const monthlyProposalLimits: Record<Plan, number> = {
  FREE: 3,
  PRO: Number.POSITIVE_INFINITY,
  AGENCY: Number.POSITIVE_INFINITY
};

export function canManageTeam(role: Role) {
  return role === "ADMIN" || role === "OWNER";
}

export function canAccessAdmin(role: Role) {
  return role === "ADMIN" || role === "OWNER";
}

export function isActiveSubscription(status?: SubscriptionStatus | null) {
  return status === "ACTIVE" || status === "TRIALING";
}
