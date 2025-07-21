import {
  getPatternInfo,
  getPatternStrengthColor,
  getPatternDirectionColor,
  getPatternDuration,
  filterVisualizablePatterns,
  isPatternVisualizable,
  removeDuplicatePatterns
} from '../patternUtils';
import { Pattern } from '../../hooks/usePatternData';

describe('patternUtils', () => {
  describe('getPatternInfo', () => {
    it('should return pattern info for known patterns', () => {
      const info = getPatternInfo('Doji', 'neutral');
      
      expect(info).toHaveProperty('meaning');
      expect(info).toHaveProperty('significance');
      expect(info).toHaveProperty('trading');
      expect(info).toHaveProperty('reliability');
      expect(info.meaning).toContain('opening and closing price');
    });

    it('should handle bullish engulfing pattern with direction', () => {
      const info = getPatternInfo('Engulfing Pattern', 'bullish');
      
      expect(info.meaning).toContain('bullish candle that engulfs');
      expect(info.significance).toContain('bullish reversal signal');
    });

    it('should handle bearish engulfing pattern with direction', () => {
      const info = getPatternInfo('Engulfing Pattern', 'bearish');
      
      expect(info.meaning).toContain('bearish candle that engulfs');
      expect(info.significance).toContain('bearish reversal signal');
    });

    it('should return default info for unknown patterns', () => {
      const info = getPatternInfo('Unknown Pattern', 'neutral');
      
      expect(info.meaning).toBe('Pattern details not available. This is a detected pattern in the market data.');
      expect(info.reliability).toBe('Variable - depends on market conditions and pattern context');
    });
  });

  describe('getPatternStrengthColor', () => {
    it('should return correct colors for strength levels', () => {
      expect(getPatternStrengthColor(85)).toBe('bg-green-500');
      expect(getPatternStrengthColor(65)).toBe('bg-yellow-500');
      expect(getPatternStrengthColor(45)).toBe('bg-red-500');
      expect(getPatternStrengthColor(80)).toBe('bg-green-500'); // Edge case
      expect(getPatternStrengthColor(60)).toBe('bg-yellow-500'); // Edge case
    });
  });

  describe('getPatternDirectionColor', () => {
    it('should return correct colors for bullish patterns', () => {
      const selectedColor = getPatternDirectionColor('bullish', true);
      const unselectedColor = getPatternDirectionColor('bullish', false);
      
      expect(selectedColor).toContain('bg-green-500/20');
      expect(selectedColor).toContain('ring-2 ring-white/50');
      expect(unselectedColor).toContain('bg-green-500/20');
      expect(unselectedColor).not.toContain('ring-2');
    });

    it('should return correct colors for bearish patterns', () => {
      const selectedColor = getPatternDirectionColor('bearish', true);
      const unselectedColor = getPatternDirectionColor('bearish', false);
      
      expect(selectedColor).toContain('bg-red-500/20');
      expect(selectedColor).toContain('ring-2 ring-white/50');
      expect(unselectedColor).toContain('bg-red-500/20');
      expect(unselectedColor).not.toContain('ring-2');
    });

    it('should return neutral colors for unknown directions', () => {
      const color = getPatternDirectionColor('unknown', false);
      expect(color).toContain('bg-white/20');
    });
  });

  describe('getPatternDuration', () => {
    it('should return correct durations for single candle patterns', () => {
      expect(getPatternDuration('Doji')).toBe(1);
      expect(getPatternDuration('Hammer')).toBe(1);
      expect(getPatternDuration('Shooting Star')).toBe(1);
    });

    it('should return correct durations for two candle patterns', () => {
      expect(getPatternDuration('Engulfing Pattern')).toBe(2);
      expect(getPatternDuration('Piercing Pattern')).toBe(2);
      expect(getPatternDuration('Harami Pattern')).toBe(2);
    });

    it('should return correct durations for three candle patterns', () => {
      expect(getPatternDuration('Morning Star')).toBe(3);
      expect(getPatternDuration('Evening Star')).toBe(3);
      expect(getPatternDuration('Three Black Crows')).toBe(3);
    });

    it('should return default duration for unknown patterns', () => {
      expect(getPatternDuration('Unknown Pattern')).toBe(3);
    });
  });

  describe('isPatternVisualizable', () => {
    it('should return false for null/undefined patterns', () => {
      expect(isPatternVisualizable(null as any)).toBe(false);
      expect(isPatternVisualizable(undefined as any)).toBe(false);
    });

    it('should return true for patterns without coordinates but with basic fields', () => {
      const pattern: Pattern = {
        id: '1',
        name: 'Test Pattern',
        category: 'Candle',
        confidence: 80,
        direction: 'bullish',
        description: 'Test description'
      };
      
      expect(isPatternVisualizable(pattern)).toBe(true);
    });

    it('should validate pattern_range coordinates', () => {
      const patternWithGoodCoords: Pattern = {
        id: '1',
        name: 'Test Pattern',
        category: 'Candle',
        confidence: 80,
        direction: 'bullish',
        description: 'Test description',
        coordinates: {
          type: 'pattern_range',
          start_time: '2023-01-01T00:00:00Z',
          end_time: '2023-01-02T00:00:00Z',
          pattern_high: 100,
          pattern_low: 95
        }
      };
      
      const patternWithBadCoords: Pattern = {
        id: '2',
        name: 'Test Pattern',
        category: 'Candle',
        confidence: 80,
        direction: 'bullish',
        description: 'Test description',
        coordinates: {
          type: 'pattern_range',
          start_time: '2023-01-01T00:00:00Z'
          // Missing required fields
        }
      };
      
      expect(isPatternVisualizable(patternWithGoodCoords)).toBe(true);
      expect(isPatternVisualizable(patternWithBadCoords)).toBe(false);
    });

    it('should validate volume_pattern coordinates', () => {
      const pattern: Pattern = {
        id: '1',
        name: 'Volume Pattern',
        category: 'Volume-Based',
        confidence: 80,
        direction: 'bullish',
        description: 'Test description',
        coordinates: {
          type: 'volume_pattern',
          timestamp: '2023-01-01T00:00:00Z',
          volume: 1000000
        }
      };
      
      expect(isPatternVisualizable(pattern)).toBe(true);
    });

    it('should validate harmonic_pattern coordinates', () => {
      const pattern: Pattern = {
        id: '1',
        name: 'Harmonic Pattern',
        category: 'Harmonic',
        confidence: 80,
        direction: 'bullish',
        description: 'Test description',
        coordinates: {
          type: 'harmonic_pattern',
          points: [
            { price: 100, timestamp: '2023-01-01T00:00:00Z' },
            { price: 105, timestamp: '2023-01-02T00:00:00Z' }
          ]
        }
      };
      
      expect(isPatternVisualizable(pattern)).toBe(true);
    });
  });

  describe('filterVisualizablePatterns', () => {
    it('should filter out non-visualizable patterns', () => {
      const patterns: Pattern[] = [
        {
          id: '1',
          name: 'Good Pattern',
          category: 'Candle',
          confidence: 80,
          direction: 'bullish',
          description: 'Test description'
        },
        {
          id: '2',
          name: '', // Invalid - missing name
          category: 'Candle',
          confidence: 80,
          direction: 'bullish',
          description: 'Test description'
        }
      ];
      
      const filtered = filterVisualizablePatterns(patterns);
      expect(filtered).toHaveLength(1);
      expect(filtered[0].id).toBe('1');
    });
  });

  describe('removeDuplicatePatterns', () => {
    it('should remove duplicate patterns keeping highest confidence', () => {
      const patterns: Pattern[] = [
        {
          id: '1',
          name: 'Doji',
          category: 'Candle',
          confidence: 70,
          direction: 'neutral',
          description: 'First doji'
        },
        {
          id: '2',
          name: 'Hammer',
          category: 'Candle',
          confidence: 85,
          direction: 'bullish',
          description: 'Hammer pattern'
        },
        {
          id: '3',
          name: 'Doji',
          category: 'Candle',
          confidence: 80,
          direction: 'neutral',
          description: 'Second doji'
        }
      ];
      
      const unique = removeDuplicatePatterns(patterns);
      
      expect(unique).toHaveLength(2);
      
      const dojiPattern = unique.find(p => p.name === 'Doji');
      const hammerPattern = unique.find(p => p.name === 'Hammer');
      
      expect(dojiPattern?.confidence).toBe(80); // Should keep higher confidence
      expect(dojiPattern?.id).toBe('3'); // Should be the second one
      expect(hammerPattern?.confidence).toBe(85);
    });

    it('should handle empty array', () => {
      const result = removeDuplicatePatterns([]);
      expect(result).toEqual([]);
    });

    it('should handle array with no duplicates', () => {
      const patterns: Pattern[] = [
        {
          id: '1',
          name: 'Doji',
          category: 'Candle',
          confidence: 70,
          direction: 'neutral',
          description: 'Doji pattern'
        },
        {
          id: '2',
          name: 'Hammer',
          category: 'Candle',
          confidence: 85,
          direction: 'bullish',
          description: 'Hammer pattern'
        }
      ];
      
      const result = removeDuplicatePatterns(patterns);
      expect(result).toEqual(patterns);
    });
  });
});