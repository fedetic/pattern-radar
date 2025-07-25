import { Pattern } from '../hooks/usePatternData';

export interface PatternInfo {
  meaning: string;
  significance: string;
  trading: string;
  reliability: string;
}

export const getPatternInfo = (patternName: string, direction: string): PatternInfo => {
  const patternInfoMap: { [key: string]: PatternInfo } = {
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
      meaning: direction === "bullish" 
        ? "A large bullish candle that engulfs the previous bearish candle." 
        : "A large bearish candle that engulfs the previous bullish candle.",
      significance: direction === "bullish" 
        ? "Strong bullish reversal signal showing buying pressure." 
        : "Strong bearish reversal signal showing selling pressure.",
      trading: direction === "bullish" 
        ? "Consider long positions with stops below the pattern low." 
        : "Consider short positions with stops above the pattern high.",
      reliability: "Very High - one of the most reliable reversal patterns"
    }
    // Add more patterns as needed...
  };

  return patternInfoMap[patternName] || {
    meaning: "Pattern details not available. This is a detected pattern in the market data.",
    significance: "Technical analysis pattern that may indicate potential price movement.",
    trading: "Analyze the pattern context and wait for confirmation before making trading decisions.",
    reliability: "Variable - depends on market conditions and pattern context"
  };
};

export const getPatternStrengthColor = (strength: number): string => {
  if (strength >= 80) return "bg-green-500";
  if (strength >= 60) return "bg-yellow-500";
  return "bg-red-500";
};

export const getPatternDirectionColor = (direction: string, isSelected: boolean = false): string => {
  const baseColors = {
    bullish: isSelected 
      ? 'bg-green-500/20 border-white text-white ring-2 ring-white/50 hover:bg-green-500/30 hover:ring-white/70'
      : 'bg-green-500/20 border-green-500/30 text-green-400 hover:bg-green-500/30',
    bearish: isSelected
      ? 'bg-red-500/20 border-white text-white ring-2 ring-white/50 hover:bg-red-500/30 hover:ring-white/70'
      : 'bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500/30',
    neutral: isSelected
      ? 'bg-white/20 border-white text-white ring-2 ring-white/50 hover:bg-white/30 hover:ring-white/70'
      : 'bg-white/20 border-white/30 text-white hover:bg-white/30'
  };

  return baseColors[direction as keyof typeof baseColors] || baseColors.neutral;
};

export const getPatternDuration = (patternName: string): number => {
  const singleCandle = ['Doji', 'Hammer', 'Hanging Man', 'Shooting Star', 'Dragonfly Doji', 'Gravestone Doji', 'Marubozu', 'Spinning Top'];
  const twoCandle = ['Engulfing Pattern', 'Piercing Pattern', 'Dark Cloud Cover', 'Harami Pattern', 'Harami Cross', 'Thrusting Pattern'];
  const threeCandle = ['Morning Star', 'Evening Star', 'Three Black Crows', 'Three White Soldiers', 'Three Inside Up/Down', 'Three Outside Up/Down', 'Advance Block'];
  
  if (singleCandle.includes(patternName)) return 1;
  if (twoCandle.includes(patternName)) return 2;
  if (threeCandle.includes(patternName)) return 3;
  return 3; // Default
};

export const filterVisualizablePatterns = (patterns: Pattern[]): Pattern[] => {
  return patterns.filter(pattern => isPatternVisualizable(pattern));
};

export const isPatternVisualizable = (pattern: Pattern): boolean => {
  if (!pattern) return false;
  
  const coords = pattern.coordinates;
  if (!coords) {
    return !!(pattern.name && pattern.direction && pattern.category);
  }
  
  const coordType = coords.type;
  
  switch (coordType) {
    case 'pattern_range':
      return coords.start_time && coords.end_time && 
             coords.pattern_high !== undefined && coords.pattern_low !== undefined;
    
    case 'volume_pattern':
      return coords.timestamp && coords.volume !== undefined;
    
    case 'statistical_pattern':
      return coords.timestamp && coords.price !== undefined;
    
    case 'horizontal_line':
      return coords.level !== undefined && coords.start_time && coords.end_time;
    
    case 'harmonic_pattern':
      // RELAXED validation for harmonic patterns - be more tolerant
      const hasValidStructure = coords.points && Array.isArray(coords.points) && coords.points.length >= 3;
      
      let mostPointsValid = false;
      let validPointCount = 0;
      
      if (hasValidStructure) {
        coords.points.forEach(point => {
          if (!point) return;
          
          // More lenient timestamp validation
          const hasTimestamp = !!point.timestamp;
          let isValidTimestamp = false;
          if (hasTimestamp) {
            try {
              const date = new Date(point.timestamp);
              isValidTimestamp = !isNaN(date.getTime()) && date.getTime() > 0;
            } catch {
              isValidTimestamp = false;
            }
          }
          
          // More lenient price validation  
          const hasPrice = point.price !== undefined && point.price !== null;
          const isValidPrice = hasPrice && (typeof point.price === 'number') && !isNaN(point.price);
          
          if (hasTimestamp && isValidTimestamp && hasPrice && isValidPrice) {
            validPointCount++;
          }
        });
        
        // Allow pattern if at least 75% of points are valid (instead of 100%)
        mostPointsValid = validPointCount >= Math.ceil(coords.points.length * 0.75);
      }
      
      const isValid = hasValidStructure && mostPointsValid;
      
      // Debug logging for harmonic pattern validation
      console.log('🎵 HARMONIC PATTERN VALIDATION (RELAXED):', {
        patternName: pattern.name,
        hasPoints: !!coords.points,
        isArray: Array.isArray(coords.points),
        pointsLength: coords.points?.length || 0,
        hasValidStructure,
        validPointCount,
        totalPoints: coords.points?.length || 0,
        validPercentage: coords.points?.length ? (validPointCount / coords.points.length * 100).toFixed(1) + '%' : '0%',
        mostPointsValid,
        isValid,
        points: coords.points?.map((p, i) => {
          let timestampValid = false;
          try {
            if (p?.timestamp) {
              const date = new Date(p.timestamp);
              timestampValid = !isNaN(date.getTime()) && date.getTime() > 0;
            }
          } catch {}
          
          return {
            index: i,
            label: p?.label || `Point${i}`,
            hasTimestamp: !!p?.timestamp,
            timestampValid,
            hasPrice: p?.price !== undefined && p?.price !== null,
            priceValid: (typeof p?.price === 'number') && !isNaN(p?.price),
            timestamp: p?.timestamp,
            price: p?.price,
            isPointValid: timestampValid && (typeof p?.price === 'number') && !isNaN(p?.price)
          };
        }) || 'No points'
      });
      
      if (!isValid && coords.points && Array.isArray(coords.points)) {
        console.warn('🎵 HARMONIC PATTERN VALIDATION FAILED (RELAXED):', {
          patternName: pattern.name,
          reason: !hasValidStructure ? 
            `Need at least 3 points, got ${coords.points.length}` :
            `Only ${validPointCount}/${coords.points.length} points are valid (need 75%+)`,
          validPointCount,
          totalPoints: coords.points.length,
          requiredValidPoints: Math.ceil(coords.points.length * 0.75),
          validPercentage: (validPointCount / coords.points.length * 100).toFixed(1) + '%'
        });
      }
      
      return isValid;
    
    default:
      return !!(pattern.name && pattern.direction && pattern.category);
  }
};

export const removeDuplicatePatterns = (patterns: Pattern[]): Pattern[] => {
  return patterns.reduce((acc, current) => {
    const existing = acc.find(p => p.name === current.name);
    if (!existing || current.confidence > existing.confidence) {
      return [...acc.filter(p => p.name !== current.name), current];
    }
    return acc;
  }, [] as Pattern[]);
};