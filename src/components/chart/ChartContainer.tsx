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
    console.log('ChartContainer pattern lookup:', {
      selectedPattern,
      totalPatterns: patterns.length,
      patternNames: patterns.map(p => p.name)
    });
    
    const selectedPatternData = patterns.find(p => p.name === selectedPattern);
    
    if (!selectedPatternData) {
      console.log('No pattern found in ChartContainer for:', selectedPattern);
      return { patternShapes: [], patternAnnotations: [] };
    }
    
    if (!selectedPatternData.coordinates) {
      console.warn('Pattern found but has no coordinates - creating fallback visualization:', {
        name: selectedPatternData.name,
        hasCoordinates: !!selectedPatternData.coordinates
      });
      
      // Create fallback visualization for patterns without coordinates
      const fallbackAnnotations = [];
      if (chartData.length > 0) {
        const direction = selectedPatternData.direction;
        const color = direction === 'bullish' ? '#10B981' : direction === 'bearish' ? '#EF4444' : '#F59E0B';
        
        // Place annotation at the most recent data point
        const lastDataPoint = chartData[chartData.length - 1];
        fallbackAnnotations.push({
          x: lastDataPoint.x,
          y: lastDataPoint.high * 1.05,
          text: `${selectedPatternData.name}<br>${direction} Pattern<br>Confidence: ${selectedPatternData.confidence || 'N/A'}%`,
          showarrow: true,
          arrowhead: 2,
          arrowcolor: color,
          font: { color, size: 12 },
          bgcolor: 'rgba(0,0,0,0.8)',
          bordercolor: color,
          borderwidth: 1
        });
      }
      
      return { patternShapes: [], patternAnnotations: fallbackAnnotations };
    }

    const coords = selectedPatternData.coordinates;
    const shapes: any[] = [];
    const annotations: any[] = [];
    const direction = selectedPatternData.direction;
    const color = direction === 'bullish' ? '#10B981' : direction === 'bearish' ? '#EF4444' : '#F59E0B';

    // Handle different coordinate types with validation
    try {
      switch (coords.type) {
        case 'pattern_range':
          if (coords.start_time && coords.end_time && 
              coords.pattern_low !== undefined && coords.pattern_high !== undefined) {
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
          } else {
            console.warn('Invalid pattern_range coordinates:', coords);
          }
          break;
        
        case 'volume_pattern':
          if (coords.timestamp && coords.volume !== undefined) {
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
            } else {
              console.warn('No data point found for volume pattern timestamp:', coords.timestamp);
            }
          } else {
            console.warn('Invalid volume_pattern coordinates:', coords);
          }
          break;
          
        case 'statistical_pattern':
          if (coords.timestamp && coords.price !== undefined) {
            annotations.push({
              x: coords.timestamp,
              y: coords.price * 1.02,
              text: `${selectedPatternData.name}<br>${direction} ${selectedPatternData.confidence}%`,
              showarrow: true,
              arrowhead: 2,
              arrowcolor: color,
              font: { color, size: 12 },
              bgcolor: 'rgba(0,0,0,0.8)',
              bordercolor: color,
              borderwidth: 1
            });
          } else {
            console.warn('Invalid statistical_pattern coordinates:', coords);
          }
          break;
          
        case 'harmonic_pattern':
          console.log('🎵 HARMONIC PATTERN VISUALIZATION ATTEMPT:', {
            patternName: selectedPatternData.name,
            hasPoints: !!coords.points,
            isArray: Array.isArray(coords.points),
            pointsLength: coords.points?.length || 0,
            points: coords.points?.map(p => ({
              timestamp: p.timestamp,
              price: p.price,
              hasTimestamp: !!p.timestamp,
              hasPrice: p.price !== undefined
            })) || 'No points'
          });
          
          if (coords.points && Array.isArray(coords.points) && coords.points.length > 1) {
            let successfulShapes = 0;
            
            for (let i = 0; i < coords.points.length - 1; i++) {
              const point1 = coords.points[i];
              const point2 = coords.points[i + 1];
              
              console.log(`🎵 Connecting point ${i} to ${i+1}:`, {
                point1: { timestamp: point1.timestamp, price: point1.price },
                point2: { timestamp: point2.timestamp, price: point2.price },
                validPoint1: !!(point1.timestamp && point1.price !== undefined),
                validPoint2: !!(point2.timestamp && point2.price !== undefined)
              });
              
              if (point1.timestamp && point1.price !== undefined && 
                  point2.timestamp && point2.price !== undefined) {
                shapes.push({
                  type: 'line',
                  x0: point1.timestamp,
                  x1: point2.timestamp,
                  y0: point1.price,
                  y1: point2.price,
                  line: { color, width: 2, dash: 'dot' }
                });
                successfulShapes++;
              } else {
                console.warn('🎵 Invalid harmonic pattern point:', { 
                  point1: { timestamp: point1?.timestamp, price: point1?.price },
                  point2: { timestamp: point2?.timestamp, price: point2?.price }
                });
              }
            }
            
            console.log(`🎵 HARMONIC PATTERN SHAPES CREATED: ${successfulShapes} lines for pattern "${selectedPatternData.name}"`);
            
            // Add pattern annotation at first point
            if (coords.points.length > 0 && coords.points[0].timestamp && coords.points[0].price !== undefined) {
              annotations.push({
                x: coords.points[0].timestamp,
                y: coords.points[0].price * 1.02,
                text: `${selectedPatternData.name}<br>Harmonic Pattern`,
                showarrow: true,
                arrowhead: 2,
                arrowcolor: color,
                font: { color, size: 12 },
                bgcolor: 'rgba(0,0,0,0.8)',
                bordercolor: color,
                borderwidth: 1
              });
            }
          } else {
            console.warn('🎵 Invalid harmonic_pattern coordinates:', {
              hasPoints: !!coords.points,
              isArray: Array.isArray(coords.points),
              length: coords.points?.length || 0,
              coords
            });
            
            // Create fallback annotation for invalid harmonic patterns
            if (chartData.length > 0) {
              const lastDataPoint = chartData[chartData.length - 1];
              annotations.push({
                x: lastDataPoint.x,
                y: lastDataPoint.high * 1.05,
                text: `${selectedPatternData.name}<br>Harmonic Pattern<br>(Invalid Coordinates)`,
                showarrow: true,
                arrowhead: 2,
                arrowcolor: '#EF4444',
                font: { color: '#EF4444', size: 10 },
                bgcolor: 'rgba(0,0,0,0.8)',
                bordercolor: '#EF4444',
                borderwidth: 1
              });
            }
          }
          break;
          
        case 'horizontal_line':
          if (coords.level !== undefined && chartData.length > 0) {
            shapes.push({
              type: 'line',
              x0: coords.start_time || chartData[0]?.x,
              x1: coords.end_time || chartData[chartData.length - 1]?.x,
              y0: coords.level,
              y1: coords.level,
              line: { color: coords.highlight_color || color, width: 2, dash: 'dash' }
            });
          } else {
            console.warn('Invalid horizontal_line coordinates:', coords);
          }
          break;
          
        default:
          console.warn('Unknown coordinate type:', coords.type);
          // Create fallback annotation for unknown coordinate types
          if (chartData.length > 0) {
            const lastDataPoint = chartData[chartData.length - 1];
            annotations.push({
              x: lastDataPoint.x,
              y: lastDataPoint.high * 1.05,
              text: `${selectedPatternData.name}<br>${direction} Pattern<br>Unknown Type: ${coords.type}`,
              showarrow: true,
              arrowhead: 2,
              arrowcolor: color,
              font: { color, size: 10 },
              bgcolor: 'rgba(0,0,0,0.8)',
              bordercolor: color,
              borderwidth: 1
            });
          }
          break;
      }
    } catch (error) {
      console.error('Error creating pattern visualization:', error, coords);
      // Create error fallback annotation
      if (chartData.length > 0) {
        const lastDataPoint = chartData[chartData.length - 1];
        annotations.push({
          x: lastDataPoint.x,
          y: lastDataPoint.high * 1.05,
          text: `${selectedPatternData.name}<br>Visualization Error`,
          showarrow: true,
          arrowhead: 2,
          arrowcolor: '#EF4444',
          font: { color: '#EF4444', size: 10 },
          bgcolor: 'rgba(0,0,0,0.8)',
          bordercolor: '#EF4444',
          borderwidth: 1
        });
      }
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

  const plotKey = `pattern-${selectedPattern || 'none'}-${patterns.length}`;
  
  console.log('🔄 CHART RENDER:', {
    selectedPattern,
    plotKey,
    shapesCount: patternShapes.length,
    annotationsCount: patternAnnotations.length,
    willForceRerender: true
  });

  return (
    <Plot
      key={plotKey}
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