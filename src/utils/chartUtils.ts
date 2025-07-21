export interface ChartData {
  x: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  index: number;
}

export interface PriceStats {
  current: number;
  change: number;
  changePercent: number;
  high24h: number;
  low24h: number;
  marketCap?: number;
  marketCapRank?: number;
  priceChange24h?: number;
  volume24h?: number;
}

export const processMarketData = (marketData: any[]): ChartData[] => {
  if (!marketData || marketData.length === 0) return [];
  
  try {
    return marketData.map((item, index) => ({
      x: item.timestamp,
      open: Number(item.open),
      high: Number(item.high),
      low: Number(item.low),
      close: Number(item.close),
      volume: Number(item.volume) || 0,
      index,
    })).sort((a, b) => new Date(a.x).getTime() - new Date(b.x).getTime());
  } catch (error) {
    console.error('Error processing market data:', error);
    return [];
  }
};

export const calculatePriceStats = (
  chartData: ChartData[], 
  marketInfo: any, 
  timeframe: string
): PriceStats | null => {
  if (chartData.length === 0) return null;
  
  try {
    const latest = chartData[chartData.length - 1];
    const previous = chartData[chartData.length - 2];
    
    const change = previous ? latest.close - previous.close : 0;
    const changePercent = previous ? ((change / previous.close) * 100) : 0;
    
    // Calculate timeframe-specific ranges
    const timeframePeriods = {
      '1h': Math.min(24, chartData.length),
      '4h': Math.min(24, chartData.length), 
      '1d': Math.min(30, chartData.length),
      '1w': Math.min(52, chartData.length),
      '1m': Math.min(12, chartData.length)
    };
    
    const period = timeframePeriods[timeframe as keyof typeof timeframePeriods] || 24;
    const periodData = chartData.slice(-period);
    
    return {
      current: latest.close,
      change,
      changePercent,
      high24h: Math.max(...periodData.map(d => d.high)),
      low24h: Math.min(...periodData.map(d => d.low)),
      marketCap: marketInfo?.market_cap,
      marketCapRank: marketInfo?.market_cap_rank,
      priceChange24h: marketInfo?.price_change_percentage_24h,
      volume24h: marketInfo?.total_volume,
    };
  } catch (error) {
    console.error('Error calculating price stats:', error);
    return null;
  }
};

export const formatPrice = (price: number): string => {
  if (price >= 1000) {
    return `$${price.toLocaleString()}`;
  } else if (price >= 1) {
    return `$${price.toFixed(2)}`;
  } else {
    return `$${price.toFixed(4)}`;
  }
};

export const formatMarketCap = (marketCap: number): string => {
  if (marketCap >= 1e12) {
    return `$${(marketCap / 1e12).toFixed(2)}T`;
  } else if (marketCap >= 1e9) {
    return `$${(marketCap / 1e9).toFixed(2)}B`;
  } else if (marketCap >= 1e6) {
    return `$${(marketCap / 1e6).toFixed(2)}M`;
  } else {
    return `$${marketCap.toLocaleString()}`;
  }
};

export const formatVolume = (volume: number): string => {
  if (volume >= 1e9) {
    return `${(volume / 1e9).toFixed(2)}B`;
  } else if (volume >= 1e6) {
    return `${(volume / 1e6).toFixed(2)}M`;
  } else if (volume >= 1e3) {
    return `${(volume / 1e3).toFixed(2)}K`;
  } else {
    return volume.toString();
  }
};

export const getTimeframeLabel = (timeframe: string): string => {
  const labels: { [key: string]: string } = {
    '1h': '24h',
    '4h': '7d',
    '1d': '30d',
    '1w': '52w',
    '1m': '12m'
  };
  
  return labels[timeframe] || timeframe;
};