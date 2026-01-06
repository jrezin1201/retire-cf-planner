# RetireRight - Retirement Year & Cash-Flow Planner

A comprehensive retirement planning SaaS application that calculates when you can retire based on your financial data, spending goals, and investment assumptions.

## Features

- **Retirement Year Calculator**: Determines the earliest year you can retire based on your financial situation
- **Portfolio Tracking**: Manage multiple financial accounts (401k, IRA, Roth, HSA, etc.)
- **Flexible Assumptions**: Customize inflation rates, tax rates, withdrawal rates, and more
- **Visual Projections**: Interactive charts showing portfolio growth over time
- **Year-by-Year Analysis**: Detailed breakdown of your financial projections
- **Free & Paid Tiers**: Core features free, advanced features (Monte Carlo simulations, etc.) for paid users

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: PostgreSQL (Neon) with Prisma ORM
- **Authentication**: NextAuth.js with Google OAuth
- **Payments**: Stripe subscriptions
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Neon PostgreSQL database (free tier available at neon.tech)
- Google OAuth credentials (for authentication)
- Stripe account (for payments)

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd retirement-year-cf-planner
npm install
```

### 2. Set Up Environment Variables

Create a `.env` or `.env.local` file in the root directory with the following variables:

```bash
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here-generate-with-openssl-rand-base64-32"

# Google OAuth
# Get these from https://console.cloud.google.com/apis/credentials
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Stripe
# Get these from https://dashboard.stripe.com/apikeys
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"
STRIPE_PRICE_ID_PRO_MONTHLY="price_your_stripe_price_id"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

#### How to Get Credentials:

**Neon PostgreSQL:**
1. Sign up at https://neon.tech
2. Create a new project
3. Copy the connection string and use it as `DATABASE_URL`

**Google OAuth:**
1. Go to https://console.cloud.google.com/apis/credentials
2. Create a new OAuth 2.0 Client ID
3. Set authorized redirect URI to: `http://localhost:3000/api/auth/callback/google`
4. Copy Client ID and Client Secret

**Stripe:**
1. Sign up at https://stripe.com
2. Get your API keys from https://dashboard.stripe.com/apikeys
3. Create a product and price, copy the price ID
4. Set up webhooks at https://dashboard.stripe.com/webhooks

**NextAuth Secret:**
```bash
openssl rand -base64 32
```

### 3. Set Up Database

```bash
# Push the Prisma schema to your database
npx prisma db push

# Generate Prisma client
npx prisma generate

# (Optional) Open Prisma Studio to view your database
npx prisma studio
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. First-Time Setup

1. Sign in with Google OAuth
2. Navigate to `/retirement/assumptions` to set up your retirement assumptions
3. Navigate to `/retirement/accounts` to add your financial accounts
4. View your retirement projection on the `/retirement` dashboard

## Project Structure

The app follows a **Vertical Slice Architecture** where each feature is self-contained:

```
src/
├── app/
│   ├── api/
│   │   ├── assumptions/    # Retirement assumptions API
│   │   ├── accounts/       # Financial accounts API
│   │   ├── calculate/      # Retirement calculation API
│   │   └── stripe/         # Stripe integration
│   └── retirement/         # Retirement planner pages
│       ├── page.tsx        # Main dashboard
│       ├── assumptions/    # Assumptions form
│       ├── accounts/       # Account manager
│       └── projections/    # Year-by-year table
├── modules/
│   └── retirement/         # Retirement feature module
│       ├── components/     # UI components
│       ├── hooks/          # React hooks
│       └── lib/            # Feature utilities
├── lib/
│   ├── calculator/         # Core calculation engine
│   │   └── engine.ts       # Retirement calculations
│   └── types/
│       └── calculator.ts   # Type definitions
└── prisma/
    └── schema.prisma       # Database schema
```

## Core Calculation Engine

The retirement calculator (`src/lib/calculator/engine.ts`) performs the following calculations for each year:

1. **Contributions**: Calculates yearly contributions with optional growth
2. **Portfolio Growth**: Applies annual returns minus investment fees
3. **One-Time Events**: Handles major expenses or windfalls
4. **Inflation Adjustment**: Adjusts spending targets for inflation
5. **Retirement Income**: Calculates sustainable withdrawal income
6. **Retirement Readiness**: Determines if you can retire each year

## Database Schema

Key models:

- **User**: Stores user info and plan status (FREE/PAID)
- **Assumptions**: Retirement planning assumptions per user
- **FinancialAccount**: User's investment accounts with balances
- **AccountEvent**: One-time financial events (house purchase, etc.)
- **AnnualSnapshot**: Yearly reality checks (paid feature)

## Available Scripts

```bash
# Development
npm run dev                 # Start dev server

# Database
npx prisma studio          # Visual database browser
npx prisma db push         # Push schema changes
npx prisma generate        # Regenerate Prisma client

# Build & Deploy
npm run build              # Build for production
npm run start              # Start production server
```

## Deployment to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add all environment variables in Vercel dashboard
4. Deploy!

**Important**: Update `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` to your production domain.

## Features Roadmap

### ✅ Implemented
- Core retirement calculation engine
- Multi-account portfolio tracking
- Flexible retirement assumptions
- Portfolio growth charts
- Year-by-year projections table
- Google OAuth authentication
- Stripe subscription integration

### 🚧 Planned (Paid Features)
- **Monte Carlo Simulation**: Run probabilistic scenarios
- **Tax-Optimized Withdrawals**: Smart withdrawal sequencing
- **Annual Reality Checks**: Compare projections vs. actuals
- **Scenario Comparison**: Test different retirement strategies
- **Healthcare Cost Modeling**: Plan for medical expenses
- **RMD Calculations**: Required minimum distribution tracking
- **Export Reports**: PDF retirement planning reports

## Contributing

This is a template for building retirement planning tools. Feel free to:
- Fork and customize for your needs
- Add new features
- Improve the calculation engine
- Enhance the UI/UX

## License

MIT License - feel free to use this as a starting point for your own projects.

## Support

For questions or issues:
1. Check the code comments in key files
2. Review the CLAUDE.md file for build instructions
3. Open an issue on GitHub

---

**Built with Next.js 15, Prisma, and TypeScript**
