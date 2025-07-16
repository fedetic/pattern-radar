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
import { ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, ReferenceLine, ReferenceArea } from "recharts";

interface ChartDisplayProps {
  tradingPair?: string;
  onPatternSelect?: (patternId: string) => void;
  timeframe: string;
  marketData?: any[];
  patterns?: any[];
  selectedPattern?: string | null;
}

const ChartDisplay = ({
  tradingPair = "BTC/USDT",
  onPatternSelect = () => {},
  timeframe,
  marketData = [],
  patterns = [],
  selectedPattern,
}: ChartDisplayProps) => {
  // Get patterns for current selection
  const selectedPatternData = useMemo(() => {
    if (!selectedPattern || !patterns || patterns.length === 0) return null;
    return patterns.find(p => p.name === selectedPattern);
  }, [patterns, selectedPattern]);

  // Process market data for chart
  const chartData = useMemo(() => {
    if (!marketData || marketData.length === 0) return [];
    
    try {
      return marketData.map((item, index) => {
        // Check if this data point should be highlighted for the selected pattern
        const isHighlighted = selectedPatternData && 
          selectedPatternData.coordinates && 
          selectedPatternData.coordinates.type === 'candlestick_highlight' &&
          selectedPatternData.coordinates.index === index;
        
        return {
          ...item,
          index,
          timestamp: item.timestamp, // Keep ISO string format for ReferenceArea
          timestampMs: new Date(item.timestamp).getTime(),
          date: new Date(item.timestamp).toLocaleDateString(),
          time: new Date(item.timestamp).toLocaleTimeString(),
          isHighlighted, // Add highlight flag for debugging
        };
      });
    } catch (error) {
      console.error('Error processing market data:', error);
      return [];
    }
  }, [marketData, selectedPatternData]);

  // Calculate current price stats
  const priceStats = useMemo(() => {
    if (chartData.length === 0) return null;
    
    try {
      const latest = chartData[chartData.length - 1];
      const previous = chartData[chartData.length - 2];
      
      const change = previous ? latest.close - previous.close : 0;
      const changePercent = previous ? ((change / previous.close) * 100) : 0;
      
      return {
        current: latest.close,
        change,
        changePercent,
        high24h: Math.max(...chartData.slice(-24).map(d => d.high)),
        low24h: Math.min(...chartData.slice(-24).map(d => d.low)),
      };
    } catch (error) {
      console.error('Error calculating price stats:', error);
      return null;
    }
  }, [chartData]);

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
            <Select value={timeframe} onValueChange={() => {}} disabled>
              <SelectTrigger className="w-[120px] bg-background/50 border-border/50">
                <SelectValue placeholder="Timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5m">5 Minutes</SelectItem>
                <SelectItem value="15m">15 Minutes</SelectItem>
                <SelectItem value="1h">1 Hour</SelectItem>
                <SelectItem value="4h">4 Hours</SelectItem>
                <SelectItem value="1d">1 Day</SelectItem>
                <SelectItem value="1w">1 Week</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Tabs defaultValue="candlestick" className="w-auto">
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
              <TabsTrigger
                value="area"
                className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
              >
                Area
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <Tabs defaultValue="candlestick" className="w-full">
          <TabsContent value="candlestick" className="w-full mt-0">
            {chartData.length > 0 ? (
              <div className="w-full h-[500px] rounded-xl border border-border/30 bg-gradient-to-br from-background/20 to-background/5 p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                    <XAxis 
                      dataKey="timestamp" 
                      stroke="#9CA3AF"
                      fontSize={12}
                      tick={{ fontSize: 12 }}
                      type="category"
                      tickFormatter={(value) => new Date(value).toLocaleDateString()}
                    />
                    <YAxis 
                      stroke="#9CA3AF"
                      fontSize={12}
                      tick={{ fontSize: 12 }}
                      domain={['dataMin - 100', 'dataMax + 100']}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#F9FAFB'
                      }}
                      formatter={(value: any, name: string) => [
                        `$${Number(value).toLocaleString()}`,
                        name.charAt(0).toUpperCase() + name.slice(1)
                      ]}
                      labelFormatter={(label) => `Date: ${new Date(label).toLocaleDateString()}`}
                    />
                    
                    {/* OHLC Lines */}
                    <Line 
                      type="monotone" 
                      dataKey="high" 
                      stroke="#10B981" 
                      strokeWidth={1}
                      dot={false}
                      connectNulls={false}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="low" 
                      stroke="#EF4444" 
                      strokeWidth={1}
                      dot={false}
                      connectNulls={false}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="close" 
                      stroke="#3B82F6" 
                      strokeWidth={2}
                      dot={false}
                      connectNulls={false}
                    />
                    
                    {/* Pattern range highlighting */}
                    {selectedPatternData && selectedPatternData.coordinates && selectedPatternData.coordinates.type === 'pattern_range' && (
                      <ReferenceArea
                        x1={selectedPatternData.coordinates.start_time}
                        x2={selectedPatternData.coordinates.end_time}
                        stroke={selectedPatternData.coordinates.highlight_color || "#F59E0B"}
                        strokeOpacity={0.8}
                        fill={selectedPatternData.coordinates.highlight_color || "#F59E0B"}
                        fillOpacity={0.1}
                        strokeWidth={2}
                        label={selectedPatternData.name}
                      />
                    )}
                    
                    {/* Legacy candlestick highlight support */}
                    {selectedPatternData && selectedPatternData.coordinates && selectedPatternData.coordinates.type === 'candlestick_highlight' && selectedPatternData.coordinates.high && (
                      <ReferenceLine 
                        y={selectedPatternData.coordinates.high} 
                        stroke="#F59E0B" 
                        strokeWidth={2}
                        strokeDasharray="4 4"
                        label={{ 
                          value: selectedPatternData.name, 
                          position: 'topRight'
                        }}
                      />
                    )}
                    
                    {/* Pattern overlays */}
                    {selectedPatternData && selectedPatternData.coordinates && (
                      <>
                        {/* Horizontal line patterns (support/resistance) */}
                        {selectedPatternData.coordinates.type === 'horizontal_line' && (
                          <ReferenceLine 
                            y={selectedPatternData.coordinates.level} 
                            stroke="#F59E0B" 
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            label={{ value: selectedPatternData.name, position: 'right' }}
                          />
                        )}
                        
                        {/* Trend line patterns */}
                        {selectedPatternData.coordinates.type === 'trend_lines' && (
                          <>
                            <ReferenceLine 
                              y={selectedPatternData.coordinates.sma_20} 
                              stroke="#10B981" 
                              strokeWidth={1}
                              strokeDasharray="3 3"
                              label={{ value: 'SMA 20', position: 'right' }}
                            />
                            <ReferenceLine 
                              y={selectedPatternData.coordinates.sma_50} 
                              stroke="#EF4444" 
                              strokeWidth={1}
                              strokeDasharray="3 3"
                              label={{ value: 'SMA 50', position: 'right' }}
                            />
                          </>
                        )}
                      </>
                    )}
                  </ComposedChart>
                </ResponsiveContainer>
                
                {/* Selected pattern info */}
                {selectedPatternData && (
                  <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">🎯</span>
                      <span className="font-semibold text-primary">{selectedPatternData.name}</span>
                      <Badge variant="outline" className={`${
                        selectedPatternData.direction === 'bullish' ? 'text-green-400 border-green-400' : 
                        selectedPatternData.direction === 'bearish' ? 'text-red-400 border-red-400' : 
                        'text-yellow-400 border-yellow-400'
                      }`}>
                        {selectedPatternData.direction} {selectedPatternData.confidence}%
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{selectedPatternData.description}</p>
                    {selectedPatternData.coordinates && selectedPatternData.coordinates.timestamp && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Detected at: {new Date(selectedPatternData.coordinates.timestamp).toLocaleString()}
                      </p>
                    )}
                  </div>
                )}

                {/* Pattern badges */}
                <div className="mt-4 flex flex-wrap gap-2">
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
              </div>
            ) : (
              <div className="w-full h-[500px] rounded-xl border border-border/30 bg-gradient-to-br from-background/20 to-background/5 flex items-center justify-center">
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-semibold text-foreground/90">No Market Data</h3>
                  <p className="text-muted-foreground">Select a trading pair to view the chart</p>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="line" className="w-full mt-0">
            <div className="w-full h-[500px] rounded-xl border border-border/30 bg-gradient-to-br from-background/20 to-background/5 flex items-center justify-center">
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold text-foreground/90">Line Chart View</h3>
                <p className="text-muted-foreground">Coming soon - Simplified price movement visualization</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="area" className="w-full mt-0">
            <div className="w-full h-[500px] rounded-xl border border-border/30 bg-gradient-to-br from-background/20 to-background/5 flex items-center justify-center">
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold text-foreground/90">Area Chart View</h3>
                <p className="text-muted-foreground">Coming soon - Filled area price visualization</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ChartDisplay;
