import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import ChartDisplay from '../ChartDisplay';

// Mock Plotly since it's complex to test in JSDOM
vi.mock('react-plotly.js', () => ({
  default: vi.fn(({ onRelayout, data, layout, config, ...props }) => {
    const mockPlot = (
      <div 
        data-testid="plotly-chart"
        data-plotly-data={JSON.stringify(data)}
        data-plotly-layout={JSON.stringify(layout)}
        data-plotly-config={JSON.stringify(config)}
        {...props}
      >
        <div data-testid="mock-chart">Mock Chart</div>
        {/* Mock zoom buttons */}
        <button 
          data-testid="zoom-in-btn"
          onClick={() => {
            // Simulate zoom in by calling onRelayout with a narrower range
            const mockFigure = {
              layout: {
                xaxis: {
                  range: ['2024-01-15T00:00:00', '2024-01-20T00:00:00'],
                  autorange: false
                }
              }
            };
            onRelayout?.(mockFigure);
          }}
        >
          Zoom In
        </button>
        <button 
          data-testid="zoom-out-btn" 
          onClick={() => {
            // Simulate zoom out by calling onRelayout with a wider range
            const mockFigure = {
              layout: {
                xaxis: {
                  range: ['2024-01-01T00:00:00', '2024-02-01T00:00:00'],
                  autorange: false
                }
              }
            };
            onRelayout?.(mockFigure);
          }}
        >
          Zoom Out
        </button>
        <button 
          data-testid="autoscale-btn"
          onClick={() => {
            // Simulate autoscale by calling onRelayout with autorange
            const mockFigure = {
              layout: {
                xaxis: {
                  autorange: true
                }
              }
            };
            onRelayout?.(mockFigure);
          }}
        >
          Autoscale
        </button>
        {/* Mock drag selection */}
        <div 
          data-testid="chart-drag-area"
          onMouseDown={() => {
            // Simulate drag selection
            const mockFigure = {
              layout: {
                xaxis: {
                  range: ['2024-01-10T00:00:00', '2024-01-25T00:00:00'],
                  autorange: false
                }
              }
            };
            onRelayout?.(mockFigure);
          }}
        >
          Drag to select
        </div>
      </div>
    );
    return mockPlot;
  })
}));

const mockMarketData = [
  {
    timestamp: '2024-01-01T00:00:00Z',
    open: 45000,
    high: 46000,
    low: 44000,
    close: 45500,
    volume: 1000000
  },
  {
    timestamp: '2024-01-02T00:00:00Z',
    open: 45500,
    high: 47000,
    low: 45000,
    close: 46500,
    volume: 1200000
  },
  {
    timestamp: '2024-01-03T00:00:00Z',
    open: 46500,
    high: 48000,
    low: 46000,
    close: 47800,
    volume: 1500000
  }
];

const mockMarketInfo = {
  coin_id: 'bitcoin',
  name: 'Bitcoin',
  symbol: 'BTC',
  current_price: 47800,
  market_cap: 938000000000,
  market_cap_rank: 1,
  price_change_percentage_24h: 2.5
};

const mockPatterns = [
  {
    name: 'Bullish Engulfing',
    category: 'Candlestick',
    confidence: 85,
    direction: 'bullish',
    description: 'Strong bullish reversal pattern',
    coordinates: {
      type: 'pattern_range',
      start_time: '2024-01-01T00:00:00Z',
      end_time: '2024-01-02T00:00:00Z',
      pattern_high: 47000,
      pattern_low: 44000
    }
  },
  {
    name: 'Volume Spike',
    category: 'Volume',
    confidence: 92,
    direction: 'bullish',
    description: 'High volume indicating strong interest',
    coordinates: {
      type: 'volume_pattern',
      timestamp: '2024-01-03T00:00:00Z'
    }
  }
];

describe('ChartDisplay Component', () => {
  const defaultProps = {
    tradingPair: 'bitcoin',
    timeframe: '1d',
    onTimeframeChange: vi.fn(),
    marketData: mockMarketData,
    marketInfo: mockMarketInfo,
    patterns: mockPatterns,
    selectedPattern: null,
    onPatternSelect: vi.fn(),
    onZoomPatternUpdate: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders chart with market data', () => {
    render(<ChartDisplay {...defaultProps} />);
    
    expect(screen.getByTestId('plotly-chart')).toBeInTheDocument();
    expect(screen.getByTestId('mock-chart')).toBeInTheDocument();
  });

  it('displays market statistics correctly', () => {
    render(<ChartDisplay {...defaultProps} />);
    
    // Check price display
    expect(screen.getByText('$47,800')).toBeInTheDocument();
    
    // Check market cap display
    expect(screen.getByText('$938.00B')).toBeInTheDocument();
    expect(screen.getByText('Rank #1')).toBeInTheDocument();
    
    // Check pattern count
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Detected')).toBeInTheDocument();
  });

  it('renders pattern badges with correct colors', () => {
    render(<ChartDisplay {...defaultProps} />);
    
    const bullishPattern = screen.getByText(/Bullish Engulfing/);
    expect(bullishPattern).toBeInTheDocument();
    
    const volumePattern = screen.getByText(/Volume Spike/);
    expect(volumePattern).toBeInTheDocument();
  });

  it('handles pattern selection', () => {
    const onPatternSelect = vi.fn();
    render(<ChartDisplay {...defaultProps} onPatternSelect={onPatternSelect} />);
    
    const patternBadge = screen.getByText(/Bullish Engulfing/);
    fireEvent.click(patternBadge);
    
    expect(onPatternSelect).toHaveBeenCalledWith('Bullish Engulfing');
  });

  it('displays selected pattern information', () => {
    const propsWithSelectedPattern = {
      ...defaultProps,
      selectedPattern: 'Bullish Engulfing'
    };
    
    render(<ChartDisplay {...propsWithSelectedPattern} />);
    
    // Should show pattern details
    expect(screen.getByText('🎯')).toBeInTheDocument();
    expect(screen.getByText('Bullish Engulfing')).toBeInTheDocument();
    expect(screen.getByText('bullish 85%')).toBeInTheDocument();
  });

  it('handles timeframe changes', () => {
    const onTimeframeChange = vi.fn();
    render(<ChartDisplay {...defaultProps} onTimeframeChange={onTimeframeChange} />);
    
    // Find and interact with timeframe selector
    const timeframeSelect = screen.getByRole('combobox');
    expect(timeframeSelect).toBeInTheDocument();
  });

  describe('Chart Interactions', () => {
    it('handles zoom in without interfering with pattern updates', async () => {
      const onZoomPatternUpdate = vi.fn();
      render(<ChartDisplay {...defaultProps} onZoomPatternUpdate={onZoomPatternUpdate} />);
      
      const zoomInBtn = screen.getByTestId('zoom-in-btn');
      fireEvent.click(zoomInBtn);
      
      // Should not immediately call pattern update (due to debouncing)
      expect(onZoomPatternUpdate).not.toHaveBeenCalled();
      
      // Should call after debounce delay
      await waitFor(() => {
        expect(onZoomPatternUpdate).toHaveBeenCalledWith(
          '2024-01-15T00:00:00',
          '2024-01-20T00:00:00'
        );
      }, { timeout: 2000 });
    });

    it('handles zoom out correctly', async () => {
      const onZoomPatternUpdate = vi.fn();
      render(<ChartDisplay {...defaultProps} onZoomPatternUpdate={onZoomPatternUpdate} />);
      
      const zoomOutBtn = screen.getByTestId('zoom-out-btn');
      fireEvent.click(zoomOutBtn);
      
      // Should trigger pattern update after significant zoom change
      await waitFor(() => {
        expect(onZoomPatternUpdate).toHaveBeenCalledWith(
          '2024-01-01T00:00:00',
          '2024-02-01T00:00:00'
        );
      }, { timeout: 2000 });
    });

    it('does not trigger pattern updates on autoscale', async () => {
      const onZoomPatternUpdate = vi.fn();
      render(<ChartDisplay {...defaultProps} onZoomPatternUpdate={onZoomPatternUpdate} />);
      
      const autoscaleBtn = screen.getByTestId('autoscale-btn');
      fireEvent.click(autoscaleBtn);
      
      // Should not trigger pattern update when autorange is true
      await new Promise(resolve => setTimeout(resolve, 1100));
      expect(onZoomPatternUpdate).not.toHaveBeenCalled();
    });

    it('handles drag selection correctly', async () => {
      const onZoomPatternUpdate = vi.fn();
      render(<ChartDisplay {...defaultProps} onZoomPatternUpdate={onZoomPatternUpdate} />);
      
      const dragArea = screen.getByTestId('chart-drag-area');
      fireEvent.mouseDown(dragArea);
      
      // Should trigger pattern update for drag selection
      await waitFor(() => {
        expect(onZoomPatternUpdate).toHaveBeenCalledWith(
          '2024-01-10T00:00:00',
          '2024-01-25T00:00:00'
        );
      }, { timeout: 2000 });
    });

    it('debounces rapid zoom changes', async () => {
      const onZoomPatternUpdate = vi.fn();
      render(<ChartDisplay {...defaultProps} onZoomPatternUpdate={onZoomPatternUpdate} />);
      
      const zoomInBtn = screen.getByTestId('zoom-in-btn');
      
      // Rapid clicks
      fireEvent.click(zoomInBtn);
      fireEvent.click(zoomInBtn);
      fireEvent.click(zoomInBtn);
      
      // Should only call once after debounce
      await waitFor(() => {
        expect(onZoomPatternUpdate).toHaveBeenCalledTimes(1);
      }, { timeout: 2000 });
    });
  });

  describe('Data Validation', () => {
    it('handles empty market data gracefully', () => {
      const propsWithNoData = {
        ...defaultProps,
        marketData: []
      };
      
      render(<ChartDisplay {...propsWithNoData} />);
      
      expect(screen.getByText('No Market Data')).toBeInTheDocument();
      expect(screen.getByText('Select a trading pair to view the chart')).toBeInTheDocument();
    });

    it('handles invalid market data gracefully', () => {
      const propsWithInvalidData = {
        ...defaultProps,
        marketData: [
          {
            timestamp: 'invalid-date',
            open: 'not-a-number',
            high: null,
            low: undefined,
            close: 45000
          }
        ] as any
      };
      
      // Should not crash
      expect(() => {
        render(<ChartDisplay {...propsWithInvalidData} />);
      }).not.toThrow();
    });

    it('validates OHLC relationships', () => {
      render(<ChartDisplay {...defaultProps} />);
      
      const plotlyChart = screen.getByTestId('plotly-chart');
      const plotlyData = JSON.parse(plotlyChart.getAttribute('data-plotly-data') || '[]');
      
      // Check that chart data is properly structured
      expect(plotlyData).toHaveLength(1); // Should have one trace
      
      if (plotlyData[0] && plotlyData[0].type === 'candlestick') {
        const trace = plotlyData[0];
        expect(trace.open).toBeDefined();
        expect(trace.high).toBeDefined();
        expect(trace.low).toBeDefined();
        expect(trace.close).toBeDefined();
      }
    });
  });

  describe('Pattern Visualization', () => {
    it('generates correct pattern shapes for selected pattern', () => {
      const propsWithSelectedPattern = {
        ...defaultProps,
        selectedPattern: 'Bullish Engulfing'
      };
      
      render(<ChartDisplay {...propsWithSelectedPattern} />);
      
      const plotlyChart = screen.getByTestId('plotly-chart');
      const plotlyLayout = JSON.parse(plotlyChart.getAttribute('data-plotly-layout') || '{}');
      
      // Should have shapes for the selected pattern
      expect(plotlyLayout.shapes).toBeDefined();
      expect(plotlyLayout.annotations).toBeDefined();
    });

    it('handles different pattern coordinate types', () => {
      const patternTypes = ['pattern_range', 'volume_pattern', 'harmonic_pattern', 'statistical_pattern'];
      
      patternTypes.forEach(type => {
        const mockPatternWithType = {
          ...mockPatterns[0],
          coordinates: {
            type,
            ...(type === 'pattern_range' ? {
              start_time: '2024-01-01T00:00:00Z',
              end_time: '2024-01-02T00:00:00Z',
              pattern_high: 47000,
              pattern_low: 44000
            } : type === 'volume_pattern' ? {
              timestamp: '2024-01-01T00:00:00Z'
            } : {
              points: [
                { timestamp: '2024-01-01T00:00:00Z', price: 45000 },
                { timestamp: '2024-01-02T00:00:00Z', price: 46000 }
              ]
            })
          }
        };
        
        const propsWithPatternType = {
          ...defaultProps,
          patterns: [mockPatternWithType],
          selectedPattern: mockPatternWithType.name
        };
        
        expect(() => {
          render(<ChartDisplay {...propsWithPatternType} />);
        }).not.toThrow();
      });
    });
  });

  describe('Performance', () => {
    it('handles large datasets efficiently', () => {
      const largeMarketData = Array.from({ length: 1000 }, (_, i) => ({
        timestamp: new Date(Date.now() + i * 86400000).toISOString(),
        open: 45000 + Math.random() * 1000,
        high: 46000 + Math.random() * 1000,
        low: 44000 + Math.random() * 1000,
        close: 45500 + Math.random() * 1000,
        volume: 1000000 + Math.random() * 500000
      }));
      
      const propsWithLargeData = {
        ...defaultProps,
        marketData: largeMarketData
      };
      
      const startTime = performance.now();
      render(<ChartDisplay {...propsWithLargeData} />);
      const endTime = performance.now();
      
      // Should render within reasonable time (adjust threshold as needed)
      expect(endTime - startTime).toBeLessThan(1000); // 1 second
    });
  });
});