import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateRetirement } from "@/lib/calculator/engine";
import type { AssumptionsInput, AccountInput } from "@/lib/types/calculator";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch user's assumptions and accounts
  const [assumptions, accounts] = await Promise.all([
    prisma.assumptions.findUnique({
      where: { userId: session.user.id },
    }),
    prisma.financialAccount.findMany({
      where: { userId: session.user.id },
      include: { events: true },
    }),
  ]);

  if (!assumptions) {
    return NextResponse.json({ error: "No assumptions configured" }, { status: 400 });
  }

  if (accounts.length === 0) {
    return NextResponse.json({ error: "No accounts configured" }, { status: 400 });
  }

  // Transform to calculation input types
  const assumptionsInput: AssumptionsInput = {
    annualSpendingTarget: assumptions.annualSpendingTarget,
    inflationRate: assumptions.inflationRate,
    retirementTaxRate: assumptions.retirementTaxRate,
    withdrawalRate: assumptions.withdrawalRate,
    retirementGrowthRate: assumptions.retirementGrowthRate,
    currentAge: assumptions.currentAge,
    desiredRetirementAge: assumptions.desiredRetirementAge || undefined,
    investmentFeeRate: assumptions.investmentFeeRate,
  };

  const accountsInput: AccountInput[] = accounts.map(acc => ({
    id: acc.id,
    name: acc.name,
    accountType: acc.accountType,
    currentBalance: acc.currentBalance,
    annualReturnRate: acc.annualReturnRate,
    contributions: acc.contributionAmount ? {
      amount: acc.contributionAmount,
      frequency: acc.contributionFrequency as "MONTHLY" | "YEARLY",
      growthType: acc.contributionGrowthType as "PERCENTAGE" | "FIXED_DOLLAR" | undefined,
      growthValue: acc.contributionGrowthValue || undefined,
      startYear: acc.contributionStartYear || undefined,
      endYear: acc.contributionEndYear || undefined,
    } : undefined,
    events: acc.events.map(e => ({
      year: e.year,
      amount: e.amount,
      isInflationAdjusted: e.isInflationAdjusted,
    })),
    annualBenefit: acc.annualBenefit || undefined,
    benefitStartAge: acc.benefitStartAge || undefined,
  }));

  const result = calculateRetirement(assumptionsInput, accountsInput);

  return NextResponse.json(result);
}
