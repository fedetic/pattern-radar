import React, { useState } from "react";
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

interface ChartDisplayProps {
  tradingPair?: string;
  onPatternSelect?: (patternId: string) => void;
}

const ChartDisplay = ({
  tradingPair = "BTC/USDT",
  onPatternSelect = () => {},
}: ChartDisplayProps) => {
  const [timeframe, setTimeframe] = useState("1d");

  // Mock data for chart - in a real app this would come from an API
  const chartPlaceholder = {
    height: 500,
    backgroundColor: "#f8fafc",
  };

  return (
    <div className="w-full space-y-4">
      {/* Market Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-background/30 backdrop-blur-sm border border-border/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-4 w-4 text-green-400" />
            <span className="text-sm text-muted-foreground">Price</span>
          </div>
          <div className="text-lg font-semibold text-green-400">$42,350.00</div>
          <div className="text-xs text-green-400">+2.34%</div>
        </div>
        <div className="bg-background/30 backdrop-blur-sm border border-border/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <Volume2 className="h-4 w-4 text-blue-400" />
            <span className="text-sm text-muted-foreground">Volume</span>
          </div>
          <div className="text-lg font-semibold">24,356 BTC</div>
          <div className="text-xs text-muted-foreground">24h</div>
        </div>
        <div className="bg-background/30 backdrop-blur-sm border border-border/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingDown className="h-4 w-4 text-red-400" />
            <span className="text-sm text-muted-foreground">Low</span>
          </div>
          <div className="text-lg font-semibold">$41,200.00</div>
          <div className="text-xs text-muted-foreground">24h</div>
        </div>
        <div className="bg-background/30 backdrop-blur-sm border border-border/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-4 w-4 text-yellow-400" />
            <span className="text-sm text-muted-foreground">Updated</span>
          </div>
          <div className="text-sm font-medium">
            {new Date().toLocaleTimeString()}
          </div>
          <div className="text-xs text-green-400">Live</div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="bg-background/30 backdrop-blur-sm border border-border/50 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Select value={timeframe} onValueChange={setTimeframe}>
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
            <div
              className="w-full rounded-xl border border-border/30 bg-gradient-to-br from-background/20 to-background/5 flex flex-col items-center justify-center relative overflow-hidden"
              style={{
                height: chartPlaceholder.height,
              }}
            >
              {/* Grid pattern overlay */}
              <div className="absolute inset-0 opacity-10">
                <div
                  className="w-full h-full"
                  style={{
                    backgroundImage: `
                    linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                  `,
                    backgroundSize: "40px 40px",
                  }}
                />
              </div>

              <div className="text-center z-10 space-y-4">
                <div className="space-y-2">
                  <h3 className="text-2xl font-semibold text-foreground/90">
                    {tradingPair.replace("-", "/")} Candlestick Chart
                  </h3>
                  <p className="text-muted-foreground">
                    Timeframe: {timeframe} • Real-time data visualization
                  </p>
                </div>

                {/* Mock pattern indicators */}
                <div className="flex flex-wrap justify-center gap-3 mt-6">
                  <Badge
                    className="bg-green-500/20 border-green-500/30 text-green-400 cursor-pointer hover:bg-green-500/30 transition-colors"
                    onClick={() => onPatternSelect("double-bottom")}
                  >
                    Double Bottom Detected
                  </Badge>
                  <Badge
                    className="bg-blue-500/20 border-blue-500/30 text-blue-400 cursor-pointer hover:bg-blue-500/30 transition-colors"
                    onClick={() => onPatternSelect("head-and-shoulders")}
                  >
                    Head & Shoulders
                  </Badge>
                  <Badge
                    className="bg-purple-500/20 border-purple-500/30 text-purple-400 cursor-pointer hover:bg-purple-500/30 transition-colors"
                    onClick={() => onPatternSelect("triangle")}
                  >
                    Ascending Triangle
                  </Badge>
                </div>

                <p className="text-xs text-muted-foreground mt-4 max-w-md mx-auto">
                  Advanced charting with pattern recognition will be integrated
                  here. Click on pattern badges to highlight them on the chart.
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="line" className="w-full mt-0">
            <div
              className="w-full rounded-xl border border-border/30 bg-gradient-to-br from-background/20 to-background/5 flex items-center justify-center"
              style={{
                height: chartPlaceholder.height,
              }}
            >
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold text-foreground/90">
                  Line Chart View
                </h3>
                <p className="text-muted-foreground">
                  Simplified price movement visualization
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="area" className="w-full mt-0">
            <div
              className="w-full rounded-xl border border-border/30 bg-gradient-to-br from-background/20 to-background/5 flex items-center justify-center"
              style={{
                height: chartPlaceholder.height,
              }}
            >
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold text-foreground/90">
                  Area Chart View
                </h3>
                <p className="text-muted-foreground">
                  Filled area price visualization
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ChartDisplay;
