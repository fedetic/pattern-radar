import React, { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Volume2, Clock } from "lucide-react";
import {
  Chart,
  ChartCanvas,
  CandlestickSeries,
  LineSeries,
  XAxis as FinancialXAxis,
  YAxis as FinancialYAxis,
  CrossHairCursor,
  MouseCoordinateX,
  MouseCoordinateY,
  discontinuousTimeScaleProvider,
  EdgeIndicator,
} from "react-financial-charts";
import { format } from "d3-format";
import { timeFormat } from "d3-time-format";

interface ChartDisplayProps {
  tradingPair?: string;
  onPatternSelect?: (patternId: string) => void;
  timeframe: string;
  onTimeframeChange?: (timeframe: string) => void;
  marketData?: any[];
  patterns?: any[];
  selectedPattern?: string | null;
}

const ChartDisplay = ({
  tradingPair = "BTC/USDT",
  onPatternSelect = () => {},
  timeframe,
  onTimeframeChange = () => {},
  marketData = [],
  patterns = [],
  selectedPattern,
}: ChartDisplayProps) => {
  const [chartType, setChartType] = useState("candlestick");

  // Enhanced pattern information mapping
  const getPatternInfo = (patternName: string, direction: string) => {
    const patternInfoMap: { [key: string]: { meaning: string; significance: string; trading: string; reliability: string } } = {
      "Doji": {
        meaning: "A candle with virtually the same opening and closing price, indicating market indecision.",
        significance: "Shows equilibrium between buyers and sellers. Often signals potential trend reversal.",
        trading: "Wait for confirmation before trading. Look for the next candle to confirm direction.",
        reliability: "Medium - requires confirmation from subsequent price action"
      },
      "Hammer": {
        meaning: "A small body with a long lower shadow, appearing after a downtrend.",
        significance: "Bullish reversal signal. Shows buyers stepped in after sellers pushed price down.",
        trading: "Consider long positions with stops below the hammer's low. Target resistance levels.",
        reliability: "High - especially when appearing at support levels"
      },
      "Hanging Man": {
        meaning: "Similar to hammer but appears after an uptrend, signaling potential bearish reversal.",
        significance: "Warning sign that the uptrend may be losing momentum.",
        trading: "Consider taking profits or tightening stops. Wait for bearish confirmation.",
        reliability: "Medium - needs volume and next candle confirmation"
      },
      "Shooting Star": {
        meaning: "Small body with long upper shadow after an uptrend, showing rejection at higher levels.",
        significance: "Bearish reversal signal. Buyers pushed price up but sellers took control.",
        trading: "Consider short positions with stops above the high. Target support levels.",
        reliability: "High - especially with high volume"
      },
      "Engulfing Pattern": {
        meaning: direction === "bullish" ? "A large bullish candle that engulfs the previous bearish candle." : "A large bearish candle that engulfs the previous bullish candle.",
        significance: direction === "bullish" ? "Strong bullish reversal signal showing buying pressure." : "Strong bearish reversal signal showing selling pressure.",
        trading: direction === "bullish" ? "Consider long positions with stops below the pattern low." : "Consider short positions with stops above the pattern high.",
        reliability: "Very High - one of the most reliable reversal patterns"
      },
      "Morning Star": {
        meaning: "Three-candle bullish reversal pattern: bearish candle, small-bodied candle, then bullish candle.",
        significance: "Strong bullish reversal signal appearing after a downtrend.",
        trading: "Enter long positions with stops below the pattern low. Target key resistance levels.",
        reliability: "Very High - highly reliable reversal pattern"
      },
      "Evening Star": {
        meaning: "Three-candle bearish reversal pattern: bullish candle, small-bodied candle, then bearish candle.",
        significance: "Strong bearish reversal signal appearing after an uptrend.",
        trading: "Enter short positions with stops above the pattern high. Target key support levels.",
        reliability: "Very High - highly reliable reversal pattern"
      },
      "Three Black Crows": {
        meaning: "Three consecutive bearish candles with progressively lower closes.",
        significance: "Strong bearish continuation signal showing sustained selling pressure.",
        trading: "Consider short positions or exit long positions. Target lower support levels.",
        reliability: "High - strong bearish momentum indicator"
      },
      "Three White Soldiers": {
        meaning: "Three consecutive bullish candles with progressively higher closes.",
        significance: "Strong bullish continuation signal showing sustained buying pressure.",
        trading: "Consider long positions or exit short positions. Target higher resistance levels.",
        reliability: "High - strong bullish momentum indicator"
      },
      "Support Level Test": {
        meaning: "Price is testing a key support level where buying interest has previously emerged.",
        significance: "Critical decision point - if support holds, bullish bounce likely; if broken, bearish continuation.",
        trading: "Watch for bounce off support for long entry, or break below for short entry.",
        reliability: "High - support/resistance levels are key technical levels"
      },
      "Resistance Level Test": {
        meaning: "Price is testing a key resistance level where selling interest has previously emerged.",
        significance: "Critical decision point - if resistance breaks, bullish continuation likely; if rejected, bearish reversal.",
        trading: "Watch for break above resistance for long entry, or rejection for short entry.",
        reliability: "High - support/resistance levels are key technical levels"
      },
      "Bullish Trend": {
        meaning: "Price is above both 20-period and 50-period moving averages in ascending order.",
        significance: "Strong bullish momentum with institutional and retail support.",
        trading: "Consider long positions on pullbacks to moving averages. Trend is your friend.",
        reliability: "High - moving average alignment is a strong trend indicator"
      },
      "Bearish Trend": {
        meaning: "Price is below both 20-period and 50-period moving averages in descending order.",
        significance: "Strong bearish momentum with institutional and retail selling pressure.",
        trading: "Consider short positions on bounces to moving averages. Avoid fighting the trend.",
        reliability: "High - moving average alignment is a strong trend indicator"
      }
    };

    return patternInfoMap[patternName] || {
      meaning: "Pattern details not available. This is a detected pattern in the market data.",
      significance: "Technical analysis pattern that may indicate potential price movement.",
      trading: "Analyze the pattern context and wait for confirmation before making trading decisions.",
      reliability: "Variable - depends on market conditions and pattern context"
    };
  };

  // Get patterns for current selection
  const selectedPatternData = useMemo(() => {
    if (!selectedPattern || !patterns || patterns.length === 0) return null;
    return patterns.find(p => p.name === selectedPattern);
  }, [patterns, selectedPattern]);

  // Process market data for react-financial-charts
  const chartData = useMemo(() => {
    if (!marketData || marketData.length === 0) return [];
    
    try {
      return marketData.map((item, index) => {
        const date = new Date(item.timestamp);
        return {
          date,
          open: Number(item.open),
          high: Number(item.high),
          low: Number(item.low),
          close: Number(item.close),
          volume: Number(item.volume) || 0,
          index,
          timestamp: item.timestamp,
        };
      }).sort((a, b) => a.date.getTime() - b.date.getTime());
    } catch (error) {
      console.error('Error processing market data:', error);
      return [];
    }
  }, [marketData]);

  // Process data for react-financial-charts
  const { data, xScale, xAccessor, displayXAccessor } = useMemo(() => {
    if (chartData.length === 0) return { data: [], xScale: null, xAccessor: null, displayXAccessor: null };
    
    const timeScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor(d => d.date);
    return timeScaleProvider(chartData);
  }, [chartData]);

  // Calculate current price stats
  const priceStats = useMemo(() => {
    if (data.length === 0) return null;
    
    try {
      const latest = data[data.length - 1];
      const previous = data[data.length - 2];
      
      const change = previous ? latest.close - previous.close : 0;
      const changePercent = previous ? ((change / previous.close) * 100) : 0;
      
      return {
        current: latest.close,
        change,
        changePercent,
        high24h: Math.max(...data.slice(-24).map(d => d.high)),
        low24h: Math.min(...data.slice(-24).map(d => d.low)),
      };
    } catch (error) {
      console.error('Error calculating price stats:', error);
      return null;
    }
  }, [data]);

  // Determine pattern duration for visualization
  const getPatternDuration = (patternName: string) => {
    const singleCandle = ['Doji', 'Hammer', 'Hanging Man', 'Shooting Star', 'Dragonfly Doji', 'Gravestone Doji', 'Marubozu', 'Spinning Top'];
    const twoCandle = ['Engulfing Pattern', 'Piercing Pattern', 'Dark Cloud Cover', 'Harami Pattern', 'Harami Cross', 'Thrusting Pattern'];
    const threeCandle = ['Morning Star', 'Evening Star', 'Three Black Crows', 'Three White Soldiers', 'Three Inside Up/Down', 'Three Outside Up/Down', 'Advance Block'];
    
    if (singleCandle.includes(patternName)) return 1;
    if (twoCandle.includes(patternName)) return 2;
    if (threeCandle.includes(patternName)) return 3;
    return 3; // Default
  };

  // Create enhanced pattern visualization
  const patternVisualizationData = useMemo(() => {
    if (!selectedPatternData?.coordinates) return { lines: [], markers: [] };
    
    const coords = selectedPatternData.coordinates;
    const lines = [];
    const markers = [];
    
    // For pattern_range type, create proper visualizations
    if (coords.type === 'pattern_range') {
      const patternDuration = getPatternDuration(selectedPatternData.name);
      const direction = selectedPatternData.direction;
      const color = direction === 'bullish' ? '#10B981' : direction === 'bearish' ? '#EF4444' : '#F59E0B';
      
      if (patternDuration === 1) {
        // Single candlestick pattern - create arrow marker
        const arrowY = direction === 'bullish' ? coords.pattern_low - ((coords.pattern_high - coords.pattern_low) * 0.3) : coords.pattern_high + ((coords.pattern_high - coords.pattern_low) * 0.3);
        
        markers.push({
          type: 'arrow',
          y: arrowY,
          direction: direction,
          color: color,
          id: 'single_pattern_arrow',
          timeRange: { start: coords.start_time, end: coords.end_time }
        });
      } else {
        // Multi-candlestick pattern - create vertical boundary lines
        markers.push({
          type: 'vertical_lines',
          color: color,
          id: 'multi_pattern_boundaries',
          timeRange: { start: coords.start_time, end: coords.end_time },
          high: coords.pattern_high,
          low: coords.pattern_low
        });
      }
    }
    
    return { lines, markers };
  }, [selectedPatternData]);

  // Create pattern overlay lines (keeping existing functionality)
  const patternOverlayLines = useMemo(() => {
    if (!selectedPatternData?.coordinates) return [];
    
    const coords = selectedPatternData.coordinates;
    const lines = [];
    
    // Horizontal line patterns
    if (coords.type === 'horizontal_line') {
      lines.push({
        yAccessor: () => coords.level,
        stroke: coords.highlight_color || "#F59E0B",
        strokeWidth: 2,
        strokeDasharray: "5,5",
        id: "support_resistance"
      });
    }
    
    // Trend line patterns
    if (coords.type === 'trend_lines') {
      if (coords.sma_20) {
        lines.push({
          yAccessor: () => coords.sma_20,
          stroke: "#10B981",
          strokeWidth: 1,
          strokeDasharray: "3,3",
          id: "sma_20"
        });
      }
      if (coords.sma_50) {
        lines.push({
          yAccessor: () => coords.sma_50,
          stroke: "#EF4444",
          strokeWidth: 1,
          strokeDasharray: "3,3",
          id: "sma_50"
        });
      }
    }
    
    return lines;
  }, [selectedPatternData]);


  const renderCandlestickChart = () => (
    <ChartCanvas
      height={450}
      ratio={1}
      width={800}
      margin={{ left: 60, right: 80, top: 20, bottom: 30 }}
      data={data}
      seriesName="OHLC"
      xScale={xScale}
      xAccessor={xAccessor}
      displayXAccessor={displayXAccessor}
      disableInteraction={false}
      disablePan={false}
      disableZoom={false}
    >
      <Chart id={1} yExtents={d => [d.high, d.low]}>
        <FinancialXAxis
          axisAt="bottom"
          orient="bottom"
          tickFormat={timeFormat("%m/%d")}
        />
        <FinancialYAxis
          axisAt="right"
          orient="right"
          tickFormat={format(".2f")}
        />
        <MouseCoordinateX
          at="bottom"
          orient="bottom"
          displayFormat={timeFormat("%Y-%m-%d")}
        />
        <MouseCoordinateY
          at="right"
          orient="right"
          displayFormat={format(".2f")}
        />
        
        {/* Candlestick Series */}
        <CandlestickSeries
          fill={d => d.close > d.open ? "#10B981" : "#EF4444"}
          stroke={d => d.close > d.open ? "#10B981" : "#EF4444"}
          wickStroke={d => d.close > d.open ? "#10B981" : "#EF4444"}
          candleStrokeWidth={1}
          widthRatio={0.8}
        />
        
        {/* Pattern Overlay Lines */}
        {patternOverlayLines.map((line, index) => (
          <LineSeries
            key={`${line.id}_${index}`}
            yAccessor={line.yAccessor}
            strokeStyle={line.stroke}
            strokeWidth={line.strokeWidth}
            strokeDasharray={line.strokeDasharray}
          />
        ))}
        
        {/* Enhanced Pattern Visualization */}
        {patternVisualizationData.markers.map((marker, index) => {
          if (marker.type === 'arrow') {
            // For single candlestick patterns - show a prominent horizontal line with arrow-like styling
            return (
              <LineSeries
                key={`arrow_${marker.id}_${index}`}
                yAccessor={() => marker.y}
                strokeStyle={marker.color}
                strokeWidth={4}
strokeDasharray="Dash"
              />
            );
          } else if (marker.type === 'vertical_lines') {
            // For multi-candlestick patterns - show distinct boundary lines
            return [
              <LineSeries
                key={`high_boundary_${marker.id}_${index}`}
                yAccessor={() => marker.high}
                strokeStyle={marker.color}
                strokeWidth={3}
strokeDasharray="ShortDot"
              />,
              <LineSeries
                key={`low_boundary_${marker.id}_${index}`}
                yAccessor={() => marker.low}
                strokeStyle={marker.color}
                strokeWidth={3}
strokeDasharray="ShortDot"
              />
            ];
          }
          return null;
        }).flat().filter(Boolean)}
        
        {/* Edge Indicators for Pattern Lines */}
        {patternOverlayLines.map((line, index) => (
          <EdgeIndicator
            key={`edge_${line.id}_${index}`}
            itemType="last"
            orient="right"
            edgeAt="right"
            yAccessor={line.yAccessor}
            fill={line.stroke}
            stroke={line.stroke}
            strokeWidth={1}
            arrowWidth={6}
            textFill="#F9FAFB"
            fontSize={10}
          />
        ))}
        
        {/* Edge Indicators for Enhanced Pattern Visualization */}
        {patternVisualizationData.markers.map((marker, index) => {
          if (marker.type === 'arrow') {
            // Single candlestick pattern edge indicator
            return (
              <EdgeIndicator
                key={`edge_arrow_${marker.id}_${index}`}
                itemType="last"
                orient="right"
                edgeAt="right"
                yAccessor={() => marker.y}
                fill={marker.color}
                stroke={marker.color}
                strokeWidth={2}
                arrowWidth={8}
                textFill="#F9FAFB"
                fontSize={12}
              />
            );
          } else if (marker.type === 'vertical_lines') {
            // Multi-candlestick pattern edge indicators
            return [
              <EdgeIndicator
                key={`edge_high_${marker.id}_${index}`}
                itemType="last"
                orient="right"
                edgeAt="right"
                yAccessor={() => marker.high}
                fill={marker.color}
                stroke={marker.color}
                strokeWidth={1}
                arrowWidth={6}
                textFill="#F9FAFB"
                fontSize={10}
              />,
              <EdgeIndicator
                key={`edge_low_${marker.id}_${index}`}
                itemType="last"
                orient="right"
                edgeAt="right"
                yAccessor={() => marker.low}
                fill={marker.color}
                stroke={marker.color}
                strokeWidth={1}
                arrowWidth={6}
                textFill="#F9FAFB"
                fontSize={10}
              />
            ];
          }
          return null;
        }).flat().filter(Boolean)}
        
        <CrossHairCursor />
      </Chart>
    </ChartCanvas>
  );

  const renderLineChart = () => (
    <ChartCanvas
      height={450}
      ratio={1}
      width={800}
      margin={{ left: 60, right: 80, top: 20, bottom: 30 }}
      data={data}
      seriesName="Close"
      xScale={xScale}
      xAccessor={xAccessor}
      displayXAccessor={displayXAccessor}
      disableInteraction={false}
      disablePan={false}
      disableZoom={false}
    >
      <Chart id={1} yExtents={d => d.close}>
        <FinancialXAxis
          axisAt="bottom"
          orient="bottom"
          tickFormat={timeFormat("%m/%d")}
        />
        <FinancialYAxis
          axisAt="right"
          orient="right"
          tickFormat={format(".2f")}
        />
        <MouseCoordinateX
          at="bottom"
          orient="bottom"
          displayFormat={timeFormat("%Y-%m-%d")}
        />
        <MouseCoordinateY
          at="right"
          orient="right"
          displayFormat={format(".2f")}
        />
        
        {/* Line Series for Close Price */}
        <LineSeries
          yAccessor={d => d.close}
          strokeStyle="#3B82F6"
          strokeWidth={2}
        />
        
        {/* Pattern Overlay Lines */}
        {patternOverlayLines.map((line, index) => (
          <LineSeries
            key={`${line.id}_${index}`}
            yAccessor={line.yAccessor}
            strokeStyle={line.stroke}
            strokeWidth={line.strokeWidth}
            strokeDasharray={line.strokeDasharray}
          />
        ))}
        
        {/* Enhanced Pattern Visualization */}
        {patternVisualizationData.markers.map((marker, index) => {
          if (marker.type === 'arrow') {
            // For single candlestick patterns - show a prominent horizontal line with arrow-like styling
            return (
              <LineSeries
                key={`arrow_${marker.id}_${index}`}
                yAccessor={() => marker.y}
                strokeStyle={marker.color}
                strokeWidth={4}
strokeDasharray="Dash"
              />
            );
          } else if (marker.type === 'vertical_lines') {
            // For multi-candlestick patterns - show distinct boundary lines
            return [
              <LineSeries
                key={`high_boundary_${marker.id}_${index}`}
                yAccessor={() => marker.high}
                strokeStyle={marker.color}
                strokeWidth={3}
strokeDasharray="ShortDot"
              />,
              <LineSeries
                key={`low_boundary_${marker.id}_${index}`}
                yAccessor={() => marker.low}
                strokeStyle={marker.color}
                strokeWidth={3}
strokeDasharray="ShortDot"
              />
            ];
          }
          return null;
        }).flat().filter(Boolean)}
        
        {/* Edge Indicators for Pattern Lines */}
        {patternOverlayLines.map((line, index) => (
          <EdgeIndicator
            key={`edge_${line.id}_${index}`}
            itemType="last"
            orient="right"
            edgeAt="right"
            yAccessor={line.yAccessor}
            fill={line.stroke}
            stroke={line.stroke}
            strokeWidth={1}
            arrowWidth={6}
            textFill="#F9FAFB"
            fontSize={10}
          />
        ))}
        
        {/* Edge Indicators for Enhanced Pattern Visualization */}
        {patternVisualizationData.markers.map((marker, index) => {
          if (marker.type === 'arrow') {
            // Single candlestick pattern edge indicator
            return (
              <EdgeIndicator
                key={`edge_arrow_${marker.id}_${index}`}
                itemType="last"
                orient="right"
                edgeAt="right"
                yAccessor={() => marker.y}
                fill={marker.color}
                stroke={marker.color}
                strokeWidth={2}
                arrowWidth={8}
                textFill="#F9FAFB"
                fontSize={12}
              />
            );
          } else if (marker.type === 'vertical_lines') {
            // Multi-candlestick pattern edge indicators
            return [
              <EdgeIndicator
                key={`edge_high_${marker.id}_${index}`}
                itemType="last"
                orient="right"
                edgeAt="right"
                yAccessor={() => marker.high}
                fill={marker.color}
                stroke={marker.color}
                strokeWidth={1}
                arrowWidth={6}
                textFill="#F9FAFB"
                fontSize={10}
              />,
              <EdgeIndicator
                key={`edge_low_${marker.id}_${index}`}
                itemType="last"
                orient="right"
                edgeAt="right"
                yAccessor={() => marker.low}
                fill={marker.color}
                stroke={marker.color}
                strokeWidth={1}
                arrowWidth={6}
                textFill="#F9FAFB"
                fontSize={10}
              />
            ];
          }
          return null;
        }).flat().filter(Boolean)}
        
        <CrossHairCursor />
      </Chart>
    </ChartCanvas>
  );

  return (
    <div className="w-full space-y-4">
      {/* Market Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-background/30 backdrop-blur-sm border border-border/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className={`h-4 w-4 ${priceStats?.change >= 0 ? 'text-green-400' : 'text-red-400'}`} />
            <span className="text-sm text-muted-foreground">Price</span>
          </div>
          <div className={`text-lg font-semibold ${priceStats?.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            ${priceStats?.current?.toLocaleString() || 'Loading...'}
          </div>
          <div className={`text-xs ${priceStats?.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {priceStats ? `${priceStats.change >= 0 ? '+' : ''}${priceStats.changePercent.toFixed(2)}%` : ''}
          </div>
        </div>
        <div className="bg-background/30 backdrop-blur-sm border border-border/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-4 w-4 text-blue-400" />
            <span className="text-sm text-muted-foreground">High</span>
          </div>
          <div className="text-lg font-semibold">
            ${priceStats?.high24h?.toLocaleString() || 'Loading...'}
          </div>
          <div className="text-xs text-muted-foreground">24h</div>
        </div>
        <div className="bg-background/30 backdrop-blur-sm border border-border/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingDown className="h-4 w-4 text-red-400" />
            <span className="text-sm text-muted-foreground">Low</span>
          </div>
          <div className="text-lg font-semibold">
            ${priceStats?.low24h?.toLocaleString() || 'Loading...'}
          </div>
          <div className="text-xs text-muted-foreground">24h</div>
        </div>
        <div className="bg-background/30 backdrop-blur-sm border border-border/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-4 w-4 text-yellow-400" />
            <span className="text-sm text-muted-foreground">Patterns</span>
          </div>
          <div className="text-lg font-semibold">
            {patterns.length}
          </div>
          <div className="text-xs text-green-400">Detected</div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="bg-background/30 backdrop-blur-sm border border-border/50 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Select value={timeframe} onValueChange={onTimeframeChange}>
              <SelectTrigger className="w-[120px] bg-background/50 border-border/50">
                <SelectValue placeholder="Timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">1 Hour</SelectItem>
                <SelectItem value="4h">4 Hours</SelectItem>
                <SelectItem value="1d">1 Day</SelectItem>
                <SelectItem value="1w">1 Week</SelectItem>
                <SelectItem value="1m">1 Month</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Tabs value={chartType} onValueChange={setChartType} className="w-auto">
            <TabsList className="bg-background/50 border border-border/50">
              <TabsTrigger
                value="candlestick"
                className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
              >
                Candlestick
              </TabsTrigger>
              <TabsTrigger
                value="line"
                className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
              >
                Line
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {data.length > 0 ? (
          <div className="w-full">
            {/* Selected pattern info */}
            {selectedPatternData && (
              <div className="mb-4 p-6 bg-primary/10 border border-primary/20 rounded-lg relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">🎯</span>
                  <span className="font-semibold text-primary text-lg">{selectedPatternData.name}</span>
                  <Badge variant="outline" className={`${
                    selectedPatternData.direction === 'bullish' ? 'text-green-400 border-green-400' : 
                    selectedPatternData.direction === 'bearish' ? 'text-red-400 border-red-400' : 
                    'text-yellow-400 border-yellow-400'
                  }`}>
                    {selectedPatternData.direction} {selectedPatternData.confidence}%
                  </Badge>
                </div>
                
                {/* Enhanced pattern information */}
                {(() => {
                  const patternInfo = getPatternInfo(selectedPatternData.name, selectedPatternData.direction);
                  return (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <h4 className="font-semibold text-sm text-primary/90 flex items-center gap-1">
                            <span>📖</span> Pattern Meaning
                          </h4>
                          <p className="text-sm text-muted-foreground">{patternInfo.meaning}</p>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-semibold text-sm text-primary/90 flex items-center gap-1">
                            <span>⚡</span> Market Significance
                          </h4>
                          <p className="text-sm text-muted-foreground">{patternInfo.significance}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <h4 className="font-semibold text-sm text-primary/90 flex items-center gap-1">
                            <span>💡</span> Trading Strategy
                          </h4>
                          <p className="text-sm text-muted-foreground">{patternInfo.trading}</p>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-semibold text-sm text-primary/90 flex items-center gap-1">
                            <span>🎯</span> Reliability
                          </h4>
                          <p className="text-sm text-muted-foreground">{patternInfo.reliability}</p>
                        </div>
                      </div>
                    </div>
                  );
                })()}
                
              </div>
            )}
            
            {/* Pattern badges */}
            <div className="mb-4 flex flex-wrap gap-2">
              {patterns.slice(0, 5).map((pattern, index) => (
                <Badge
                  key={pattern.name}
                  className={`cursor-pointer transition-colors ${
                    pattern.name === selectedPattern
                      ? 'bg-primary/30 border-primary text-primary'
                      : pattern.direction === 'bullish'
                      ? 'bg-green-500/20 border-green-500/30 text-green-400 hover:bg-green-500/30'
                      : 'bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500/30'
                  }`}
                  onClick={() => onPatternSelect(pattern.name)}
                >
                  {pattern.name} ({pattern.confidence}%)
                </Badge>
              ))}
            </div>
            
            <div className={`chart-container w-full h-[500px] rounded-xl border p-4 overflow-hidden ${
              selectedPatternData 
                ? 'border-primary/50 bg-gradient-to-br from-primary/5 to-background/5 shadow-lg shadow-primary/10' 
                : 'border-border/30 bg-gradient-to-br from-background/20 to-background/5'
            }`}>
              {chartType === "candlestick" ? renderCandlestickChart() : renderLineChart()}
            </div>
          </div>
        ) : (
          <div className="w-full h-[500px] rounded-xl border border-border/30 bg-gradient-to-br from-background/20 to-background/5 flex items-center justify-center">
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