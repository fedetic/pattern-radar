import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';

interface ChartControlsProps {
  timeframe: string;
  onTimeframeChange: (timeframe: string) => void;
  chartType: 'candlestick' | 'line';
  onChartTypeChange: (type: 'candlestick' | 'line') => void;
  showVolume: boolean;
  onToggleVolume: () => void;
}

const ChartControls: React.FC<ChartControlsProps> = ({
  timeframe,
  onTimeframeChange,
  chartType,
  onChartTypeChange,
  showVolume,
  onToggleVolume
}) => {
  const timeframes = [
    { value: "1h", label: "1H" },
    { value: "4h", label: "4H" },
    { value: "1d", label: "1D" },
  ];

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex items-center gap-3">
        {/* Timeframe selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Timeframe:</span>
          <Select value={timeframe} onValueChange={onTimeframeChange}>
            <SelectTrigger className="w-20 bg-background/50 border border-border/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timeframes.map((tf) => (
                <SelectItem key={tf.value} value={tf.value}>
                  {tf.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Chart type tabs */}
        <Tabs value={chartType} onValueChange={onChartTypeChange}>
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
        
        {/* Volume toggle */}
        <Button
          variant={showVolume ? "default" : "outline"}
          size="sm"
          onClick={onToggleVolume}
          className="flex items-center gap-2"
        >
          {showVolume ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          Volume
        </Button>
      </div>
    </div>
  );
};

export default ChartControls;