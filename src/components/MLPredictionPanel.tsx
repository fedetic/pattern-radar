import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TrendingUp, TrendingDown, AlertTriangle, Target } from "lucide-react";

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

interface MLPredictionPanelProps {
  coinId: string;
  prediction?: MLPrediction;
  recommendation?: TradingRecommendation;
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
}

const MLPredictionPanel = ({
  coinId,
  prediction,
  recommendation,
  loading = false,
  error = null,
  onRefresh
}: MLPredictionPanelProps) => {
  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case "BUY": return "text-green-600 bg-green-50 border-green-200";
      case "SELL": return "text-red-600 bg-red-50 border-red-200";
      case "HOLD": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "LOW": return "text-green-600";
      case "MEDIUM": return "text-yellow-600";
      case "HIGH": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getMarketDirectionIcon = (direction: string) => {
    switch (direction) {
      case "bull": return <TrendingUp className="w-4 h-4 text-green-600" />;
      case "bear": return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <Target className="w-4 h-4 text-gray-600" />;
    }
  };

  const getCorrectionRiskColor = (probability: number) => {
    if (probability > 0.7) return "text-red-600";
    if (probability > 0.4) return "text-yellow-600";
    return "text-green-600";
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="animate-pulse bg-gray-300 h-4 w-32 rounded"></div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="animate-pulse bg-gray-300 h-20 rounded"></div>
            <div className="animate-pulse bg-gray-300 h-16 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!coinId || coinId.trim() === '') {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>ML Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Please select a trading pair to see ML predictions.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>ML Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="mb-4">
              {error}
            </AlertDescription>
          </Alert>
          
          {(error.includes('dependencies') || error.includes('ML models') || error.includes('train models')) && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">Setup Required</h4>
              <div className="text-sm text-blue-700 space-y-2">
                <p>To enable real ML predictions:</p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>Install dependencies: <code className="bg-blue-100 px-1 rounded">pip install -r pattern-data-ingest/requirements.txt</code></li>
                  <li>Ingest data: <code className="bg-blue-100 px-1 rounded">python scripts/ingest_multi_pairs.py --pair BTC/USD</code></li>
                  <li>Train models: <code className="bg-blue-100 px-1 rounded">python scripts/train_correction_model.py --pair BTC/USD</code></li>
                </ol>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  if (!prediction && !recommendation && !loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>ML Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              No ML predictions available. Check backend connection or try refreshing.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Trading Recommendation */}
      {recommendation && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Trading Recommendation</span>
              {onRefresh && (
                <button 
                  onClick={onRefresh}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Refresh
                </button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Main Recommendation */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge 
                  className={`px-4 py-2 text-lg font-bold ${getRecommendationColor(recommendation.recommendation)}`}
                >
                  {recommendation.recommendation}
                </Badge>
                <div className="text-sm text-gray-600">
                  <div>Confidence: {Math.round(recommendation.confidence * 100)}%</div>
                  <div className={`font-medium ${getRiskColor(recommendation.risk_level)}`}>
                    Risk: {recommendation.risk_level}
                  </div>
                </div>
              </div>
            </div>

            {/* Reasoning */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-700">{recommendation.reasoning}</p>
            </div>

            {/* Confidence Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Recommendation Confidence</span>
                <span>{Math.round(recommendation.confidence * 100)}%</span>
              </div>
              <Progress 
                value={recommendation.confidence * 100} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* ML Prediction Details */}
      {prediction && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              ML Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">

            {/* Market Direction */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getMarketDirectionIcon(prediction.market_direction)}
                <span className="font-medium">Market Direction</span>
              </div>
              <Badge variant="outline" className="capitalize">
                {prediction.market_direction}
              </Badge>
            </div>

            {/* Correction Risk */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Correction Risk (5d)</span>
                <span className={`text-sm font-bold ${getCorrectionRiskColor(prediction.correction_probability_5d)}`}>
                  {Math.round(prediction.correction_probability_5d * 100)}%
                </span>
              </div>
              <Progress 
                value={prediction.correction_probability_5d * 100} 
                className="h-2"
              />
              <div className="text-xs text-gray-500">
                Probability of &gt;5% correction in next 5 days
              </div>
            </div>

            {/* Bull Market Strength */}
            {prediction.market_direction === "bull" && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Bull Strength</span>
                  <span className="text-sm font-bold text-green-600">
                    {Math.round(prediction.bull_market_strength * 100)}%
                  </span>
                </div>
                <Progress 
                  value={prediction.bull_market_strength * 100} 
                  className="h-2"
                />
              </div>
            )}

            {/* Overall Confidence */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Prediction Confidence</span>
                <span className="text-sm font-bold">
                  {Math.round(prediction.confidence * 100)}%
                </span>
              </div>
              <Progress 
                value={prediction.confidence * 100} 
                className="h-2"
              />
            </div>

            {/* Additional Factors */}
            {recommendation?.factors && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium mb-2">Key Factors</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between">
                    <span>Pattern Strength:</span>
                    <span className="font-medium">{Math.round(recommendation.factors.pattern_strength)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Market Direction:</span>
                    <span className="font-medium capitalize">{recommendation.factors.market_direction}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Timestamp */}
            <div className="text-xs text-gray-500 mt-4">
              Last updated: {new Date(prediction.timestamp).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MLPredictionPanel;