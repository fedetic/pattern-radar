import { useState, useCallback } from 'react';

interface ChartState {
  chartType: 'candlestick' | 'line';
  showVolume: boolean;
  selectedPattern: string | null;
  timeframe: string;
}

interface UseChartStateReturn {
  chartState: ChartState;
  setChartType: (type: 'candlestick' | 'line') => void;
  toggleVolume: () => void;
  setSelectedPattern: (pattern: string | null) => void;
  setTimeframe: (timeframe: string) => void;
  resetChart: () => void;
}

const defaultChartState: ChartState = {
  chartType: 'candlestick',
  showVolume: true,
  selectedPattern: null,
  timeframe: '1d'
};

export const useChartState = (initialState?: Partial<ChartState>): UseChartStateReturn => {
  const [chartState, setChartState] = useState<ChartState>({
    ...defaultChartState,
    ...initialState
  });

  const setChartType = useCallback((type: 'candlestick' | 'line') => {
    setChartState(prev => ({ ...prev, chartType: type }));
  }, []);

  const toggleVolume = useCallback(() => {
    setChartState(prev => ({ ...prev, showVolume: !prev.showVolume }));
  }, []);

  const setSelectedPattern = useCallback((pattern: string | null) => {
    setChartState(prev => ({ ...prev, selectedPattern: pattern }));
  }, []);

  const setTimeframe = useCallback((timeframe: string) => {
    setChartState(prev => ({ ...prev, timeframe }));
  }, []);

  const resetChart = useCallback(() => {
    setChartState(defaultChartState);
  }, []);

  return {
    chartState,
    setChartType,
    toggleVolume,
    setSelectedPattern,
    setTimeframe,
    resetChart
  };
};