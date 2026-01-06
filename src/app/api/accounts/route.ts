import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const accountSchema = z.object({
  name: z.string().min(1),
  accountType: z.enum([
    "TAXABLE_BROKERAGE",
    "TRADITIONAL_401K",
    "TRADITIONAL_IRA",
    "ROTH_401K",
    "ROTH_IRA",
    "HSA",
    "PENSION",
    "SOCIAL_SECURITY",
  ]),
  currentBalance: z.number().min(0),
  annualReturnRate: z.number().min(-0.5).max(0.5),
  useRealReturn: z.boolean().optional(),
  contributionAmount: z.number().optional().nullable(),
  contributionFrequency: z.enum(["MONTHLY", "YEARLY"]).optional().nullable(),
  contributionGrowthType: z.enum(["PERCENTAGE", "FIXED_DOLLAR"]).optional().nullable(),
  contributionGrowthValue: z.number().optional().nullable(),
  contributionStartYear: z.number().int().optional().nullable(),
  contributionEndYear: z.number().int().optional().nullable(),
  annualBenefit: z.number().optional().nullable(),
  benefitStartAge: z.number().int().optional().nullable(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const accounts = await prisma.financialAccount.findMany({
    where: { userId: session.user.id },
    include: { events: true },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(accounts);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const validated = accountSchema.parse(body);

  const account = await prisma.financialAccount.create({
    data: {
      userId: session.user.id,
      ...validated,
    },
    include: { events: true },
  });

  return NextResponse.json(account);
}
