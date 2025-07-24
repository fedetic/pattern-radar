import { useState, useEffect, useCallback } from 'react';

interface MLPrediction {
  coin_id: string;
  timestamp: string;
  correction_probability_5d: number;
  market_direction: "bull" | "bear" | "sideways";
  bull_market_strength: number;
  confidence: number;
  prediction_horizon: string;
  model_available: boolean;
  message?: string;
}

interface TradingRecommendation {
  coin_id: string;
  timestamp: string;
  recommendation: "BUY" | "SELL" | "HOLD";
  confidence: number;
  reasoning: string;
  risk_level: "LOW" | "MEDIUM" | "HIGH";
  ml_prediction: MLPrediction;
  pattern_strength: number;
  factors: {
    correction_probability: number;
    market_direction: string;
    pattern_strength: number;
    overall_confidence: number;
  };
}

interface UseMLPredictionsReturn {
  prediction: MLPrediction | null;
  recommendation: TradingRecommendation | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const API_BASE_URL = 'http://localhost:8000';

export const useMLPredictions = (coinId: string, days: number = 30): UseMLPredictionsReturn => {
  const [prediction, setPrediction] = useState<MLPrediction | null>(null);
  const [recommendation, setRecommendation] = useState<TradingRecommendation | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPredictions = useCallback(async () => {
    if (!coinId || coinId.trim() === '') {
      setPrediction(null);
      setRecommendation(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch both prediction and recommendation in parallel
      const [predictionResponse, recommendationResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/predictions/${coinId}?days=${days}`),
        fetch(`${API_BASE_URL}/recommendations/${coinId}?days=${days}&include_patterns=true`)
      ]);

      let predictionError: string | null = null;
      let recommendationError: string | null = null;

      // Handle prediction response
      if (predictionResponse.ok) {
        const predictionData = await predictionResponse.json();
        setPrediction(predictionData);
      } else {
        const errorData = await predictionResponse.json().catch(() => null);
        if (predictionResponse.status === 503) {
          predictionError = errorData?.detail || 'ML models not available. Please train models first.';
        } else if (predictionResponse.status === 404) {
          predictionError = errorData?.detail || 'No market data found for this coin.';
        } else {
          predictionError = errorData?.detail || 'Failed to fetch ML prediction.';
        }
        console.error('Failed to fetch prediction:', predictionResponse.statusText);
      }

      // Handle recommendation response
      if (recommendationResponse.ok) {
        const recommendationData = await recommendationResponse.json();
        setRecommendation(recommendationData);
      } else {
        const errorData = await recommendationResponse.json().catch(() => null);
        if (recommendationResponse.status === 503) {
          recommendationError = errorData?.detail || 'ML models not available. Please train models first.';
        } else if (recommendationResponse.status === 404) {
          recommendationError = errorData?.detail || 'No market data found for this coin.';
        } else {
          recommendationError = errorData?.detail || 'Failed to fetch ML recommendation.';
        }
        console.error('Failed to fetch recommendation:', recommendationResponse.statusText);
      }

      // Set appropriate error message
      if (predictionError && recommendationError) {
        // Both failed - use the more specific error (503 takes precedence)
        if (predictionError.includes('ML models') || recommendationError.includes('ML models')) {
          setError('ML models not available. Please install dependencies and train models.');
        } else {
          setError('Failed to fetch ML predictions and recommendations.');
        }
      } else if (predictionError) {
        setError(predictionError);
      } else if (recommendationError) {
        setError(recommendationError);
      }

    } catch (err) {
      console.error('Error fetching ML predictions:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching predictions');
    } finally {
      setLoading(false);
    }
  }, [coinId, days]);

  const refetch = useCallback(() => {
    fetchPredictions();
  }, [fetchPredictions]);

  useEffect(() => {
    fetchPredictions();
  }, [fetchPredictions]);

  return {
    prediction,
    recommendation,
    loading,
    error,
    refetch
  };
};

export default useMLPredictions;