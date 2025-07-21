import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Pattern } from '../../hooks/usePatternData';
import { getPatternInfo } from '../../utils/patternUtils';

interface PatternInfoProps {
  pattern: Pattern;
}

const PatternInfo: React.FC<PatternInfoProps> = ({ pattern }) => {
  const patternInfo = getPatternInfo(pattern.name, pattern.direction);

  return (
    <div className="mb-4 p-6 bg-primary/10 border border-primary/20 rounded-lg relative z-10">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">🎯</span>
        <span className="font-semibold text-primary text-lg">{pattern.name}</span>
        <Badge 
          variant="outline" 
          className={`${
            pattern.direction === 'bullish' ? 'text-green-400 border-green-400' : 
            pattern.direction === 'bearish' ? 'text-red-400 border-red-400' : 
            'text-yellow-400 border-yellow-400'
          }`}
        >
          {pattern.direction} {pattern.confidence}%
        </Badge>
      </div>
      
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
    </div>
  );
};

export default PatternInfo;