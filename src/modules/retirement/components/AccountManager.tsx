"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

interface FinancialAccount {
  id: string;
  name: string;
  accountType: string;
  currentBalance: number;
  annualReturnRate: number;
}

export function AccountManager() {
  const [accounts, setAccounts] = useState<FinancialAccount[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    accountType: "TAXABLE_BROKERAGE",
    currentBalance: 0,
    annualReturnRate: 0.07,
  });

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await fetch("/api/accounts");
      if (response.ok) {
        const data = await response.json();
        setAccounts(data);
      }
    } catch (error) {
      console.error("Failed to fetch accounts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchAccounts();
        setShowForm(false);
        setFormData({
          name: "",
          accountType: "TAXABLE_BROKERAGE",
          currentBalance: 0,
          annualReturnRate: 0.07,
        });
      }
    } catch (error) {
      console.error("Failed to create account:", error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const accountTypeLabels: Record<string, string> = {
    TAXABLE_BROKERAGE: "Taxable Brokerage",
    TRADITIONAL_401K: "Traditional 401(k)",
    TRADITIONAL_IRA: "Traditional IRA",
    ROTH_401K: "Roth 401(k)",
    ROTH_IRA: "Roth IRA",
    HSA: "Health Savings Account",
    PENSION: "Pension",
    SOCIAL_SECURITY: "Social Security",
  };

  if (loading) {
    return <div className="text-center py-8">Loading accounts...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Financial Accounts</h2>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "+ Add Account"}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded-lg bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Vanguard 401(k)"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
              <Select
                value={formData.accountType}
                onChange={(e) => setFormData({ ...formData, accountType: e.target.value })}
              >
                {Object.entries(accountTypeLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Balance ($)
              </label>
              <Input
                type="number"
                value={formData.currentBalance}
                onChange={(e) =>
                  setFormData({ ...formData, currentBalance: parseFloat(e.target.value) })
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Annual Return Rate (%)
              </label>
              <Input
                type="number"
                step="0.1"
                value={formData.annualReturnRate * 100}
                onChange={(e) =>
                  setFormData({ ...formData, annualReturnRate: parseFloat(e.target.value) / 100 })
                }
                required
              />
            </div>
          </div>

          <Button type="submit" className="mt-4">
            Add Account
          </Button>
        </form>
      )}

      <div className="space-y-4">
        {accounts.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No accounts yet. Add your first account to get started!
          </p>
        ) : (
          accounts.map((account) => (
            <div key={account.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">{account.name}</h3>
                  <p className="text-sm text-gray-600">
                    {accountTypeLabels[account.accountType] || account.accountType}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(account.currentBalance)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {(account.annualReturnRate * 100).toFixed(1)}% return
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
