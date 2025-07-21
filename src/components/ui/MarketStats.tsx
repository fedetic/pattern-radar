import React from 'react';
import { TrendingUp, TrendingDown, Volume2, DollarSign, Clock } from 'lucide-react';
import { PriceStats, formatPrice, formatMarketCap, getTimeframeLabel } from '../../utils/chartUtils';

interface MarketStatsProps {
  priceStats: PriceStats | null;
  timeframe: string;
  patternCount: number;
  loadingPatterns: boolean;
}

const MarketStats: React.FC<MarketStatsProps> = ({
  priceStats,
  timeframe,
  patternCount,
  loadingPatterns
}) => {
  const StatCard: React.FC<{
    icon: React.ReactNode;
    label: string;
    value: string;
    subValue?: string;
    color?: string;
  }> = ({ icon, label, value, subValue, color = 'text-foreground' }) => (
    <div className="bg-background/30 backdrop-blur-sm border border-border/50 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <div className={`text-lg font-semibold ${color}`}>
        {value}
      </div>
      {subValue && (
        <div className={`text-xs ${color.includes('green') || color.includes('red') ? color : 'text-muted-foreground'}`}>
          {subValue}
        </div>
      )}
    </div>
  );

  const priceColor = priceStats?.change && priceStats.change >= 0 ? 'text-green-400' : 'text-red-400';
  const changePrefix = priceStats?.change && priceStats?.change >= 0 ? '+' : '';

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <StatCard
        icon={<TrendingUp className={`h-4 w-4 ${priceColor}`} />}
        label="Price"
        value={priceStats?.current ? formatPrice(priceStats.current) : 'Loading...'}
        subValue={priceStats ? `${changePrefix}${priceStats.changePercent.toFixed(2)}%` : ''}
        color={priceColor}
      />
      
      <StatCard
        icon={<TrendingUp className="h-4 w-4 text-blue-400" />}
        label="High"
        value={priceStats?.high24h ? formatPrice(priceStats.high24h) : 'Loading...'}
        subValue={getTimeframeLabel(timeframe)}
      />
      
      <StatCard
        icon={<TrendingDown className="h-4 w-4 text-red-400" />}
        label="Low"
        value={priceStats?.low24h ? formatPrice(priceStats.low24h) : 'Loading...'}
        subValue={getTimeframeLabel(timeframe)}
      />
      
      <StatCard
        icon={<DollarSign className="h-4 w-4 text-blue-500" />}
        label="Market Cap"
        value={priceStats?.marketCap ? formatMarketCap(priceStats.marketCap) : 'Loading...'}
        subValue={priceStats?.marketCapRank ? `Rank #${priceStats.marketCapRank}` : ''}
      />
      
      <StatCard
        icon={<Clock className={`h-4 w-4 ${loadingPatterns ? 'text-blue-400 animate-spin' : 'text-yellow-400'}`} />}
        label="Patterns"
        value={loadingPatterns ? '...' : patternCount.toString()}
        subValue={loadingPatterns ? 'Analyzing...' : 'Visualizable'}
        color={loadingPatterns ? 'text-blue-400' : 'text-green-400'}
      />
    </div>
  );
};

export default MarketStats;