import { renderHook, act } from '@testing-library/react';
import { usePatternData } from '../usePatternData';

// Mock fetch globally
global.fetch = jest.fn();

describe('usePatternData', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => usePatternData());
    
    expect(result.current.patternData).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(typeof result.current.fetchPatterns).toBe('function');
    expect(typeof result.current.fetchFilteredPatterns).toBe('function');
  });

  it('should handle successful pattern fetching', async () => {
    const mockPatternData = {
      patterns: [
        {
          name: 'Test Pattern',
          category: 'Candle',
          confidence: 85,
          direction: 'bullish',
          description: 'Test description'
        }
      ],
      market_data: [
        {
          timestamp: '2023-01-01T00:00:00Z',
          open: 100,
          high: 105,
          low: 95,
          close: 102
        }
      ],
      market_info: {
        market_cap: 1000000000,
        market_cap_rank: 1
      },
      strongest_pattern: {
        name: 'Test Pattern',
        confidence: 85
      }
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockPatternData)
    });

    const { result } = renderHook(() => usePatternData());
    
    await act(async () => {
      await result.current.fetchPatterns('bitcoin', '1d', 30);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.patternData).toEqual({
      patterns: mockPatternData.patterns,
      marketData: mockPatternData.market_data,
      marketInfo: mockPatternData.market_info,
      strongestPattern: mockPatternData.strongest_pattern
    });
  });

  it('should handle fetch errors', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => usePatternData());
    
    await act(async () => {
      await result.current.fetchPatterns('bitcoin', '1d', 30);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('Network error');
    expect(result.current.patternData).toEqual({
      patterns: [],
      marketData: [],
      marketInfo: null
    });
  });

  it('should handle HTTP errors', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404
    });

    const { result } = renderHook(() => usePatternData());
    
    await act(async () => {
      await result.current.fetchPatterns('bitcoin', '1d', 30);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('Failed to fetch patterns: 404');
    expect(result.current.patternData).toEqual({
      patterns: [],
      marketData: [],
      marketInfo: null
    });
  });

  it('should handle filtered pattern fetching', async () => {
    const mockFilteredData = {
      patterns: [
        {
          name: 'Filtered Pattern',
          category: 'Chart',
          confidence: 75,
          direction: 'bearish',
          description: 'Filtered test description'
        }
      ],
      market_data: [],
      market_info: null,
      strongest_pattern: null
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockFilteredData)
    });

    const { result } = renderHook(() => usePatternData());
    
    await act(async () => {
      await result.current.fetchFilteredPatterns(
        'ethereum', 
        '2023-01-01T00:00:00Z', 
        '2023-01-31T00:00:00Z', 
        '1d'
      );
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.patternData?.patterns).toHaveLength(1);
    expect(result.current.patternData?.patterns[0].name).toBe('Filtered Pattern');
    
    // Check that the correct URL was called
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/patterns/ethereum/filtered')
    );
  });

  it('should not fetch if coinId is empty', async () => {
    const { result } = renderHook(() => usePatternData());
    
    await act(async () => {
      await result.current.fetchPatterns('', '1d', 30);
    });

    expect(fetch).not.toHaveBeenCalled();
    expect(result.current.patternData).toBeNull();
  });

  it('should set loading state correctly', async () => {
    let resolvePromise: (value: any) => void;
    const mockPromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    (fetch as jest.Mock).mockReturnValueOnce(mockPromise);

    const { result } = renderHook(() => usePatternData());
    
    act(() => {
      result.current.fetchPatterns('bitcoin', '1d', 30);
    });

    // Should be loading
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();

    // Resolve the promise
    await act(async () => {
      resolvePromise!({
        ok: true,
        json: () => Promise.resolve({ patterns: [], market_data: [], market_info: null })
      });
    });

    // Should not be loading anymore
    expect(result.current.loading).toBe(false);
  });
});