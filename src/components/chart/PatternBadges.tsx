import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import { Pattern } from '../../hooks/usePatternData';
import { getPatternDirectionColor, removeDuplicatePatterns } from '../../utils/patternUtils';

interface PatternBadgesProps {
  patterns: Pattern[];
  selectedPattern: string | null;
  onPatternSelect: (patternId: string) => void;
  loading: boolean;
}

const PatternBadges: React.FC<PatternBadgesProps> = ({
  patterns,
  selectedPattern,
  onPatternSelect,
  loading
}) => {
  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Clock className="h-4 w-4 animate-spin" />
        <span>Scanning patterns in selected timeframe...</span>
      </div>
    );
  }

  if (patterns.length === 0) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>No visualizable patterns detected in current timeframe. Try zooming to a different range.</span>
      </div>
    );
  }

  // Remove duplicates and limit to top 5 patterns
  const uniquePatterns = removeDuplicatePatterns(patterns).slice(0, 5);

  return (
    <div className="flex flex-wrap gap-2">
      {uniquePatterns.map((pattern) => {
        const isSelected = pattern.name === selectedPattern;
        const colorClass = getPatternDirectionColor(pattern.direction, isSelected);

        return (
          <Badge
            key={`${pattern.name}-${pattern.confidence}`}
            className={`cursor-pointer transition-colors ${colorClass}`}
            onClick={() => onPatternSelect(pattern.name)}
          >
            {pattern.name} ({pattern.confidence}%)
          </Badge>
        );
      })}
    </div>
  );
};

export default PatternBadges;