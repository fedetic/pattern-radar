import React, { useMemo, useCallback, useRef, useEffect } from "react";
import ChartContainer from "./chart/ChartContainer";
import ChartControls from "./chart/ChartControls";
import PatternInfo from "./chart/PatternInfo";
import PatternBadges from "./chart/PatternBadges";
import MarketStats from "../ui/MarketStats";
import { processMarketData, calculatePriceStats } from "../utils/chartUtils";
import { filterVisualizablePatterns } from "../utils/patternUtils";
import { useChartState } from "../hooks/useChartState";

interface ChartDisplayProps {
  tradingPair?: string;
  onPatternSelect?: (patternId: string) => void;
  timeframe: string;
  onTimeframeChange?: (timeframe: string) => void;
  marketData?: any[];
  marketInfo?: any;
  patterns?: any[];
  selectedPattern?: string | null;
  onZoomPatternUpdate?: (startTime: string, endTime: string) => void;
  loadingPatterns?: boolean;
}

const ChartDisplay = ({
  tradingPair = "BTC/USDT",
  onPatternSelect = () => {},
  timeframe,
  onTimeframeChange = () => {},
  marketData = [],
  marketInfo = null,
  patterns = [],
  selectedPattern,
  onZoomPatternUpdate = () => {},
  loadingPatterns = false,
}: ChartDisplayProps) => {
  const { chartState, setChartType, toggleVolume } = useChartState({
    timeframe
  });
  
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const zoomRangeRef = useRef<{start: string, end: string} | null>(null);

  // Process market data for chart
  const chartData = useMemo(() => processMarketData(marketData), [marketData]);
  
  // Filter visualizable patterns
  const visualizablePatterns = useMemo(() => filterVisualizablePatterns(patterns), [patterns]);
  
  // Calculate price statistics
  const priceStats = useMemo(() => 
    calculatePriceStats(chartData, marketInfo, timeframe), 
    [chartData, marketInfo, timeframe]
  );
  
  // Get selected pattern data
  const selectedPatternData = useMemo(() => {
    if (!selectedPattern || !visualizablePatterns.length) return null;
    return visualizablePatterns.find(p => p.name === selectedPattern);
  }, [visualizablePatterns, selectedPattern]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Handle chart zoom/pan events
  const handleChartUpdate = useCallback((figure: any) => {
    if (!figure?.layout?.xaxis) return;
    
    const xaxis = figure.layout.xaxis;
    const startTime = xaxis.range?.[0];
    const endTime = xaxis.range?.[1];
    
    if (startTime && endTime && xaxis.autorange !== true) {
      try {
        const startISO = new Date(startTime).toISOString();
        const endISO = new Date(endTime).toISOString();
        
        const newRange = { start: startISO, end: endISO };
        const currentSpan = new Date(endTime).getTime() - new Date(startTime).getTime();
        const oneHour = 3600000;
        
        let threshold = oneHour;
        if (timeframe === '1h') {
          threshold = Math.max(1800000, currentSpan * 0.2);
        } else if (timeframe === '4h') {
          threshold = Math.max(3600000, currentSpan * 0.25);
        } else if (timeframe === '1d') {
          threshold = Math.max(7200000, currentSpan * 0.3);
        }
        
        const rangeChanged = !zoomRangeRef.current || 
          Math.abs(new Date(zoomRangeRef.current.start).getTime() - new Date(startISO).getTime()) > threshold ||
          Math.abs(new Date(zoomRangeRef.current.end).getTime() - new Date(endISO).getTime()) > threshold;
        
        if (rangeChanged) {
          zoomRangeRef.current = newRange;
          
          if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
          }
          
          debounceTimerRef.current = setTimeout(() => {
            if (onZoomPatternUpdate && startISO && endISO) {
              onZoomPatternUpdate(startISO, endISO);
            }
            debounceTimerRef.current = null;
          }, 1000);
        }
      } catch (error) {
        console.error('Error processing chart update:', error);
      }
    }
  }, [onZoomPatternUpdate, timeframe]);

  const handleTimeframeChange = useCallback((newTimeframe: string) => {
    if (onTimeframeChange) {
      onTimeframeChange(newTimeframe);
    }
  }, [onTimeframeChange]);

  const handlePatternSelect = useCallback((patternId: string) => {
    const newSelection = patternId === selectedPattern ? null : patternId;
    onPatternSelect(newSelection || "");
  }, [selectedPattern, onPatternSelect]);

  return (
    <div className="w-full space-y-4">
      {/* Market Statistics */}
      <MarketStats
        priceStats={priceStats}
        timeframe={timeframe}
        patternCount={visualizablePatterns.length}
        loadingPatterns={loadingPatterns}
      />

      {/* Chart Section */}
      <div className="bg-background/30 backdrop-blur-sm border border-border/50 rounded-xl p-6">
        {/* Chart Controls */}
        <ChartControls
          timeframe={timeframe}
          onTimeframeChange={handleTimeframeChange}
          chartType={chartState.chartType}
          onChartTypeChange={setChartType}
          showVolume={chartState.showVolume}
          onToggleVolume={toggleVolume}
        />

        {chartData.length > 0 ? (
          <div className="w-full mt-6">
            {/* Selected Pattern Info */}
            {selectedPatternData && (
              <PatternInfo pattern={selectedPatternData} />
            )}
            
            {/* Pattern Badges */}
            <div className="mb-4">
              <PatternBadges
                patterns={visualizablePatterns}
                selectedPattern={selectedPattern}
                onPatternSelect={handlePatternSelect}
                loading={loadingPatterns}
              />
            </div>
            
            {/* Chart Container */}
            <div className={`chart-container w-full h-[500px] rounded-xl border p-4 overflow-hidden ${
              selectedPatternData 
                ? 'border-primary/50 bg-gradient-to-br from-primary/5 to-background/5 shadow-lg shadow-primary/10' 
                : 'border-border/30 bg-gradient-to-br from-background/20 to-background/5'
            }`}>
              <ChartContainer
                chartData={chartData}
                chartType={chartState.chartType}
                showVolume={chartState.showVolume}
                patterns={visualizablePatterns}
                selectedPattern={selectedPattern}
                onChartUpdate={handleChartUpdate}
              />
            </div>
          </div>
        ) : (
          <div className="w-full h-[500px] rounded-xl border border-border/30 bg-gradient-to-br from-background/20 to-background/5 flex items-center justify-center mt-6">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold text-foreground/90">No Market Data</h3>
              <p className="text-muted-foreground">Select a trading pair to view the chart</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartDisplay;