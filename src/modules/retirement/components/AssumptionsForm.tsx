"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface Assumptions {
  annualSpendingTarget: number;
  inflationRate: number;
  retirementTaxRate: number;
  withdrawalRate: number;
  retirementGrowthRate: number;
  currentAge: number;
  desiredRetirementAge?: number | null;
  lifeExpectancy?: number;
  investmentFeeRate: number;
}

interface AssumptionsFormProps {
  initialData?: Assumptions;
  onSave?: () => void;
}

export function AssumptionsForm({ initialData, onSave }: AssumptionsFormProps) {
  const [formData, setFormData] = useState<Assumptions>(
    initialData || {
      annualSpendingTarget: 50000,
      inflationRate: 0.025,
      retirementTaxRate: 0.2,
      withdrawalRate: 0.04,
      retirementGrowthRate: 0.02,
      currentAge: 30,
      desiredRetirementAge: null,
      lifeExpectancy: 90,
      investmentFeeRate: 0.005,
    }
  );
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/assumptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to save assumptions");
      }

      setMessage("Assumptions saved successfully!");
      onSave?.();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: keyof Assumptions, value: number | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-900">Retirement Assumptions</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Annual Spending Target ($)
          </label>
          <Input
            type="number"
            value={formData.annualSpendingTarget}
            onChange={(e) => updateField("annualSpendingTarget", parseFloat(e.target.value))}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Age
          </label>
          <Input
            type="number"
            value={formData.currentAge}
            onChange={(e) => updateField("currentAge", parseInt(e.target.value))}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Desired Retirement Age (optional)
          </label>
          <Input
            type="number"
            value={formData.desiredRetirementAge || ""}
            onChange={(e) =>
              updateField("desiredRetirementAge", e.target.value ? parseInt(e.target.value) : null)
            }
            placeholder="Auto-calculate"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Life Expectancy
          </label>
          <Input
            type="number"
            value={formData.lifeExpectancy}
            onChange={(e) => updateField("lifeExpectancy", parseInt(e.target.value))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Inflation Rate (%)
          </label>
          <Input
            type="number"
            step="0.1"
            value={formData.inflationRate * 100}
            onChange={(e) => updateField("inflationRate", parseFloat(e.target.value) / 100)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Retirement Tax Rate (%)
          </label>
          <Input
            type="number"
            step="1"
            value={formData.retirementTaxRate * 100}
            onChange={(e) => updateField("retirementTaxRate", parseFloat(e.target.value) / 100)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Withdrawal Rate (%)
          </label>
          <Input
            type="number"
            step="0.1"
            value={formData.withdrawalRate * 100}
            onChange={(e) => updateField("withdrawalRate", parseFloat(e.target.value) / 100)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Retirement Growth Rate (%)
          </label>
          <Input
            type="number"
            step="0.1"
            value={formData.retirementGrowthRate * 100}
            onChange={(e) => updateField("retirementGrowthRate", parseFloat(e.target.value) / 100)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Investment Fee Rate (%)
          </label>
          <Input
            type="number"
            step="0.1"
            value={formData.investmentFeeRate * 100}
            onChange={(e) => updateField("investmentFeeRate", parseFloat(e.target.value) / 100)}
            required
          />
        </div>
      </div>

      {message && (
        <div
          className={`p-4 rounded ${
            message.includes("success") ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
          }`}
        >
          {message}
        </div>
      )}

      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save Assumptions"}
      </Button>
    </form>
  );
}
