import { useState, useEffect, useCallback } from 'react';

export interface Pattern {
  id: string;
  name: string;
  category: string;
  confidence: number;
  direction: string;
  description: string;
  coordinates?: any;
  timestamp?: string;
}

export interface PatternData {
  patterns: Pattern[];
  marketData: any[];
  marketInfo: any;
  strongestPattern?: Pattern;
}

interface UsePatternDataReturn {
  patternData: PatternData | null;
  loading: boolean;
  error: string | null;
  fetchPatterns: (coinId: string, timeframe: string, days?: number) => Promise<void>;
  fetchFilteredPatterns: (coinId: string, startTime: string, endTime: string, timeframe: string) => Promise<void>;
}

export const usePatternData = (): UsePatternDataReturn => {
  const [patternData, setPatternData] = useState<PatternData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPatterns = useCallback(async (
    coinId: string, 
    timeframe: string, 
    days: number = 30
  ) => {
    if (!coinId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/patterns/${coinId}?days=${days}&timeframe=${timeframe}`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch patterns: ${response.status}`);
      }

      const data = await response.json();
      
      setPatternData({
        patterns: data.patterns || [],
        marketData: data.market_data || [],
        marketInfo: data.market_info || null,
        strongestPattern: data.strongest_pattern || null
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      setPatternData({ patterns: [], marketData: [], marketInfo: null });
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchFilteredPatterns = useCallback(async (
    coinId: string,
    startTime: string,
    endTime: string,
    timeframe: string
  ) => {
    if (!coinId) return;

    setLoading(true);
    setError(null);

    try {
      const url = `http://127.0.0.1:8000/patterns/${coinId}/filtered?start_time=${encodeURIComponent(startTime)}&end_time=${encodeURIComponent(endTime)}&timeframe=${timeframe}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch filtered patterns: ${response.status}`);
      }

      const data = await response.json();
      
      setPatternData({
        patterns: data.patterns || [],
        marketData: data.market_data || [],
        marketInfo: data.market_info || null,
        strongestPattern: data.strongest_pattern || null
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error fetching filtered patterns:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    patternData,
    loading,
    error,
    fetchPatterns,
    fetchFilteredPatterns
  };
};