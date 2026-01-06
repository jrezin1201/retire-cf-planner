import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const assumptionsSchema = z.object({
  annualSpendingTarget: z.number().positive(),
  inflationRate: z.number().min(0).max(0.2),
  retirementTaxRate: z.number().min(0).max(1),
  withdrawalRate: z.number().min(0.01).max(0.15),
  retirementGrowthRate: z.number().min(-0.1).max(0.15),
  currentAge: z.number().int().min(18).max(100),
  desiredRetirementAge: z.number().int().min(30).max(100).optional().nullable(),
  lifeExpectancy: z.number().int().min(50).max(120).optional(),
  investmentFeeRate: z.number().min(0).max(0.05),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const assumptions = await prisma.assumptions.findUnique({
    where: { userId: session.user.id },
  });

  return NextResponse.json(assumptions);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const validated = assumptionsSchema.parse(body);

  const assumptions = await prisma.assumptions.upsert({
    where: { userId: session.user.id },
    update: validated,
    create: {
      userId: session.user.id,
      ...validated,
    },
  });

  return NextResponse.json(assumptions);
}
