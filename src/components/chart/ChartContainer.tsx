import React, { useMemo, useRef, useCallback, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { PlotData, Layout, Config } from 'plotly.js';
import { ChartData } from '../../utils/chartUtils';
import { Pattern } from '../../hooks/usePatternData';

interface ChartContainerProps {
  chartData: ChartData[];
  chartType: 'candlestick' | 'line';
  showVolume: boolean;
  patterns: Pattern[];
  selectedPattern: string | null;
  onChartUpdate?: (figure: any) => void;
}

const ChartContainer: React.FC<ChartContainerProps> = ({
  chartData,
  chartType,
  showVolume,
  patterns,
  selectedPattern,
  onChartUpdate
}) => {
  const plotRef = useRef<any>(null);

  // Create main chart traces
  const plotlyData = useMemo(() => {
    const traces: any[] = [];
    
    if (chartData.length === 0) return traces;
    
    // Main price trace
    if (chartType === "candlestick") {
      traces.push({
        type: 'candlestick',
        x: chartData.map(d => d.x),
        open: chartData.map(d => d.open),
        high: chartData.map(d => d.high),
        low: chartData.map(d => d.low),
        close: chartData.map(d => d.close),
        increasing: { 
          line: { color: '#10B981', width: 1 },
          fillcolor: '#10B981'
        },
        decreasing: { 
          line: { color: '#EF4444', width: 1 },
          fillcolor: '#EF4444'
        },
        name: 'OHLC',
        showlegend: false,
        yaxis: 'y1',
        whiskerwidth: 0.8,
      });
    } else {
      traces.push({
        type: 'scatter',
        mode: 'lines',
        x: chartData.map(d => d.x),
        y: chartData.map(d => d.close),
        line: { color: '#3B82F6', width: 2 },
        name: 'Close Price',
        showlegend: false,
        yaxis: 'y1'
      });
    }
    
    // Volume trace if enabled
    if (showVolume) {
      traces.push({
        type: 'bar',
        x: chartData.map(d => d.x),
        y: chartData.map(d => d.volume || 0),
        marker: {
          color: chartData.map(d => 
            d.close > d.open 
              ? 'rgba(16, 185, 129, 0.6)' 
              : 'rgba(239, 68, 68, 0.6)'
          ),
          line: { width: 0 }
        },
        name: 'Volume',
        showlegend: false,
        yaxis: 'y2',
        hovertemplate: 'Volume: %{y:,.0f}<extra></extra>'
      });
    }
    
    return traces;
  }, [chartData, chartType, showVolume]);

  // Create pattern shapes and annotations
  const { patternShapes, patternAnnotations } = useMemo(() => {
    const selectedPatternData = patterns.find(p => p.name === selectedPattern);
    
    if (!selectedPatternData?.coordinates) {
      return { patternShapes: [], patternAnnotations: [] };
    }

    const coords = selectedPatternData.coordinates;
    const shapes: any[] = [];
    const annotations: any[] = [];
    const direction = selectedPatternData.direction;
    const color = direction === 'bullish' ? '#10B981' : direction === 'bearish' ? '#EF4444' : '#F59E0B';

    // Handle different coordinate types
    switch (coords.type) {
      case 'pattern_range':
        if (coords.start_time && coords.end_time) {
          shapes.push({
            type: 'rect',
            x0: coords.start_time,
            x1: coords.end_time,
            y0: coords.pattern_low,
            y1: coords.pattern_high,
            fillcolor: 'rgba(0,0,0,0)',
            line: { color, width: 3, dash: 'dot' }
          });
          
          annotations.push({
            x: coords.start_time,
            y: coords.pattern_high * 1.02,
            text: `${selectedPatternData.name}<br>${direction} ${selectedPatternData.confidence}%`,
            showarrow: true,
            arrowhead: 2,
            arrowcolor: color,
            font: { color, size: 12 },
            bgcolor: 'rgba(0,0,0,0.8)',
            bordercolor: color,
            borderwidth: 1
          });
        }
        break;
        
      case 'volume_pattern':
        if (coords.timestamp) {
          const dataPoint = chartData.find(d => d.x === coords.timestamp);
          if (dataPoint) {
            shapes.push({
              type: 'rect',
              xref: 'x',
              yref: 'y2',
              x0: coords.timestamp,
              x1: coords.timestamp,
              y0: 0,
              y1: (coords.volume || dataPoint.volume) * 1.2,
              fillcolor: color + '40',
              line: { color, width: 3 }
            });
          }
        }
        break;
        
      case 'harmonic_pattern':
        if (coords.points && coords.points.length > 1) {
          for (let i = 0; i < coords.points.length - 1; i++) {
            shapes.push({
              type: 'line',
              x0: coords.points[i].timestamp,
              x1: coords.points[i + 1].timestamp,
              y0: coords.points[i].price,
              y1: coords.points[i + 1].price,
              line: { color, width: 2, dash: 'dot' }
            });
          }
        }
        break;
        
      case 'horizontal_line':
        shapes.push({
          type: 'line',
          x0: chartData[0]?.x,
          x1: chartData[chartData.length - 1]?.x,
          y0: coords.level,
          y1: coords.level,
          line: { color: coords.highlight_color || color, width: 2, dash: 'dash' }
        });
        break;
    }

    return { patternShapes: shapes, patternAnnotations: annotations };
  }, [patterns, selectedPattern, chartData]);

  // Chart layout
  const plotlyLayout: Partial<Layout> = useMemo(() => {
    return {
      plot_bgcolor: 'rgba(0,0,0,0)',
      paper_bgcolor: 'rgba(0,0,0,0)',
      font: { color: '#e5e7eb', family: 'Inter, sans-serif' },
      margin: { l: 60, r: 80, t: 20, b: 60 },
      xaxis: {
        type: 'date',
        gridcolor: 'rgba(75, 85, 99, 0.2)',
        linecolor: 'rgba(75, 85, 99, 0.5)',
        tickcolor: 'rgba(75, 85, 99, 0.5)',
        showgrid: true,
        rangeslider: { visible: false },
        autorange: true,
      },
      yaxis: {
        domain: showVolume ? [0.27, 1] : [0, 1],
        gridcolor: 'rgba(75, 85, 99, 0.2)',
        linecolor: 'rgba(75, 85, 99, 0.5)',
        tickcolor: 'rgba(75, 85, 99, 0.5)',
        showgrid: true,
        tickformat: '.2f',
        autorange: true,
        side: 'left',
        title: { text: 'Price', font: { color: '#e5e7eb', size: 12 } }
      },
      ...(showVolume && {
        yaxis2: {
          domain: [0, 0.22],
          gridcolor: 'rgba(75, 85, 99, 0.1)',
          linecolor: 'rgba(75, 85, 99, 0.3)',
          tickcolor: 'rgba(75, 85, 99, 0.3)',
          showgrid: false,
          tickformat: '.2s',
          autorange: true,
          side: 'left',
          title: { text: 'Volume', font: { color: '#e5e7eb', size: 10 } },
          overlaying: 'y',
          anchor: 'x',
          rangemode: 'tozero'
        }
      }),
      shapes: patternShapes,
      annotations: patternAnnotations,
      showlegend: false,
      hovermode: 'x unified',
      bargap: 0.1,
      bargroupgap: 0.0,
    };
  }, [chartData, patternShapes, patternAnnotations, showVolume]);

  // Chart config
  const plotlyConfig: Partial<Config> = {
    displayModeBar: true,
    displaylogo: false,
    modeBarButtonsToRemove: ['lasso2d', 'select2d'],
    responsive: true,
  };

  const handleChartUpdate = useCallback((figure: any) => {
    if (onChartUpdate) {
      onChartUpdate(figure);
    }
  }, [onChartUpdate]);

  return (
    <Plot
      ref={plotRef}
      data={plotlyData}
      layout={plotlyLayout}
      config={plotlyConfig}
      style={{ width: '100%', height: '550px' }}
      useResizeHandler={true}
      onRelayout={handleChartUpdate}
    />
  );
};

export default ChartContainer;