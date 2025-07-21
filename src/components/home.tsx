import React, { useState, useEffect, useMemo } from "react";
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
import { filterVisualizablePatterns } from "../utils/patternUtils";

const timeframes = [
  { value: "1h", label: "1H" },
  { value: "4h", label: "4H" },
  { value: "1d", label: "1D" },
];

const Home = () => {
  const [tradingPairs, setTradingPairs] = useState<{ value: string; label: string; coin_id: string }[]>([]);
  const [selectedPair, setSelectedPair] = useState<string>("");
  const [selectedTimeframe, setSelectedTimeframe] = useState("1d");
  const [selectedPattern, setSelectedPattern] = useState<string | null>(null);
  const [loadingPairs, setLoadingPairs] = useState(true);
  const [errorPairs, setErrorPairs] = useState<string | null>(null);
  const [patterns, setPatterns] = useState<any[]>([]);
  const [marketData, setMarketData] = useState<any[]>([]);
  const [marketInfo, setMarketInfo] = useState<any>(null);
  const [loadingPatterns, setLoadingPatterns] = useState(false);
  const [showFullHistory, setShowFullHistory] = useState(false);

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
    const days = selectedTimeframe === "1h" ? 7 : selectedTimeframe === "4h" ? 30 : selectedTimeframe === "1d" ? 365 : 365;

    fetch(`http://127.0.0.1:8000/patterns/${coinId}?days=${days}&timeframe=${selectedTimeframe}&full_history=${showFullHistory}`)
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
  }, [selectedPair, selectedTimeframe, showFullHistory]);


  // Filter patterns to only include visualizable ones using unified utility
  const visualizablePatterns = useMemo(() => {
    console.log('Filtering patterns in home.tsx:', {
      totalPatterns: patterns.length,
      patternNames: patterns.map(p => p.name)
    });
    
    // Special logging for harmonic patterns
    const harmonicPatterns = patterns.filter(p => p.category === 'Harmonic' || 
      (p.coordinates && p.coordinates.type === 'harmonic_pattern'));
    
    if (harmonicPatterns.length > 0) {
      console.log('🎵 HARMONIC PATTERNS DEBUG - Raw patterns:', harmonicPatterns.map(p => ({
        name: p.name,
        category: p.category,
        hasCoordinates: !!p.coordinates,
        coordinateType: p.coordinates?.type,
        pointsCount: p.coordinates?.points?.length,
        points: p.coordinates?.points?.map(pt => ({
          hasTimestamp: !!pt.timestamp,
          hasPrice: pt.price !== undefined,
          hasLabel: !!pt.label
        }))
      })));
    }
    
    const filtered = filterVisualizablePatterns(patterns);
    
    const filteredHarmonics = filtered.filter(p => p.category === 'Harmonic' || 
      (p.coordinates && p.coordinates.type === 'harmonic_pattern'));
    
    console.log('Filtered patterns in home.tsx:', {
      visualizableCount: filtered.length,
      visualizableNames: filtered.map(p => p.name),
      harmonicCountBefore: harmonicPatterns.length,
      harmonicCountAfter: filteredHarmonics.length,
      filteredHarmonicNames: filteredHarmonics.map(p => p.name)
    });
    
    if (harmonicPatterns.length > filteredHarmonics.length) {
      console.warn('🎵 HARMONIC PATTERNS FILTERED OUT:', 
        harmonicPatterns.filter(p => !filteredHarmonics.find(f => f.name === p.name))
          .map(p => ({ name: p.name, reason: 'Failed isPatternVisualizable check' }))
      );
    }
    
    return filtered;
  }, [patterns]);

  const handlePatternSelect = (patternId: string) => {
    const newSelection = patternId === selectedPattern ? null : patternId;
    console.log('🎯 PATTERN SELECTION CHANGE:', {
      from: selectedPattern,
      to: newSelection,
      patternId,
      action: newSelection ? 'select' : 'deselect'
    });
    setSelectedPattern(newSelection);
  };

  const handleZoomPatternUpdate = async (startTime: string, endTime: string) => {
    if (!selectedPair) return;
    
    try {
      // Step 1: Reset patterns immediately to show user that analysis is restarting
      setPatterns([]);
      setSelectedPattern(null);
      setLoadingPatterns(true);
      
      const coinId = selectedPair;
      
      // Step 2: Call the filtered patterns endpoint for the new timeframe
      const url = `http://127.0.0.1:8000/patterns/${coinId}/filtered?start_time=${encodeURIComponent(startTime)}&end_time=${encodeURIComponent(endTime)}&timeframe=${selectedTimeframe}&full_history=${showFullHistory}`;
      
      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        
        // Step 3: Update with new patterns found in the selected timeframe
        const newPatterns = data.patterns || [];
        setPatterns(newPatterns);
        
        // Step 4: Auto-select strongest pattern if available, otherwise keep selection clear
        if (data.strongest_pattern && newPatterns.length > 0) {
          setSelectedPattern(data.strongest_pattern.name);
        }
        
        // Log the pattern reset and new scan for debugging
        console.log(`Pattern scan completed for timeframe ${startTime} to ${endTime}: found ${newPatterns.length} patterns`);
      } else {
        console.warn('Failed to fetch filtered patterns:', response.status);
        // Keep patterns empty on error to show that scan failed
        setPatterns([]);
      }
    } catch (error) {
      console.error('Error fetching filtered patterns:', error);
      // Reset to empty patterns on error
      setPatterns([]);
    } finally {
      setLoadingPatterns(false);
    }
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
                <button
                  className={`px-3 py-2 rounded border text-sm font-medium transition-colors ${showFullHistory ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-border text-muted-foreground hover:bg-muted'}`}
                  onClick={() => setShowFullHistory((v) => !v)}
                >
                  {showFullHistory ? 'Show Recent Only' : 'Show Full History'}
                </button>
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
              </div>
              <ChartDisplay
                tradingPair={selectedPair}
                timeframe={selectedTimeframe}
                onTimeframeChange={setSelectedTimeframe}
                marketData={marketData}
                marketInfo={marketInfo}
                patterns={visualizablePatterns}
                selectedPattern={selectedPattern}
                onPatternSelect={handlePatternSelect}
                onZoomPatternUpdate={handleZoomPatternUpdate}
                loadingPatterns={loadingPatterns}
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
                  patterns={visualizablePatterns.map(pattern => ({
                    id: pattern.name, // Use pattern.name as ID for consistency
                    name: pattern.name,
                    category: pattern.category as "Chart" | "Candle" | "Volume-Based" | "Price Action" | "Harmonic" | "Statistical",
                    strength: pattern.confidence,
                    description: pattern.description,
                    timeframe: selectedTimeframe
                  }))}
                  onPatternSelect={(patternId) => {
                    // Ensure patternId matches the pattern name for chart lookup
                    const newSelection = patternId === selectedPattern ? null : patternId;
                    console.log('📋 PATTERN PANEL SELECTION:', {
                      patternId,
                      from: selectedPattern,
                      to: newSelection,
                      action: newSelection ? 'select' : 'deselect'
                    });
                    setSelectedPattern(newSelection);
                  }}
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
