'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/hooks/use-language';
import Image from 'next/image';
import type { Stock } from './types';

interface StockDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  stock: Stock | null;
}

export const StockDetailModal = ({ isOpen, onClose, stock }: StockDetailModalProps) => {
  const { t } = useLanguage();
  const [period, setPeriod] = React.useState('yearly');
  const [amount, setAmount] = React.useState('');
  const [shares, setShares] = React.useState('');
  const [animationKey, setAnimationKey] = React.useState(0);

  React.useEffect(() => {
    if (isOpen) {
      setAnimationKey(prev => prev + 1);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setAmount('');
      setShares('');
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, period]);

  const TRANSACTION_FEE = 1;
  const availableBalance = 10000;
  const numericAmount = parseFloat(amount) || 0;
  const totalCost = numericAmount + TRANSACTION_FEE;
  const maxAmount = availableBalance - TRANSACTION_FEE;
  const numberOfShares = stock && numericAmount > 0 ? numericAmount / stock.currentPrice : 0;
  const canBuy = numericAmount > 0 && totalCost <= availableBalance;

  const chartConfig = React.useMemo(() => ({
    value: {
      label: stock?.symbol || '',
      color: 'hsl(262, 83%, 58%)',
    },
  }), [stock?.symbol]) satisfies ChartConfig;

  const chartDataCacheRef = React.useRef<Record<string, Array<{ date: string; value: number }>>>({});

  const chartData = React.useMemo(() => {
    if (!stock) return [];

    const cacheKey = `${stock.symbol}-${period}`;
    if (chartDataCacheRef.current[cacheKey]) {
      return chartDataCacheRef.current[cacheKey];
    }

    const basePrice = stock.currentPrice;
    let newData: Array<{ date: string; value: number }> = [];

    if (period === 'monthly') {
      newData = Array.from({ length: 30 }, (_, i) => ({
        date: new Date(2024, 11, i + 1).toISOString().split('T')[0],
        value: basePrice * (0.85 + Math.random() * 0.3),
      }));
    } else if (period === 'weekly') {
      newData = Array.from({ length: 7 }, (_, i) => ({
        date: new Date(2024, 11, 18 + i).toISOString().split('T')[0],
        value: basePrice * (0.95 + Math.random() * 0.1),
      }));
    } else {
      newData = Array.from({ length: 12 }, (_, i) => ({
        date: new Date(2024, i, 1).toISOString().split('T')[0],
        value: basePrice * (0.7 + Math.random() * 0.6),
      }));
    }

    chartDataCacheRef.current[cacheKey] = newData;
    return newData;
  }, [stock?.symbol, stock?.currentPrice, period]);

  const memoizedChart = React.useMemo(() => (
    <div key={animationKey} className="relative">
      <style>{`
        @keyframes drawLine {
          to {
            stroke-dashoffset: 0;
          }
        }
        .animate-draw-line path {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: drawLine 2s ease-out forwards;
        }
      `}</style>
      <ChartContainer config={chartConfig} className="aspect-auto h-[300px] w-full">
        <LineChart
          accessibilityLayer
          data={chartData}
          margin={{ left: 12, right: 12 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={32}
            tickFormatter={(value) => {
              const date = new Date(value);
              return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            }}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                className="w-[150px]"
                nameKey="value"
                labelFormatter={(value) => {
                  return new Date(value).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  });
                }}
              />
            }
          />
          <Line
            dataKey="value"
            type="monotone"
            stroke="hsl(262, 83%, 58%)"
            strokeWidth={2}
            dot={false}
            className="animate-draw-line"
            isAnimationActive={false}
          />
        </LineChart>
      </ChartContainer>
    </div>
  ), [animationKey, chartConfig, chartData]);

  if (!stock) return null;

  const handleAmountChange = (value: string) => {
    setAmount(value);
    const numAmount = parseFloat(value) || 0;
    const calculatedShares = numAmount > 0 ? numAmount / stock.currentPrice : 0;
    setShares(numAmount > 0 ? calculatedShares.toFixed(2) : '');
  };

  const handleSharesChange = (value: string) => {
    setShares(value);
    const numShares = parseFloat(value) || 0;
    const calculatedAmount = numShares > 0 ? numShares * stock.currentPrice : 0;
    setAmount(numShares > 0 ? calculatedAmount.toFixed(2) : '');
  };

  const handleBuy = () => {
    if (canBuy) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl border bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between border-b px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-gray-100">
                    <Image src={stock.logo} alt={stock.symbol} width={48} height={48} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{stock.symbol}</h2>
                    <p className="text-sm text-gray-500">{stock.name}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-gray-100"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <div className="rounded-xl border bg-white p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">{t('dashboard.investmentPage.currentPrice')}</p>
                        <p className="text-3xl font-bold text-gray-900">{stock.price}</p>
                      </div>
                      <Select value={period} onValueChange={setPeriod}>
                        <SelectTrigger className="h-9 w-[115px] text-xs sm:h-10 sm:w-[140px] sm:text-sm">
                          <SelectValue placeholder={t('dashboard.investmentPage.selectPeriod')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yearly">{t('dashboard.yearly')}</SelectItem>
                          <SelectItem value="monthly">{t('dashboard.monthly')}</SelectItem>
                          <SelectItem value="weekly">{t('dashboard.weekly')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {memoizedChart}
                  </div>
                </div>

                <div className="lg:col-span-1">
                  <div className="rounded-xl border bg-white p-6">
                    <h3 className="mb-4 text-lg font-semibold text-gray-900">{t('dashboard.investmentPage.buyShares')}</h3>

                    <div className="space-y-4">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">{t('dashboard.investmentPage.amountToInvest')}</label>
                        <input
                          type="number"
                          value={amount}
                          onChange={(e) => handleAmountChange(e.target.value)}
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                          max={maxAmount}
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          {t('dashboard.investmentPage.availableBalance')}: €{availableBalance.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}
                        </p>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">{t('dashboard.investmentPage.numberOfShares')}</label>
                        <input
                          type="number"
                          value={shares}
                          onChange={(e) => handleSharesChange(e.target.value)}
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          {t('dashboard.investmentPage.pricePerShare')}: €{stock.currentPrice.toFixed(2)}
                        </p>
                      </div>

                      <div className="rounded-lg bg-gray-50 p-4">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">{t('dashboard.investmentPage.pricePerShare')}</span>
                            <span className="font-medium text-gray-900">€{stock.currentPrice.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">{t('dashboard.investmentPage.numberOfShares')}</span>
                            <span className="font-medium text-gray-900">{numberOfShares.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">{t('dashboard.investmentPage.transactionFee')}</span>
                            <span className="font-medium text-gray-900">€{TRANSACTION_FEE.toFixed(2)}</span>
                          </div>
                          <div className="border-t border-gray-200 pt-2">
                            <div className="flex justify-between">
                              <span className="font-semibold text-gray-900">{t('dashboard.investmentPage.total')}</span>
                              <span className="font-semibold text-gray-900">€{totalCost.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {numericAmount > maxAmount && (
                        <p className="text-sm text-red-600">{t('dashboard.investmentPage.insufficientBalance')}</p>
                      )}

                      <button
                        onClick={handleBuy}
                        disabled={!canBuy}
                        className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
                      >
                        {t('dashboard.investmentPage.buy')} {numberOfShares > 0 ? `${numberOfShares.toFixed(2)} ${numberOfShares >= 1 ? t('dashboard.investmentPage.shares') : t('dashboard.investmentPage.share')}` : ''}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
