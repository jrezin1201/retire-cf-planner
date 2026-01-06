"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { YearProjection } from "@/lib/types/calculator";

interface PortfolioChartProps {
  projections: YearProjection[];
}

export function PortfolioChart({ projections }: PortfolioChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
      notation: "compact",
    }).format(value);
  };

  // Sample every few years for cleaner chart
  const chartData = projections.filter((_, idx) => idx % 2 === 0).map((p) => ({
    year: p.year,
    portfolio: p.portfolioValue,
    spending: p.inflationAdjustedSpending,
    income: p.afterTaxIncome,
  }));

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Portfolio Growth Over Time</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis tickFormatter={formatCurrency} />
          <Tooltip
            formatter={(value) => formatCurrency(value as number)}
            labelStyle={{ color: "#000" }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="portfolio"
            stroke="#3b82f6"
            strokeWidth={2}
            name="Portfolio Value"
          />
          <Line
            type="monotone"
            dataKey="income"
            stroke="#10b981"
            strokeWidth={2}
            name="Retirement Income"
          />
          <Line
            type="monotone"
            dataKey="spending"
            stroke="#ef4444"
            strokeWidth={2}
            name="Spending Target"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
