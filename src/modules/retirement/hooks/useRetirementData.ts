"use client";

import { useState, useEffect } from "react";
import type { RetirementResult } from "@/lib/types/calculator";

export function useRetirementData() {
  const [result, setResult] = useState<RetirementResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResults = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/calculate");
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to calculate retirement");
      }
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  return { result, loading, error, refetch: fetchResults };
}
