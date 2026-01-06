Claude Code Build Instructions: RetireRight - Retirement Year & Cash-Flow Planner
Project Overview
Build a SaaS application that calculates when a user can retire based on their spending goals, account portfolios, and financial assumptions. The app answers one core question: "What year can I retire?"
Tech Stack:

Framework: Next.js 14 (App Router)
Database: Neon PostgreSQL with Prisma ORM
Auth: NextAuth.js with Google OAuth
Styling: Tailwind CSS
Payments: Stripe (subscriptions)
Charts: Recharts or Chart.js
Hosting: Vercel

Phase 1: Project Foundation
Task 1.1: Initialize Next.js Project
bashnpx create-next-app@latest retireright --typescript --tailwind --eslint --app --src-dir --import-alias "@/\*"
cd retireright
Task 1.2: Install Core Dependencies
bashnpm install prisma @prisma/client next-auth @auth/prisma-adapter
npm install stripe @stripe/stripe-js
npm install recharts date-fns zod react-hook-form @hookform/resolvers
npm install lucide-react clsx tailwind-merge
npm install -D @types/node
Task 1.3: Initialize Prisma
bashnpx prisma init
Configure prisma/schema.prisma for Neon PostgreSQL connection.

Phase 2: Database Schema
Task 2.1: Define Prisma Schema
Create the following models in prisma/schema.prisma:
prismagenerator client {
provider = "prisma-client-js"
}

datasource db {
provider = "postgresql"
url = env("DATABASE_URL")
}

// NextAuth Models
model Account {
id String @id @default(cuid())
userId String
type String
provider String
providerAccountId String
refresh_token String? @db.Text
access_token String? @db.Text
expires_at Int?
token_type String?
scope String?
id_token String? @db.Text
session_state String?
user User @relation(fields: [userId], references: [id], onDelete: Cascade)

@@unique([provider, providerAccountId])
}

model Session {
id String @id @default(cuid())
sessionToken String @unique
userId String
expires DateTime
user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model User {
id String @id @default(cuid())
name String?
email String? @unique
emailVerified DateTime?
image String?
accounts Account[]
sessions Session[]

// App-specific
plan PlanType @default(FREE)
stripeCustomerId String? @unique
stripeSubId String?
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

// Relations
assumptions Assumptions?
financialAccounts FinancialAccount[]
annualSnapshots AnnualSnapshot[]
}

model VerificationToken {
identifier String
token String @unique
expires DateTime

@@unique([identifier, token])
}

// App Models
enum PlanType {
FREE
PAID
}

model Assumptions {
id String @id @default(cuid())
userId String @unique
user User @relation(fields: [userId], references: [id], onDelete: Cascade)

// Spending & Inflation
annualSpendingTarget Float // Today's dollars
inflationRate Float @default(0.025) // 2.5%

// Retirement Rules
retirementTaxRate Float @default(0.20) // 20%
withdrawalRate Float @default(0.04) // 4%
retirementGrowthRate Float @default(0.02) // 2% post-retirement

// Timeline
currentAge Int
desiredRetirementAge Int? // null = auto-find earliest
lifeExpectancy Int? @default(90)

// Fees (Free version)
investmentFeeRate Float @default(0.005) // 0.5%

createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
}

enum AccountType {
TAXABLE_BROKERAGE
TRADITIONAL_401K
TRADITIONAL_IRA
ROTH_401K
ROTH_IRA
HSA
PENSION
SOCIAL_SECURITY
}

model FinancialAccount {
id String @id @default(cuid())
userId String
user User @relation(fields: [userId], references: [id], onDelete: Cascade)

name String
accountType AccountType
currentBalance Float

// Growth
annualReturnRate Float @default(0.07) // 7%
useRealReturn Boolean @default(false)

// Contributions
contributionAmount Float?
contributionFrequency ContributionFrequency?
contributionGrowthType GrowthType?
contributionGrowthValue Float?
contributionStartYear Int?
contributionEndYear Int?

// For Pension/Social Security
annualBenefit Float?
benefitStartAge Int?

// Withdrawal order (Paid feature, but stored for all)
withdrawalPriority Int?

events AccountEvent[]

createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
}

enum ContributionFrequency {
MONTHLY
YEARLY
}

enum GrowthType {
PERCENTAGE
FIXED_DOLLAR
}

model AccountEvent {
id String @id @default(cuid())
accountId String
account FinancialAccount @relation(fields: [accountId], references: [id], onDelete: Cascade)

year Int
amount Float // Positive = addition, Negative = withdrawal
label String // "College", "House Down Payment", etc.
isInflationAdjusted Boolean @default(true)

createdAt DateTime @default(now())
}

// Paid Feature: Annual Reality Check
model AnnualSnapshot {
id String @id @default(cuid())
userId String
user User @relation(fields: [userId], references: [id], onDelete: Cascade)

year Int

// Actual values entered by user
actualTotalBalance Float
actualContributions Float?

// Projected values at time of snapshot (for comparison)
projectedTotalBalance Float

// Recalculated outputs
newRetirementYear Int?
successProbability Float? // Monte Carlo result

notes String?
createdAt DateTime @default(now())

@@unique([userId, year])
}
Task 2.2: Push Schema to Database
bashnpx prisma db push
npx prisma generate

Phase 3: Authentication
Task 3.1: Configure NextAuth
Create src/app/api/auth/[...nextauth]/route.ts:
typescriptimport NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

const handler = NextAuth({
adapter: PrismaAdapter(prisma),
providers: [
GoogleProvider({
clientId: process.env.GOOGLE_CLIENT_ID!,
clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
}),
],
callbacks: {
session: async ({ session, user }) => {
if (session.user) {
session.user.id = user.id;
// Fetch plan status
const dbUser = await prisma.user.findUnique({
where: { id: user.id },
select: { plan: true },
});
session.user.plan = dbUser?.plan || "FREE";
}
return session;
},
},
pages: {
signIn: "/login",
},
});

export { handler as GET, handler as POST };
Create src/lib/prisma.ts:
typescriptimport { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

Phase 4: Core Calculation Engine
Task 4.1: Create Calculation Types
Create src/lib/types/calculator.ts:
typescriptexport interface AssumptionsInput {
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
Task 4.2: Build Calculation Engine
Create src/lib/calculator/engine.ts:
typescriptimport type { AssumptionsInput, AccountInput, YearProjection, RetirementResult } from "@/lib/types/calculator";

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

Phase 5: API Routes
Task 5.1: Assumptions API
Create src/app/api/assumptions/route.ts:
typescriptimport { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
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
const session = await getServerSession();
if (!session?.user?.id) {
return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

const assumptions = await prisma.assumptions.findUnique({
where: { userId: session.user.id },
});

return NextResponse.json(assumptions);
}

export async function POST(request: Request) {
const session = await getServerSession();
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
Task 5.2: Accounts API
Create src/app/api/accounts/route.ts:
typescriptimport { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
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
const session = await getServerSession();
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
const session = await getServerSession();
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
Task 5.3: Calculate API
Create src/app/api/calculate/route.ts:
typescriptimport { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { calculateRetirement } from "@/lib/calculator/engine";
import type { AssumptionsInput, AccountInput } from "@/lib/types/calculator";

export async function GET() {
const session = await getServerSession();
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

Phase 6: UI Components
Task 6.1: Dashboard Layout
Create src/app/(dashboard)/layout.tsx:
typescriptimport { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { Sidebar } from "@/components/Sidebar";
import { TopNav } from "@/components/TopNav";

export default async function DashboardLayout({
children,
}: {
children: React.ReactNode;
}) {
const session = await getServerSession();

if (!session) {
redirect("/login");
}

return (
<div className="min-h-screen bg-gray-50">
<Sidebar />
<div className="lg:pl-64">
<TopNav user={session.user} />
<main className="py-6 px-4 sm:px-6 lg:px-8">
{children}
</main>
</div>
</div>
);
}
Task 6.2: Create Navigation Structure
The app should have these main sections in the sidebar:

Dashboard - Results summary card + main charts
Assumptions - All input assumptions (spending, inflation, taxes, rates)
Accounts - Tab-based account management
Projections - Year-by-year table view
Settings - Profile, subscription management

Task 6.3: Assumptions Form
Create src/components/forms/AssumptionsForm.tsx:
Key inputs with appropriate UI:

Annual Spending Target: Currency input with formatting
Inflation Rate: Slider (1-5%) with number input
Retirement Tax Rate: Slider (0-50%) with number input
Withdrawal Rate: Slider (2-6%) with default 4%
Retirement Growth Rate: Slider (0-5%) with number input
Current Age: Number input
Desired Retirement Age: Optional number input with "Find earliest" toggle
Investment Fee Rate: Slider (0-2%)

Task 6.4: Account Manager
Create src/components/accounts/AccountManager.tsx:
Features:

Tab interface showing all accounts
"Add Account" button opens modal/drawer
Each account card shows: name, type, balance, projected value
Click to expand/edit account details
Events table within each account

Task 6.5: Results Dashboard
Create src/components/dashboard/ResultsSummary.tsx:
Primary result card:

"You can retire in: 2043 (Age 62)" - Large, prominent
Portfolio value at retirement
Annual income vs spending comparison
Status indicator (on track / needs adjustment)

Task 6.6: Charts
Create src/components/charts/:

PortfolioGrowthChart.tsx - Stacked area chart by account
ContributionsChart.tsx - Bar chart of yearly contributions
IncomeVsSpendingChart.tsx - Dual line chart showing gap closure

Task 6.7: Projections Table
Create src/components/projections/YearByYearTable.tsx:
Columns:

Year
Age
Portfolio Value
Retirement Income (after tax)
Spending Target
Status (✓ Can Retire / ✗ Not Yet)

Phase 7: Stripe Integration
Task 7.1: Configure Stripe
Create src/lib/stripe.ts:
typescriptimport Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
apiVersion: "2023-10-16",
});
Task 7.2: Checkout API
Create src/app/api/stripe/checkout/route.ts:
typescriptimport { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST() {
const session = await getServerSession();
if (!session?.user?.id) {
return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

const user = await prisma.user.findUnique({
where: { id: session.user.id },
});

let customerId = user?.stripeCustomerId;

if (!customerId) {
const customer = await stripe.customers.create({
email: session.user.email!,
metadata: { userId: session.user.id },
});
customerId = customer.id;

    await prisma.user.update({
      where: { id: session.user.id },
      data: { stripeCustomerId: customerId },
    });

}

const checkoutSession = await stripe.checkout.sessions.create({
customer: customerId,
mode: "subscription",
payment_method_types: ["card"],
line_items: [
{
price: process.env.STRIPE_PRICE_ID,
quantity: 1,
},
],
success_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings?success=true`,
cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings?canceled=true`,
});

return NextResponse.json({ url: checkoutSession.url });
}
Task 7.3: Webhook Handler
Create src/app/api/stripe/webhook/route.ts:
Handle events:

checkout.session.completed → Update user plan to PAID
customer.subscription.deleted → Revert user plan to FREE

Phase 8: Paid Features (Implementation Stubs)
Task 8.1: Monte Carlo Simulation
Create src/lib/calculator/monteCarlo.ts:
typescript// Paid feature: Run 1000+ simulations with randomized returns
// Return probability of success (% of simulations meeting spending goal)

export function runMonteCarloSimulation(
assumptions: AssumptionsInput,
accounts: AccountInput[],
iterations: number = 1000
): { successProbability: number; percentiles: Record<number, number> } {
// Implementation for paid version
// - Randomize annual returns using normal distribution
// - Track portfolio value at retirement across all simulations
// - Calculate success rate and percentile outcomes
}
Task 8.2: Annual Snapshot (Reality Check)
Create paid feature route src/app/api/snapshots/route.ts:
Allow users to:

Enter actual current balance
Compare to last year's projection
Recalculate retirement year based on actuals
Store historical snapshots for trend analysis

Task 8.3: Feature Gating Utility
Create src/lib/features.ts:
typescriptimport { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function isPaidUser(): Promise<boolean> {
const session = await getServerSession();
if (!session?.user?.id) return false;

const user = await prisma.user.findUnique({
where: { id: session.user.id },
select: { plan: true },
});

return user?.plan === "PAID";
}

export const PAID_FEATURES = {
monteCarlo: true,
taxOptimizedWithdrawals: true,
annualSnapshots: true,
scenarioComparison: true,
exportReports: true,
healthcareCosts: true,
rmdsAndPenalties: true,
};

Phase 9: Environment Variables
Create .env.example:
bash# Database
DATABASE_URL="postgresql://..."

# NextAuth

NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# Google OAuth

GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Stripe

STRIPE_SECRET_KEY=""
STRIPE_PUBLISHABLE_KEY=""
STRIPE_PRICE_ID=""
STRIPE_WEBHOOK_SECRET=""

# App

NEXT_PUBLIC_APP_URL="http://localhost:3000"

Phase 10: Testing & Validation
Task 10.1: Calculation Tests
Create src/lib/calculator/**tests**/engine.test.ts:
Test cases:

Simple case: Single account, no contributions → verify math
Multiple accounts with different return rates
Contributions with growth over time
One-time events (withdrawals and additions)
Pension/Social Security income integration
Inflation-adjusted spending targets
Edge case: Already can retire (year 0)
Edge case: Never reaches target in 50 years

Task 10.2: API Tests
Test authentication flows and data validation for all routes.

Build Order Summary
Week 1: Foundation

Project setup + Prisma schema
NextAuth configuration
Basic calculation engine

Week 2: Core Features 4. Assumptions form + API 5. Account manager + API 6. Calculate API integration
Week 3: UI & Visualization 7. Dashboard layout 8. Results summary card 9. Charts implementation 10. Year-by-year table
Week 4: Payments & Polish 11. Stripe integration 12. Feature gating 13. Landing page 14. Mobile responsiveness
Week 5+: Paid Features 15. Monte Carlo simulation 16. Annual snapshots 17. Advanced tax modeling

Key Implementation Notes

Always validate inputs with Zod before database operations
Use server components for data fetching where possible
Implement optimistic UI updates for better UX
Cache calculation results when inputs haven't changed
Format currency consistently using Intl.NumberFormat
Handle edge cases: negative balances, extreme rates, missing data
Mobile-first design for the dashboard views
Progressive disclosure: Show advanced options only when needed

Commands Reference
bash# Development
npm run dev

# Database

npx prisma studio # Visual database browser
npx prisma db push # Push schema changes
npx prisma generate # Regenerate client

# Build & Deploy

npm run build
npm run start

# Testing

npm run test

#Below this line is from my app building template

# The Nexus - Product Studio Boilerplate

## Project Memory & Architectural Guidelines

This is **The Nexus**, a Next.js 15+ (App Router) boilerplate built for rapid product development using **Vertical Slice Architecture**.

## Core Architecture: Vertical Slice

**Philosophy:** Each feature is a self-contained module. Instead of organizing by technical layers (components, utils, api), we organize by business capability.

### Directory Structure

```
src/
├── modules/              # Each module = one feature slice
│   ├── landing/          # Marketing & hero pages
│   ├── auth/             # User & Security
│   ├── billing/          # SaaS Pricing & Stripe
│   ├── ai-studio/        # AI Sandbox (streaming chat)
│   ├── component-lib/    # UI Component showcase
│   └── [feature]/        # Future modules...
├── config/
│   └── site-config.ts    # Master toggle & app metadata
├── lib/                  # Shared utilities only
└── components/           # Global shared components (layout, nav)
```

### Module Structure (Vertical Slice)

Each module in `src/modules/{feature-name}/` contains:

```
{feature-name}/
├── components/       # Feature-specific UI components
├── api/              # API routes for this feature
├── lib/              # Feature-specific utilities
├── hooks/            # Feature-specific React hooks
├── types/            # TypeScript types for this feature
├── page.tsx          # Main route
└── README.md         # Feature documentation
```

## The Brain: CLAUDE.md (This File)

This file serves as Claude Code's persistent memory. Key information:

### Tech Stack

- **Framework:** Next.js 15+ (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS + shadcn/ui patterns
- **Database:** Prisma + PostgreSQL (Neon)
- **Auth:** NextAuth.js
- **Payments:** Stripe
- **Animations:** Framer Motion
- **AI:** Anthropic/OpenAI streaming responses

### Code Standards

1. **Always use TypeScript** - No implicit any
2. **Follow Vertical Slice** - Keep feature code together
3. **shadcn/ui patterns** - Use existing component patterns
4. **Server Components first** - Use "use client" only when needed
5. **Feature Flags** - All new features behind FeatureGate

### Feature Flag System

All modules are controlled by `src/config/site-config.ts`:

```typescript
export const siteConfig = {
  name: "The Nexus",
  activeFeatures: ["auth", "billing", "ai-studio"], // Turn features on/off
  theme: "purple", // Color scheme
  // ... more config
};
```

Use the `<FeatureGate>` component to conditionally render:

```tsx
<FeatureGate featureId="ai-studio">
  <AIComponent />
</FeatureGate>
```

## The Registry: Module Catalog

`src/config/registry.ts` maps all modules for the "Sales Catalog" view:

```typescript
export const moduleRegistry = {
  landing: {
    name: "Landing Pages",
    description: "Hero, marketing, and showcase",
    icon: "Home",
    category: "Marketing",
    route: "/",
  },
  // ... more modules
};
```

## Development Workflow

### Adding a New Feature Module

1. **Create the module folder:**

   ```
   src/modules/{feature-name}/
   ```

2. **Add to site-config.ts:**

   ```typescript
   activeFeatures: [..., "{feature-name}"]
   ```

3. **Register in registry.ts:**

   ```typescript
   "{feature-name}": {
     name: "Feature Name",
     description: "What it does",
     category: "Category",
     // ...
   }
   ```

4. **Build the feature** following vertical slice principles

### "New App in a Day" Usage

To create a new product:

1. Clone this repo
2. Edit `site-config.ts` - Set `activeFeatures` to only what you need
3. Prompt Claude: "Based on the {module} structure, create a {new-feature} module"
4. Claude will copy the pattern and create a self-contained feature

## Current Modules

### ✅ Implemented

- **landing** - Hero pages, component showcase, theme selector
- **auth** - NextAuth.js with OAuth, sessions, user management
- **billing** - Stripe integration, subscriptions, webhooks
- **component-lib** - 60+ production-ready UI components

### 🔄 Planned (from the plan)

- **ai-studio** - Streaming chat with Anthropic/OpenAI
- **admin** - Hidden admin panel (feature flag: showAdmin)

## Key Files to Remember

- **CLAUDE.md** (this file) - Project memory, always read first
- **src/config/site-config.ts** - Master toggle for all features
- **src/config/registry.ts** - Module metadata for catalog view
- **src/components/FeatureGate.tsx** - Conditional rendering component

## Catalog Mode

When `siteConfig.isCatalog = true`, the app shows a sidebar with all 60 modules grouped by category. Clicking a module navigates to a preview page. This is for showcasing capabilities to clients.

## Hidden Admin Toggle

Keep a `showAdmin` flag in site-config.ts. When talking to customers, you can toggle features on/off in real-time to show pre-built capabilities without revealing the full codebase structure.

## Important Patterns

### Database Queries

- Use Prisma ORM
- Keep queries in `{module}/lib/db.ts`
- Export typed functions, not raw Prisma calls

### API Routes

- Place in `{module}/api/route.ts`
- Use Next.js App Router conventions
- Return typed responses

### Styling

- Tailwind classes only
- Follow existing component patterns
- Mobile-first responsive design

## When Claude Code Starts a Session

1. **Read CLAUDE.md first** - This file contains the project's persistent memory
2. **Check site-config.ts** - See what features are active
3. **Follow Vertical Slice** - Keep all feature code in its module folder
4. **Use existing patterns** - Look at similar modules for guidance

## Quality Gates

Before completing any task:

- ✅ TypeScript compiles (`npm run build`)
- ✅ Linting passes (`npm run lint`)
- ✅ Feature is behind FeatureGate
- ✅ Module is registered in registry.ts
- ✅ Mobile-responsive
- ✅ README.md in module folder

---

**Last Updated:** 2026-01-02
**Current State:** Transforming web-app-template into The Nexus architecture
