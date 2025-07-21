import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, Activity, BarChart3, Zap } from "lucide-react";
import ChartDisplayRefactored from "./ChartDisplayRefactored";
import PatternAnalysisPanel from "./PatternAnalysisPanel";
import { useTradingPairs } from "../hooks/useTradingPairs";
import { usePatternData } from "../hooks/usePatternData";

const Home = () => {
  const {
    tradingPairs,
    loading: loadingPairs,
    error: errorPairs,
    selectedPair,
    setSelectedPair
  } = useTradingPairs();

  const {
    patternData,
    loading: loadingPatterns,
    error: errorPatterns,
    fetchPatterns,
    fetchFilteredPatterns
  } = usePatternData();

  const [selectedTimeframe, setSelectedTimeframe] = React.useState("1d");
  const [selectedPattern, setSelectedPattern] = React.useState<string | null>(null);

  // Fetch patterns when pair or timeframe changes
  useEffect(() => {
    if (!selectedPair) return;

    const days = selectedTimeframe === "1h" ? 7 : 
                 selectedTimeframe === "4h" ? 30 : 
                 selectedTimeframe === "1d" ? 365 : 365;

    fetchPatterns(selectedPair, selectedTimeframe, days);
  }, [selectedPair, selectedTimeframe, fetchPatterns]);

  // Auto-select strongest pattern when patterns load
  useEffect(() => {
    if (patternData?.strongestPattern) {
      setSelectedPattern(patternData.strongestPattern.name);
    } else {
      setSelectedPattern(null);
    }
  }, [patternData?.strongestPattern]);

  const handlePatternSelect = (patternId: string) => {
    setSelectedPattern(patternId === selectedPattern ? null : patternId);
  };

  const handleZoomPatternUpdate = async (startTime: string, endTime: string) => {
    if (!selectedPair) return;
    
    console.log(`Pattern scan for timeframe ${startTime} to ${endTime}`);
    await fetchFilteredPatterns(selectedPair, startTime, endTime, selectedTimeframe);
  };

  // Transform patterns for PatternAnalysisPanel
  const transformedPatterns = patternData?.patterns.map(pattern => ({
    id: pattern.name,
    name: pattern.name,
    category: pattern.category as any,
    strength: pattern.confidence,
    description: pattern.description,
    timeframe: selectedTimeframe
  })) || [];

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
                  <Select 
                    value={selectedPair} 
                    onValueChange={setSelectedPair} 
                    disabled={tradingPairs.length === 0}
                  >
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

        {/* Error Display */}
        {errorPatterns && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <div className="text-red-400 font-semibold">Error Loading Patterns</div>
            <div className="text-red-300 text-sm">{errorPatterns}</div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Chart Section */}
          <div className="xl:col-span-3 space-y-6">
            <div className="trading-card p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">
                      {selectedPair ? selectedPair.replace("-", "/") : "Select Pair"}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Live Price Chart
                    </p>
                  </div>
                </div>
              </div>
              
              <ChartDisplayRefactored
                tradingPair={selectedPair}
                timeframe={selectedTimeframe}
                onTimeframeChange={setSelectedTimeframe}
                marketData={patternData?.marketData || []}
                marketInfo={patternData?.marketInfo}
                patterns={patternData?.patterns || []}
                selectedPattern={selectedPattern}
                onPatternSelect={handlePatternSelect}
                onZoomPatternUpdate={handleZoomPatternUpdate}
                loadingPatterns={loadingPatterns}
              />
            </div>
          </div>

          {/* Pattern Analysis Panel */}
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
                  patterns={transformedPatterns}
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