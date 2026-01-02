import { STOCK_COLORS } from '@/constants/investment';

export const getAvatarUrl = (symbol: string, bgColor: string = '6366f1') =>
  `https://ui-avatars.com/api/?name=${symbol}&background=${bgColor}&color=fff&size=128&bold=true`;

export const formatCurrency = (value: number) =>
  `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const formatPercent = (value: number) =>
  `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;

export const getStockColor = (symbol: string) => STOCK_COLORS[symbol] || '6366f1';

export const mapPeriodToAPI = (period: 'yearly' | 'monthly' | 'weekly'): 'year' | 'month' | 'week' => {
  const mapping = {
    yearly: 'year' as const,
    monthly: 'month' as const,
    weekly: 'week' as const,
  };
  return mapping[period];
};
