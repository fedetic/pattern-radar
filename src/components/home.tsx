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
  const [tradingPairs, setTradingPairs] = useState<{ value: string; label: string; coin_id: string }[]>([]);
  const [selectedPair, setSelectedPair] = useState<string>("");
  const [selectedTimeframe, setSelectedTimeframe] = useState(timeframes[2].value);
  const [selectedPattern, setSelectedPattern] = useState<string | null>(null);
  const [loadingPairs, setLoadingPairs] = useState(true);
  const [errorPairs, setErrorPairs] = useState<string | null>(null);
  const [patterns, setPatterns] = useState<any[]>([]);
  const [marketData, setMarketData] = useState<any[]>([]);
  const [marketInfo, setMarketInfo] = useState<any>(null);
  const [loadingPatterns, setLoadingPatterns] = useState(false);

  useEffect(() => {
    setLoadingPairs(true);
    fetch("http://127.0.0.1:8000/pairs")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch trading pairs");
        return res.json();
      })
      .then((data) => {
        const pairs = data.map((pair: any) => ({
          value: pair.coin_id || pair.symbol || pair.value,
          label: pair.label || pair.symbol || pair.value,
          coin_id: pair.coin_id || pair.symbol,
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

  // Fetch patterns when pair or timeframe changes
  useEffect(() => {
    if (!selectedPair) return;

    setLoadingPatterns(true);
    const coinId = selectedPair;
    const days = selectedTimeframe === "1h" ? 30 : selectedTimeframe === "4h" ? 90 : selectedTimeframe === "1d" ? 365 : selectedTimeframe === "1w" ? 720 : 1095;

    fetch(`http://127.0.0.1:8000/patterns/${coinId}?days=${days}&timeframe=${selectedTimeframe}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch patterns");
        return res.json();
      })
      .then((data) => {
        setPatterns(data.patterns || []);
        setMarketData(data.market_data || []);
        setMarketInfo(data.market_info || null);
        // Auto-select strongest pattern
        if (data.strongest_pattern) {
          setSelectedPattern(data.strongest_pattern.name);
        }
        setLoadingPatterns(false);
      })
      .catch((err) => {
        console.error("Error fetching patterns:", err);
        setPatterns([]);
        setMarketData([]);
        setLoadingPatterns(false);
      });
  }, [selectedPair, selectedTimeframe]);


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
                onTimeframeChange={setSelectedTimeframe}
                marketData={marketData}
                marketInfo={marketInfo}
                patterns={patterns}
                selectedPattern={selectedPattern}
                onPatternSelect={handlePatternSelect}
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
              {loadingPatterns ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-muted-foreground">Analyzing patterns...</div>
                </div>
              ) : (
                <PatternAnalysisPanel
                  patterns={patterns.map(pattern => ({
                    id: pattern.name,
                    name: pattern.name,
                    category: pattern.category,
                    strength: pattern.confidence,
                    description: pattern.description,
                    timeframe: selectedTimeframe
                  }))}
                  onPatternSelect={handlePatternSelect}
                  selectedPatternId={selectedPattern}
                />
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;
