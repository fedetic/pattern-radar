import { useState, useEffect } from 'react';

export interface TradingPair {
  value: string;
  label: string;
  coin_id: string;
  name?: string;
  symbol?: string;
}

interface UseTradingPairsReturn {
  tradingPairs: TradingPair[];
  loading: boolean;
  error: string | null;
  selectedPair: string;
  setSelectedPair: (pair: string) => void;
}

export const useTradingPairs = (): UseTradingPairsReturn => {
  const [tradingPairs, setTradingPairs] = useState<TradingPair[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPair, setSelectedPair] = useState<string>("");

  useEffect(() => {
    const fetchTradingPairs = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("http://127.0.0.1:8000/pairs");
        
        if (!response.ok) {
          throw new Error("Failed to fetch trading pairs");
        }

        const data = await response.json();
        
        const pairs: TradingPair[] = data.map((pair: any) => ({
          value: pair.coin_id || pair.symbol || pair.value,
          label: pair.label || pair.symbol || pair.value,
          coin_id: pair.coin_id || pair.symbol,
          name: pair.name,
          symbol: pair.symbol
        }));

        setTradingPairs(pairs);
        
        // Auto-select first pair if none selected
        if (pairs.length > 0 && !selectedPair) {
          setSelectedPair(pairs[0].value);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Error fetching trading pairs";
        setError(errorMessage);
        console.error("Error fetching trading pairs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTradingPairs();
  }, [selectedPair]);

  return {
    tradingPairs,
    loading,
    error,
    selectedPair,
    setSelectedPair
  };
};