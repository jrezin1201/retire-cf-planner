import type { AssumptionsInput, AccountInput } from "@/lib/types/calculator";

export const mockAssumptions: AssumptionsInput = {
  annualSpendingTarget: 75000, // $75k per year in today's dollars
  inflationRate: 0.03, // 3% inflation
  retirementTaxRate: 0.22, // 22% tax rate in retirement
  withdrawalRate: 0.04, // 4% safe withdrawal rate
  retirementGrowthRate: 0.02, // 2% growth after retirement
  currentAge: 35,
  desiredRetirementAge: undefined, // Auto-calculate
  investmentFeeRate: 0.005, // 0.5% fees
};

export const mockAccounts: AccountInput[] = [
  {
    id: "1",
    name: "Vanguard 401(k)",
    accountType: "TRADITIONAL_401K",
    currentBalance: 125000,
    annualReturnRate: 0.08, // 8% annual return
    contributions: {
      amount: 1500, // $1,500/month
      frequency: "MONTHLY",
      growthType: "PERCENTAGE",
      growthValue: 0.03, // 3% annual raises
      startYear: 2026,
      endYear: 2055, // Until age 64
    },
    events: [],
  },
  {
    id: "2",
    name: "Roth IRA",
    accountType: "ROTH_IRA",
    currentBalance: 45000,
    annualReturnRate: 0.085, // 8.5% annual return
    contributions: {
      amount: 500, // $500/month
      frequency: "MONTHLY",
      growthType: "PERCENTAGE",
      growthValue: 0.03,
      startYear: 2026,
      endYear: 2055,
    },
    events: [],
  },
  {
    id: "3",
    name: "Taxable Brokerage",
    accountType: "TAXABLE_BROKERAGE",
    currentBalance: 32000,
    annualReturnRate: 0.07, // 7% annual return
    contributions: {
      amount: 300, // $300/month
      frequency: "MONTHLY",
      startYear: 2026,
      endYear: 2055,
    },
    events: [
      {
        year: 2030,
        amount: -25000, // House down payment
        isInflationAdjusted: true,
      },
      {
        year: 2040,
        amount: 50000, // Inheritance
        isInflationAdjusted: false,
      },
    ],
  },
  {
    id: "4",
    name: "Social Security",
    accountType: "SOCIAL_SECURITY",
    currentBalance: 0,
    annualReturnRate: 0,
    annualBenefit: 28000, // $28k/year estimated
    benefitStartAge: 67,
    events: [],
  },
];

// Alternative scenario - already close to retirement
export const mockAssumptionsNearRetirement: AssumptionsInput = {
  annualSpendingTarget: 60000,
  inflationRate: 0.025,
  retirementTaxRate: 0.20,
  withdrawalRate: 0.04,
  retirementGrowthRate: 0.02,
  currentAge: 58,
  desiredRetirementAge: undefined,
  investmentFeeRate: 0.005,
};

export const mockAccountsNearRetirement: AccountInput[] = [
  {
    id: "1",
    name: "Combined 401(k) Accounts",
    accountType: "TRADITIONAL_401K",
    currentBalance: 850000,
    annualReturnRate: 0.065,
    contributions: {
      amount: 2500,
      frequency: "MONTHLY",
      startYear: 2026,
      endYear: 2031, // Until age 63
    },
    events: [],
  },
  {
    id: "2",
    name: "Roth IRA",
    accountType: "ROTH_IRA",
    currentBalance: 175000,
    annualReturnRate: 0.07,
    events: [],
  },
  {
    id: "3",
    name: "Taxable Investments",
    accountType: "TAXABLE_BROKERAGE",
    currentBalance: 225000,
    annualReturnRate: 0.06,
    events: [],
  },
  {
    id: "4",
    name: "Social Security",
    accountType: "SOCIAL_SECURITY",
    currentBalance: 0,
    annualReturnRate: 0,
    annualBenefit: 32000,
    benefitStartAge: 67,
    events: [],
  },
];
