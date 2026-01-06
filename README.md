# RetireRight - Retirement Year & Cash-Flow Planner

A comprehensive SaaS retirement calculator that determines when you can retire based on your financial data.

## 🚀 Quick Start - Demo Mode

**Want to see it working right now?** No database, no auth setup required!

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000)

👉 **See [DEMO_README.md](./DEMO_README.md) for full demo instructions**

The homepage shows a fully functional retirement calculator with sample data. Switch between two scenarios to see the calculator in action!

## 📚 Documentation

- **[DEMO_README.md](./DEMO_README.md)** - Start here! Demo version with no setup required
- **[RETIREMENT_SETUP.md](./RETIREMENT_SETUP.md)** - Full production setup guide (database, auth, Stripe)
- **[CLAUDE.md](./CLAUDE.md)** - Original build specification and architecture

## ✨ What It Does

RetireRight calculates:
- **Retirement Year**: When can you retire?
- **Portfolio Growth**: How will your investments grow?
- **Income vs Spending**: Will you have enough?
- **Year-by-Year**: Detailed projections through retirement

### Features

- 📊 **Multiple Account Types**: 401(k), IRA, Roth, HSA, Taxable, etc.
- 💰 **Flexible Contributions**: Monthly/yearly with growth modeling
- 📈 **Interactive Charts**: Visualize your retirement journey
- 🎯 **One-Time Events**: Model house purchases, inheritance, etc.
- 💵 **Social Security**: Include pension and Social Security benefits
- 🔄 **Scenario Comparison**: Test different retirement strategies

## 🛠 Tech Stack

- **Next.js 15** (App Router)
- **TypeScript** (strict mode)
- **Tailwind CSS** + Framer Motion
- **Recharts** for visualizations
- **Prisma** + PostgreSQL (when ready)
- **NextAuth.js** (when ready)
- **Stripe** (when ready)

## 🚦 Current Status

**✅ Demo Mode (No Setup)**
- Retirement calculator fully functional
- Two sample scenarios included
- Interactive UI with charts and tables
- Works immediately with \`npm run dev\`

**🔧 Production Ready (Requires Setup)**
- Database schema defined
- API routes implemented
- Auth infrastructure in place
- Stripe integration ready
- Just needs environment variables

---

**Ready to plan your retirement?** Start with the demo, then go production when you're ready! 🚀
