import type { AssumptionsInput, AccountInput, YearProjection, RetirementResult } from "@/lib/types/calculator";

const CURRENT_YEAR = new Date().getFullYear();
const MAX_PROJECTION_YEARS = 50;

export function calculateRetirement(
  assumptions: AssumptionsInput,
  accounts: AccountInput[]
): RetirementResult {
  const projections: YearProjection[] = [];
  let retirementYear: number | null = null;

  // Initialize account balances
  const accountBalances: Record<string, number> = {};
  accounts.forEach(acc => {
    accountBalances[acc.id] = acc.currentBalance;
  });

  for (let i = 0; i <= MAX_PROJECTION_YEARS; i++) {
    const year = CURRENT_YEAR + i;
    const age = assumptions.currentAge + i;

    // Step 1: Calculate contributions for each account this year
    let totalContributions = 0;
    accounts.forEach(acc => {
      if (!acc.contributions) return;

      const { amount, frequency, growthType, growthValue, startYear, endYear } = acc.contributions;

      // Check if contributions are active this year
      if (startYear && year < startYear) return;
      if (endYear && year > endYear) return;

      // Calculate contribution with growth
      let yearlyContribution = frequency === "MONTHLY" ? amount * 12 : amount;

      if (growthType && growthValue && i > 0) {
        if (growthType === "PERCENTAGE") {
          yearlyContribution *= Math.pow(1 + growthValue, i);
        } else {
          yearlyContribution += growthValue * i;
        }
      }

      accountBalances[acc.id] += yearlyContribution;
      totalContributions += yearlyContribution;
    });

    // Step 2: Apply growth (minus fees) to each account
    let portfolioGrowth = 0;
    accounts.forEach(acc => {
      const effectiveReturn = acc.annualReturnRate - assumptions.investmentFeeRate;
      const growth = accountBalances[acc.id] * effectiveReturn;
      accountBalances[acc.id] += growth;
      portfolioGrowth += growth;
    });

    // Step 3: Apply one-time events
    let eventImpact = 0;
    accounts.forEach(acc => {
      acc.events.forEach(event => {
        if (event.year === year) {
          let amount = event.amount;
          if (event.isInflationAdjusted) {
            const yearsFromNow = year - CURRENT_YEAR;
            amount *= Math.pow(1 + assumptions.inflationRate, yearsFromNow);
          }
          accountBalances[acc.id] += amount;
          eventImpact += amount;
        }
      });
    });

    // Step 4: Calculate totals
    const portfolioValue = Object.values(accountBalances).reduce((sum, bal) => sum + bal, 0);

    // Step 5: Calculate inflation-adjusted spending need
    const inflationAdjustedSpending = assumptions.annualSpendingTarget *
      Math.pow(1 + assumptions.inflationRate, i);

    // Step 6: Calculate retirement income capacity
    const supportedRetirementIncome = portfolioValue * assumptions.withdrawalRate;
    const afterTaxIncome = supportedRetirementIncome * (1 - assumptions.retirementTaxRate);

    // Add pension/social security income if applicable
    let additionalIncome = 0;
    accounts.forEach(acc => {
      if (acc.annualBenefit && acc.benefitStartAge && age >= acc.benefitStartAge) {
        additionalIncome += acc.annualBenefit;
      }
    });
    const totalAfterTaxIncome = afterTaxIncome + additionalIncome;

    // Step 7: Determine if can retire
    const canRetire = totalAfterTaxIncome >= inflationAdjustedSpending;

    if (canRetire && retirementYear === null) {
      retirementYear = year;
    }

    // Check if target retirement age reached
    if (assumptions.desiredRetirementAge && age === assumptions.desiredRetirementAge && retirementYear === null) {
      retirementYear = year;
    }

    projections.push({
      year,
      age,
      portfolioValue,
      totalContributions,
      portfolioGrowth,
      eventImpact,
      inflationAdjustedSpending,
      supportedRetirementIncome,
      afterTaxIncome: totalAfterTaxIncome,
      canRetire,
      accountBreakdown: { ...accountBalances },
    });
  }

  const retirementIdx = retirementYear ? retirementYear - CURRENT_YEAR : MAX_PROJECTION_YEARS;
  const retirementProjection = projections[retirementIdx];

  return {
    retirementYear: retirementYear || CURRENT_YEAR + MAX_PROJECTION_YEARS,
    retirementAge: assumptions.currentAge + retirementIdx,
    portfolioAtRetirement: retirementProjection.portfolioValue,
    annualIncomeAtRetirement: retirementProjection.afterTaxIncome,
    targetSpendingAtRetirement: retirementProjection.inflationAdjustedSpending,
    yearByYearProjections: projections,
  };
}
