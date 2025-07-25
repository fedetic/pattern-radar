import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Pattern {
  id: string;
  name: string;
  category:
    | "Chart"
    | "Candle"
    | "Volume-Based"
    | "Price Action"
    | "Harmonic"
    | "Statistical";
  strength: number; // 0-100
  description: string;
  // timeframe: string; // Removed since we only support 1d now - can be re-added easily
}

interface PatternAnalysisPanelProps {
  patterns?: Pattern[];
  onPatternSelect?: (patternId: string) => void;
  selectedPatternId?: string;
}

const PatternAnalysisPanel = ({
  patterns = [
    {
      id: "1",
      name: "Double Top",
      category: "Chart",
      strength: 85,
      description:
        "A bearish reversal pattern that forms after an extended move up.",
      // timeframe: "1d", // Removed - all patterns now use 1d timeframe
    },
    {
      id: "2",
      name: "Bullish Engulfing",
      category: "Candle",
      strength: 72,
      description: "A bullish reversal pattern that forms after a downtrend.",
      // timeframe: "4h", // Removed - all patterns now use 1d timeframe
    },
    {
      id: "3",
      name: "Volume Climax",
      category: "Volume-Based",
      strength: 68,
      description: "Extremely high volume indicating potential reversal.",
      // timeframe: "1d", // Removed - all patterns now use 1d timeframe
    },
    {
      id: "4",
      name: "Support Bounce",
      category: "Price Action",
      strength: 78,
      description: "Price bouncing off a key support level.",
      // timeframe: "1h", // Removed - all patterns now use 1d timeframe
    },
    {
      id: "5",
      name: "Bat Pattern",
      category: "Harmonic",
      strength: 65,
      description: "A harmonic pattern that signals potential reversal.",
      // timeframe: "1d", // Removed - all patterns now use 1d timeframe
    },
    {
      id: "6",
      name: "Mean Reversion",
      category: "Statistical",
      strength: 70,
      description: "Price likely to return to its mean after deviation.",
      // timeframe: "4h", // Removed - all patterns now use 1d timeframe
    },
  ],
  onPatternSelect = () => {},
  selectedPatternId = "",
}: PatternAnalysisPanelProps) => {
  // Group patterns by category
  const patternsByCategory = React.useMemo(() => {
    const grouped: Record<string, Pattern[]> = {};

    patterns.forEach((pattern) => {
      if (!grouped[pattern.category]) {
        grouped[pattern.category] = [];
      }
      grouped[pattern.category].push(pattern);
    });

    // Sort patterns by strength within each category
    Object.keys(grouped).forEach((category) => {
      grouped[category].sort((a, b) => b.strength - a.strength);
    });

    return grouped;
  }, [patterns]);

  const getStrengthColor = (strength: number) => {
    if (strength >= 80) return "bg-green-500";
    if (strength >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const categories = [
    { id: "all", name: "All" },
    { id: "Chart", name: "Chart" },
    { id: "Candle", name: "Candle" },
    { id: "Volume-Based", name: "Volume" },
    { id: "Price Action", name: "Price Action" },
    { id: "Harmonic", name: "Harmonic" },
    { id: "Statistical", name: "Statistical" },
  ];

  return (
    <div className="w-full h-full space-y-4">
      <div className="space-y-4">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full justify-start bg-background/50 border border-border/50 p-1 overflow-x-auto">
            {categories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="text-xs data-[state=active]:bg-primary/20 data-[state=active]:text-primary whitespace-nowrap"
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent
              key={category.id}
              value={category.id}
              className="mt-0 p-0"
            >
              <ScrollArea className="h-[500px] pr-4">
                {category.id === "all" ? (
                  // Show all categories in accordion when "All" is selected
                  <Accordion
                    type="multiple"
                    defaultValue={Object.keys(patternsByCategory)}
                  >
                    {Object.entries(patternsByCategory).map(
                      ([categoryName, categoryPatterns]) => (
                        <AccordionItem key={categoryName} value={categoryName}>
                          <AccordionTrigger className="py-2">
                            {categoryName} Patterns ({categoryPatterns.length})
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-2">
                              {categoryPatterns.map((pattern) => (
                                <PatternCard
                                  key={pattern.id}
                                  pattern={pattern}
                                  isSelected={pattern.id === selectedPatternId}
                                  onClick={() => onPatternSelect(pattern.id)}
                                />
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ),
                    )}
                  </Accordion>
                ) : (
                  // Show only patterns from selected category
                  <div className="space-y-2">
                    {patternsByCategory[category.id]?.map((pattern) => (
                      <PatternCard
                        key={pattern.id}
                        pattern={pattern}
                        isSelected={pattern.id === selectedPatternId}
                        onClick={() => onPatternSelect(pattern.id)}
                      />
                    )) || (
                      <div className="text-center py-8 text-gray-500">
                        No patterns detected in this category
                      </div>
                    )}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

interface PatternCardProps {
  pattern: Pattern;
  isSelected: boolean;
  onClick: () => void;
}

const PatternCard = ({ pattern, isSelected, onClick }: PatternCardProps) => {
  const getStrengthColor = (strength: number) => {
    if (strength >= 80) return "bg-green-500";
    if (strength >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getPatternCardClass = () => {
    let strengthClass = "";
    if (pattern.strength >= 80) {
      strengthClass =
        "border-green-500/30 bg-green-500/5 hover:bg-green-500/10";
    } else if (pattern.strength >= 60) {
      strengthClass =
        "border-yellow-500/30 bg-yellow-500/5 hover:bg-yellow-500/10";
    } else {
      strengthClass = "border-red-500/30 bg-red-500/5 hover:bg-red-500/10";
    }

    return `p-4 rounded-lg border cursor-pointer transition-all backdrop-blur-sm ${
      isSelected
        ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
        : `border-border/50 bg-background/30 hover:border-border ${strengthClass}`
    }`;
  };

  return (
    <div className={getPatternCardClass()} onClick={onClick}>
      <div className="flex justify-between items-start mb-3">
        <div className="space-y-1">
          <div className="font-semibold text-sm">{pattern.name}</div>
          <div className="text-xs text-muted-foreground capitalize">
            {pattern.category}
          </div>
        </div>
        {/* Timeframe badge removed since we only support 1d now */}
        <Badge
          variant="outline"
          className="text-xs bg-background/50 border-border/50"
        >
          1D
        </Badge>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Strength</span>
          <span
            className={`text-xs font-semibold ${
              pattern.strength >= 80
                ? "text-green-400"
                : pattern.strength >= 60
                  ? "text-yellow-400"
                  : "text-red-400"
            }`}
          >
            {pattern.strength}%
          </span>
        </div>
        <Progress value={pattern.strength} className="h-2 bg-background/50" />
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed">
        {pattern.description}
      </p>
    </div>
  );
};

export default PatternAnalysisPanel;
