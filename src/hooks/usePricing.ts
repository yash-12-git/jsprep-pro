"use client";

import { getPricingForCountry } from "@/lib/pricing";
import { useState, useEffect } from "react";

export interface PricingInfo {
  currency: string;
  amount: number;
  symbol: string;
  display: string;
  label: string; // e.g. "$9.99/mo"
  isLoading: boolean;
}

// Module-level cache — survives re-renders, cleared on page reload
let cached: PricingInfo | null = null;

const FALLBACK: PricingInfo = { ...getPricingForCountry("IN"), isLoading: false };

export function usePricing(): PricingInfo {
  const [pricing, setPricing] = useState<PricingInfo>(
    cached ?? { ...FALLBACK, isLoading: true },
  );

  useEffect(() => {
    // Already fetched this session — use cache
    if (cached) {
      setPricing(cached);
      return;
    }

    fetch("/api/pricing")
      .then(async (r) => {
        if (!r.ok) throw new Error(`pricing ${r.status}`);
        return r.json();
      })
      .then((data) => {
        const result: PricingInfo = {
          ...data,
          label: `${data.symbol}${data.display}/mo`,
          isLoading: false,
        };
        cached = result;
        setPricing(result);
      })
      .catch(() => {
        // On failure silently fall back to INR — never break the UI
        setPricing(FALLBACK);
      });
  }, []);

  return pricing;
}
