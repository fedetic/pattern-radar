import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Activity, BarChart3, Zap } from "lucide-react";
import ChartDisplay from "./ChartDisplay";
import PatternAnalysisPanel from "./PatternAnalysisPanel";

const timeframes = [
  { value: "1h", label: "1H" },
  { value: "4h", label: "4H" },
  { value: "1d", label: "1D" },
  { value: "1w", label: "1W" },
  { value: "1m", label: "1M" },
];

const Home = () => {
  const [tradingPairs, setTradingPairs] = useState<{ value: string; label: string }[]>([]);
  const [selectedPair, setSelectedPair] = useState<string>("");
  const [selectedTimeframe, setSelectedTimeframe] = useState(timeframes[2].value);
  const [selectedPattern, setSelectedPattern] = useState<string | null>(null);
  const [loadingPairs, setLoadingPairs] = useState(true);
  const [errorPairs, setErrorPairs] = useState<string | null>(null);

  useEffect(() => {
    setLoadingPairs(true);
    fetch("http://127.0.0.1:8000/pairs")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch trading pairs");
        return res.json();
      })
      .then((data) => {
        // Expecting data to be an array of { symbol, label } or similar
        const pairs = data.map((pair: any) => ({
          value: pair.symbol || pair.value,
          label: pair.label || pair.symbol || pair.value,
        }));
        setTradingPairs(pairs);
        setSelectedPair(pairs[0]?.value || "");
        setLoadingPairs(false);
      })
      .catch((err) => {
        setErrorPairs(err.message || "Error fetching trading pairs");
        setLoadingPairs(false);
      });
  }, []);

  // Mock data for patterns - in a real app this would come from the API
  const mockPatterns = [
    {
      id: "c1",
      name: "Head and Shoulders",
      category: "Chart" as const,
      strength: 87,
      description: "Bearish reversal pattern",
      timeframe: "1d",
    },
    {
      id: "c2",
      name: "Double Bottom",
      category: "Chart" as const,
      strength: 75,
      description: "Bullish reversal pattern",
      timeframe: "1d",
    },
    {
      id: "ca1",
      name: "Hammer",
      category: "Candle" as const,
      strength: 92,
      description: "Bullish reversal candle",
      timeframe: "4h",
    },
    {
      id: "ca2",
      name: "Shooting Star",
      category: "Candle" as const,
      strength: 68,
      description: "Bearish reversal candle",
      timeframe: "4h",
    },
    {
      id: "v1",
      name: "Volume Climax",
      category: "Volume-Based" as const,
      strength: 81,
      description: "Exhaustion move",
      timeframe: "1d",
    },
    {
      id: "v2",
      name: "Volume Divergence",
      category: "Volume-Based" as const,
      strength: 73,
      description: "Trend weakness",
      timeframe: "4h",
    },
    {
      id: "p1",
      name: "Breakout",
      category: "Price Action" as const,
      strength: 89,
      description: "Price breaking resistance",
      timeframe: "1h",
    },
    {
      id: "p2",
      name: "Support Test",
      category: "Price Action" as const,
      strength: 65,
      description: "Price testing support level",
      timeframe: "1h",
    },
    {
      id: "h1",
      name: "Gartley",
      category: "Harmonic" as const,
      strength: 78,
      description: "Harmonic reversal pattern",
      timeframe: "1d",
    },
    {
      id: "h2",
      name: "Butterfly",
      category: "Harmonic" as const,
      strength: 71,
      description: "Harmonic extension pattern",
      timeframe: "1d",
    },
    {
      id: "s1",
      name: "Mean Reversion",
      category: "Statistical" as const,
      strength: 83,
      description: "Price returning to average",
      timeframe: "4h",
    },
    {
      id: "s2",
      name: "Momentum Shift",
      category: "Statistical" as const,
      strength: 76,
      description: "Change in price momentum",
      timeframe: "4h",
    },
  ];

  const handlePatternSelect = (patternId: string) => {
    setSelectedPattern(patternId === selectedPattern ? null : patternId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95 p-4 lg:p-6">
      <div className="container mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/5 rounded-2xl blur-3xl" />
          <div className="relative trading-card p-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <h1 className="text-3xl lg:text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    Pattern Analyzer
                  </h1>
                </div>
                <p className="text-muted-foreground text-lg">
                  Advanced crypto pattern detection and analysis platform
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Activity className="h-4 w-4 text-green-400" />
                    <span>Live Data</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BarChart3 className="h-4 w-4 text-blue-400" />
                    <span>Real-time Analysis</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap className="h-4 w-4 text-yellow-400" />
                    <span>AI Powered</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {loadingPairs ? (
                  <div className="text-muted-foreground">Loading pairs...</div>
                ) : errorPairs ? (
                  <div className="text-red-500">{errorPairs}</div>
                ) : (
                  <Select value={selectedPair} onValueChange={setSelectedPair} disabled={tradingPairs.length === 0}>
                    <SelectTrigger className="w-[200px] bg-background/50 border-border/50 backdrop-blur-sm">
                      <SelectValue placeholder="Select trading pair" />
                    </SelectTrigger>
                    <SelectContent>
                      {tradingPairs.map((pair) => (
                        <SelectItem key={pair.value} value={pair.value}>
                          {pair.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Chart Section - Takes up 3/4 of the space on xl screens */}
          <div className="xl:col-span-3 space-y-6">
            <div className="trading-card p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">
                      {selectedPair.replace("-", "/")}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Live Price Chart
                    </p>
                  </div>
                </div>
                <Tabs
                  value={selectedTimeframe}
                  onValueChange={setSelectedTimeframe}
                  className="w-auto"
                >
                  <TabsList className="bg-background/50 border border-border/50">
                    {timeframes.map((timeframe) => (
                      <TabsTrigger
                        key={timeframe.value}
                        value={timeframe.value}
                        className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                      >
                        {timeframe.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>
              <ChartDisplay
                tradingPair={selectedPair}
                timeframe={selectedTimeframe}
              />
            </div>
          </div>

          {/* Pattern Analysis Panel - Takes up 1/4 of the space on xl screens */}
          <div className="xl:col-span-1">
            <div className="trading-card p-6 h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <Activity className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Pattern Analysis</h2>
                  <p className="text-sm text-muted-foreground">
                    Detected patterns
                  </p>
                </div>
              </div>
              <PatternAnalysisPanel
                patterns={mockPatterns}
                onPatternSelect={handlePatternSelect}
                selectedPatternId={selectedPattern}
              />
            </div>
          </div>
        </div>

        {/* Pattern Categories Legend */}
        <div className="trading-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Pattern Categories</h2>
              <p className="text-sm text-muted-foreground">
                Available pattern types for analysis
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <Badge
              variant="outline"
              className="justify-center py-2 bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20 transition-colors"
            >
              Chart Patterns
            </Badge>
            <Badge
              variant="outline"
              className="justify-center py-2 bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20 transition-colors"
            >
              Candle Patterns
            </Badge>
            <Badge
              variant="outline"
              className="justify-center py-2 bg-purple-500/10 border-purple-500/30 text-purple-400 hover:bg-purple-500/20 transition-colors"
            >
              Volume-Based
            </Badge>
            <Badge
              variant="outline"
              className="justify-center py-2 bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20 transition-colors"
            >
              Price Action
            </Badge>
            <Badge
              variant="outline"
              className="justify-center py-2 bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20 transition-colors"
            >
              Harmonic
            </Badge>
            <Badge
              variant="outline"
              className="justify-center py-2 bg-cyan-500/10 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 transition-colors"
            >
              Statistical
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
