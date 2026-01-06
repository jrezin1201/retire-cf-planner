export interface AssumptionsInput {
  annualSpendingTarget: number; // Today's dollars
  inflationRate: number;
  retirementTaxRate: number;
  withdrawalRate: number;
  retirementGrowthRate: number;
  currentAge: number;
  desiredRetirementAge?: number;
  investmentFeeRate: number;
}

export interface AccountInput {
  id: string;
  name: string;
  accountType: string;
  currentBalance: number;
  annualReturnRate: number;
  contributions?: {
    amount: number;
    frequency: "MONTHLY" | "YEARLY";
    growthType?: "PERCENTAGE" | "FIXED_DOLLAR";
    growthValue?: number;
    startYear?: number;
    endYear?: number;
  };
  events: Array<{
    year: number;
    amount: number;
    isInflationAdjusted: boolean;
  }>;
  // For pension/social security
  annualBenefit?: number;
  benefitStartAge?: number;
}

export interface YearProjection {
  year: number;
  age: number;
  portfolioValue: number;
  totalContributions: number;
  portfolioGrowth: number;
  eventImpact: number;
  inflationAdjustedSpending: number;
  supportedRetirementIncome: number;
  afterTaxIncome: number;
  canRetire: boolean;
  accountBreakdown: Record<string, number>;
}

export interface RetirementResult {
  retirementYear: number;
  retirementAge: number;
  portfolioAtRetirement: number;
  annualIncomeAtRetirement: number;
  targetSpendingAtRetirement: number;
  yearByYearProjections: YearProjection[];
}
