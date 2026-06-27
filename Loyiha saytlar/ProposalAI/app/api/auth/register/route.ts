import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { authRegisterSchema } from "@/lib/validators";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const body = authRegisterSchema.parse(await request.json());
    const existing = await prisma.user.findUnique({
      where: { email: body.email }
    });

    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(body.password, 12);
    const orgSlug = `${slugify(body.name)}-${Date.now().toString(36)}`;

    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        passwordHash,
        role: "USER",
        memberships: {
          create: {
            role: "OWNER",
            organization: {
              create: {
                name: `${body.name}'s Workspace`,
                slug: orgSlug
              }
            }
          }
        },
        subscriptions: {
          create: {
            plan: "FREE",
            status: "ACTIVE"
          }
        }
      }
    });

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to register user."
      },
      { status: 400 }
    );
  }
}
