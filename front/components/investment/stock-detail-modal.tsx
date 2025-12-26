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

interface StockChartProps {
  symbol: string;
  currentPrice: number;
  period: string;
  animationKey: number;
}

const StockChart = React.memo<StockChartProps>(({ symbol, currentPrice, period, animationKey }) => {
  return (
    <div key={animationKey} className="relative">
      <style>{`
        @keyframes drawLine-${animationKey} {
          to {
            stroke-dashoffset: 0;
          }
        }
        .chart-line-${animationKey} path {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: drawLine-${animationKey} 2s ease-out forwards;
        }
      `}</style>
      <ChartContainer config={{
        value: {
          label: symbol,
          color: 'hsl(262, 83%, 58%)',
        },
      }} className="aspect-auto h-[300px] w-full">
        <LineChart
          accessibilityLayer
          data={(() => {
            const basePrice = currentPrice;
            let data: Array<{ date: string; value: number }> = [];
            if (period === 'monthly') {
              data = Array.from({ length: 30 }, (_, i) => ({
                date: new Date(2024, 11, i + 1).toISOString().split('T')[0],
                value: basePrice * (0.85 + Math.random() * 0.3),
              }));
            } else if (period === 'weekly') {
              data = Array.from({ length: 7 }, (_, i) => ({
                date: new Date(2024, 11, 18 + i).toISOString().split('T')[0],
                value: basePrice * (0.95 + Math.random() * 0.1),
              }));
            } else {
              data = Array.from({ length: 12 }, (_, i) => ({
                date: new Date(2024, i, 1).toISOString().split('T')[0],
                value: basePrice * (0.7 + Math.random() * 0.6),
              }));
            }
            return data;
          })()}
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
            className={`chart-line-${animationKey}`}
            isAnimationActive={false}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
});

StockChart.displayName = 'StockChart';

interface StockDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  stock: Stock | null;
  onPurchaseSuccess?: () => void;
}

export const StockDetailModal = ({ isOpen, onClose, stock, onPurchaseSuccess }: StockDetailModalProps) => {
  const { t } = useLanguage();
  const [period, setPeriod] = React.useState('yearly');
  const [amount, setAmount] = React.useState('');
  const [shares, setShares] = React.useState('');
  const [animationKey, setAnimationKey] = React.useState(0);
  const [availableBalance, setAvailableBalance] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isPurchasing, setIsPurchasing] = React.useState(false);
  const [error, setError] = React.useState('');
  const [isWarning, setIsWarning] = React.useState(false);
  const [orderType, setOrderType] = React.useState<'MARKET' | 'LIMIT'>('MARKET');
  const [limitPrice, setLimitPrice] = React.useState('');
  const [orderSide, setOrderSide] = React.useState<'BUY' | 'SELL'>('BUY');
  const [availableShares, setAvailableShares] = React.useState(0);
  const [pendingOrders, setPendingOrders] = React.useState<any[]>([]);
  const [orderBook, setOrderBook] = React.useState<{
    bids: Array<{ price: number; quantity: number }>;
    asks: Array<{ price: number; quantity: number }>;
  }>({ bids: [], asks: [] });

  const fetchPendingOrders = async () => {
    if (!stock) return;
    try {
      const response = await fetch(`http://localhost:3001/api/investment/orders?stockId=${stock.id}`, {
        credentials: 'include',
      });
      if (response.ok) {
        const orders = await response.json();
        // Filtrer pour afficher les ordres PENDING et PARTIAL (ordres actifs)
        const activeOrders = orders.filter((order: any) =>
          order.state === 'PENDING' || order.state === 'PARTIAL'
        );
        setPendingOrders(activeOrders);
      }
    } catch (error) {
      console.error('Error fetching pending orders:', error);
    }
  };

  const fetchOrderBook = async () => {
    if (!stock) return;
    try {
      const response = await fetch(`http://localhost:3001/api/investment/orderbook/${stock.id}`, {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setOrderBook({
          bids: data.bids.slice(0, 5), // Top 5 bids
          asks: data.asks.slice(0, 5), // Top 5 asks
        });
      }
    } catch (error) {
      console.error('Error fetching order book:', error);
    }
  };

  const cancelOrder = async (orderId: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/investment/order/${orderId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (response.ok) {
        await fetchPendingOrders();
        await fetchBalance();
        await fetchOrderBook();
        if (onPurchaseSuccess) {
          onPurchaseSuccess();
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to cancel order');
      }
    } catch (error) {
      console.error('Error canceling order:', error);
      setError('An error occurred while canceling order');
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      setAnimationKey(prev => prev + 1);
      document.body.style.overflow = 'hidden';
      fetchBalance();
      fetchAvailableShares();
      fetchPendingOrders();
      fetchOrderBook();
    } else {
      document.body.style.overflow = 'unset';
      setAmount('');
      setShares('');
      setError('');
      setIsWarning(false);
      setOrderType('MARKET');
      setLimitPrice('');
      setOrderSide('BUY');
      setPendingOrders([]);
      setOrderBook({ bids: [], asks: [] });
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Separate effect for chart animation when period changes
  React.useEffect(() => {
    if (isOpen) {
      setAnimationKey(prev => prev + 1);
    }
  }, [period, isOpen]);

  const fetchBalance = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/investment/balance', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setAvailableBalance(data.balance);
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAvailableShares = async () => {
    if (!stock) return;

    try {
      const response = await fetch('http://localhost:3001/api/investment/portfolio', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        const position = data.positions.find((p: any) => p.stockId === stock.id);
        setAvailableShares(position?.quantity || 0);
      }
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    }
  };

  const TRANSACTION_FEE = 1;
  const numericAmount = parseFloat(amount) || 0;
  const numericLimitPrice = parseFloat(limitPrice) || 0;
  const numericShares = parseFloat(shares) || 0;
  const effectivePrice = orderType === 'LIMIT' && numericLimitPrice > 0 ? numericLimitPrice : stock?.currentPrice || 0;

  // Pour l'achat
  const totalCost = numericAmount + TRANSACTION_FEE;
  const maxAmount = availableBalance - TRANSACTION_FEE;
  const numberOfShares = stock && numericAmount > 0 ? numericAmount / effectivePrice : 0;

  // Pour la vente
  const totalRevenue = numericAmount - TRANSACTION_FEE;

  const canBuy = orderSide === 'BUY'
    ? numericAmount > 0 && totalCost <= availableBalance && (orderType === 'MARKET' || (orderType === 'LIMIT' && numericLimitPrice > 0))
    : numericShares > 0 && numericShares <= availableShares && (orderType === 'MARKET' || (orderType === 'LIMIT' && numericLimitPrice > 0));

  if (!stock) return null;

  const handleAmountChange = (value: string) => {
    setAmount(value);
    const numAmount = parseFloat(value) || 0;
    const price = orderType === 'LIMIT' && numericLimitPrice > 0 ? numericLimitPrice : stock.currentPrice;
    const calculatedShares = numAmount > 0 ? numAmount / price : 0;
    setShares(numAmount > 0 ? calculatedShares.toFixed(2) : '');
  };

  const handleSharesChange = (value: string) => {
    setShares(value);
    const numShares = parseFloat(value) || 0;
    const price = orderType === 'LIMIT' && numericLimitPrice > 0 ? numericLimitPrice : stock.currentPrice;
    const calculatedAmount = numShares > 0 ? numShares * price : 0;
    setAmount(numShares > 0 ? calculatedAmount.toFixed(2) : '');
  };

  const handleLimitPriceChange = (value: string) => {
    setLimitPrice(value);
    if (shares) {
      const numShares = parseFloat(shares) || 0;
      const numPrice = parseFloat(value) || 0;
      const calculatedAmount = numShares > 0 && numPrice > 0 ? numShares * numPrice : 0;
      setAmount(calculatedAmount > 0 ? calculatedAmount.toFixed(2) : '');
    }
  };

  const handleBuy = async () => {
    if (!canBuy || !stock) return;

    setIsPurchasing(true);
    setError('');

    try {
      const orderData: {
        stockId: string;
        side: 'BID' | 'ASK';
        type: 'MARKET' | 'LIMIT';
        quantity: number;
        limitPrice?: number;
      } = {
        stockId: stock.id,
        side: orderSide === 'BUY' ? 'BID' : 'ASK',
        type: orderType,
        quantity: parseFloat(shares),
      };

      if (orderType === 'LIMIT') {
        orderData.limitPrice = numericLimitPrice;
      }

      const response = await fetch('http://localhost:3001/api/investment/order', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const data = await response.json();

        // Réinitialiser les champs AVANT de fetch les données
        // pour éviter les validations avec des valeurs obsolètes
        setAmount('');
        setShares('');
        setLimitPrice('');
        setOrderType('MARKET');

        // Afficher un avertissement si l'ordre a été partiellement exécuté
        if (data.warning && data.message) {
          setError(data.message);
          setIsWarning(true);
        } else {
          setError('');
          setIsWarning(false);
        }

        await fetchBalance();
        await fetchAvailableShares();
        await fetchPendingOrders();
        await fetchOrderBook();

        // Ne fermer la modal que si pas d'avertissement (pour que l'utilisateur voie le message)
        if (!data.warning) {
          onClose();
        }

        if (onPurchaseSuccess) {
          onPurchaseSuccess();
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to place order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      setError('An error occurred while placing order');
    } finally {
      setIsPurchasing(false);
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
                    <StockChart
                      symbol={stock.symbol}
                      currentPrice={stock.currentPrice}
                      period={period}
                      animationKey={animationKey}
                    />

                    {/* Order Book - Market Depth */}
                    <div className="mt-4 rounded-lg border border-gray-200 bg-white overflow-hidden">
                      <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
                        <h4 className="text-sm font-semibold text-gray-900">
                          Market Depth
                        </h4>
                      </div>
                      <div className="p-4">
                        <div className="grid grid-cols-2 gap-4">
                          {/* BID (Buy) Side */}
                          <div>
                            <div className="mb-2 flex items-center justify-between text-xs font-semibold text-gray-600 uppercase">
                              <span>Bid (Buy)</span>
                            </div>
                            <div className="space-y-1">
                              {orderBook.bids.length > 0 ? (
                                orderBook.bids.map((bid, idx) => (
                                  <div key={idx} className="flex items-center justify-between rounded bg-blue-50 px-3 py-2 text-xs">
                                    <span className="font-semibold text-blue-700">€{bid.price?.toFixed(2) || 'Market'}</span>
                                    <span className="text-gray-600">{bid.quantity.toFixed(2)}</span>
                                  </div>
                                ))
                              ) : (
                                <div className="text-xs text-gray-400 text-center py-2">No bids</div>
                              )}
                            </div>
                          </div>

                          {/* ASK (Sell) Side */}
                          <div>
                            <div className="mb-2 flex items-center justify-between text-xs font-semibold text-gray-600 uppercase">
                              <span>Ask (Sell)</span>
                            </div>
                            <div className="space-y-1">
                              {orderBook.asks.length > 0 ? (
                                orderBook.asks.map((ask, idx) => (
                                  <div key={idx} className="flex items-center justify-between rounded bg-purple-50 px-3 py-2 text-xs">
                                    <span className="font-semibold text-purple-700">€{ask.price?.toFixed(2) || 'Market'}</span>
                                    <span className="text-gray-600">{ask.quantity.toFixed(2)}</span>
                                  </div>
                                ))
                              ) : (
                                <div className="text-xs text-gray-400 text-center py-2">No asks</div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Spread Indicator */}
                        {orderBook.bids.length > 0 && orderBook.asks.length > 0 && orderBook.bids[0]?.price && orderBook.asks[0]?.price && (
                          <div className="mt-3 pt-3 border-t border-gray-200 text-center">
                            <div className="text-xs text-gray-500">
                              Spread: €{(orderBook.asks[0].price - orderBook.bids[0].price).toFixed(2)}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {pendingOrders.length > 0 && (
                      <div className="mt-4 rounded-lg border border-gray-200 bg-white overflow-hidden">
                        <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
                          <h4 className="text-sm font-semibold text-gray-900">
                            Pending Orders ({pendingOrders.length})
                          </h4>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                              <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Pair</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Side</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider w-16"></th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                              {pendingOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                  <td className="px-4 py-3 text-xs text-gray-900 whitespace-nowrap">
                                    {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                                      day: '2-digit',
                                      month: '2-digit',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </td>
                                  <td className="px-4 py-3 text-xs font-medium text-gray-900 whitespace-nowrap">
                                    {stock.symbol}
                                  </td>
                                  <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">
                                    {order.orderType || order.type}
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap">
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                                      order.side === 'BID'
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'bg-purple-100 text-purple-700'
                                    }`}>
                                      {order.side === 'BID' ? 'Buy' : 'Sell'}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 text-xs font-medium text-gray-900 text-right whitespace-nowrap">
                                    €{order.limitPrice?.toFixed(2)}
                                  </td>
                                  <td className="px-4 py-3 text-xs text-gray-900 text-right whitespace-nowrap">
                                    {order.remainingQuantity.toFixed(2)}
                                  </td>
                                  <td className="px-4 py-3 text-center">
                                    <button
                                      onClick={() => cancelOrder(order.id)}
                                      className="inline-flex h-7 w-7 items-center justify-center rounded-md transition-colors hover:bg-red-50"
                                      title="Cancel order"
                                      aria-label="Cancel order"
                                    >
                                      <X className="h-4 w-4 text-red-600" />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-1">
                  <div className="rounded-xl border bg-white p-6">
                    {/* Buy/Sell Toggle */}
                    <div className="mb-6 flex justify-center">
                      <div className="inline-flex rounded-full bg-gray-100 p-1">
                        <button
                          onClick={() => setOrderSide('SELL')}
                          className={`rounded-full px-8 py-2.5 text-sm font-medium transition-all ${
                            orderSide === 'SELL'
                              ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          Sell
                        </button>
                        <button
                          onClick={() => setOrderSide('BUY')}
                          className={`rounded-full px-8 py-2.5 text-sm font-medium transition-all ${
                            orderSide === 'BUY'
                              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          Buy
                        </button>
                      </div>
                    </div>

                    <h3 className="mb-4 text-lg font-semibold text-gray-900">
                      {orderSide === 'BUY' ? t('dashboard.investmentPage.buyShares') : 'Sell Shares'}
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">Order Type</label>
                        <Select value={orderType} onValueChange={(value: 'MARKET' | 'LIMIT') => setOrderType(value)}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select order type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="MARKET">Market Order</SelectItem>
                            <SelectItem value="LIMIT">Limit Order</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="mt-1 text-xs text-gray-500">
                          {orderType === 'MARKET' ? 'Execute immediately at current market price' : 'Execute only at your specified price or better'}
                        </p>
                      </div>

                      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        orderType === 'LIMIT' ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'
                      }`}>
                        <div className="pb-4">
                          <label className="mb-2 block text-sm font-medium text-gray-700">Limit Price</label>
                          <input
                            type="number"
                            value={limitPrice}
                            onChange={(e) => handleLimitPriceChange(e.target.value)}
                            placeholder="0.00"
                            min="0.01"
                            step="0.01"
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                          />
                          <p className="mt-1 text-xs text-gray-500">
                            Current price: €{stock.currentPrice.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        orderSide === 'BUY' ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'
                      }`}>
                        <div className="pb-4">
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
                          max={orderSide === 'SELL' ? availableShares : undefined}
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          {orderSide === 'SELL'
                            ? `Available: ${availableShares.toFixed(2)} shares`
                            : `${t('dashboard.investmentPage.pricePerShare')}: €${effectivePrice.toFixed(2)}`
                          }
                        </p>
                      </div>

                      <div className="rounded-lg bg-gray-50 p-4">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">{t('dashboard.investmentPage.pricePerShare')}</span>
                            <span className="font-medium text-gray-900">€{effectivePrice.toFixed(2)}</span>
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
                              <span className={`font-semibold ${orderSide === 'BUY' ? 'text-red-600' : 'text-green-600'}`}>
                                {orderSide === 'BUY' ? '-' : '+'}€{orderSide === 'BUY' ? totalCost.toFixed(2) : totalRevenue.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {orderSide === 'BUY' && numericAmount > maxAmount && (
                        <p className="text-sm text-red-600">{t('dashboard.investmentPage.insufficientBalance')}</p>
                      )}

                      {orderSide === 'SELL' && numericShares > availableShares && (
                        <p className="text-sm text-red-600">Insufficient shares (available: {availableShares.toFixed(2)})</p>
                      )}

                      {error && (
                        <p className={`text-sm ${isWarning ? 'text-orange-600 bg-orange-50 border border-orange-200 rounded-lg p-3' : 'text-red-600'}`}>
                          {isWarning && '⚠️ '}
                          {error}
                        </p>
                      )}

                      <button
                        onClick={handleBuy}
                        disabled={!canBuy || isPurchasing || isLoading}
                        className={`w-full rounded-lg px-4 py-3 font-semibold transition-all ${
                          !canBuy || isPurchasing || isLoading
                            ? 'cursor-not-allowed bg-white text-black/30 border border-black/10'
                            : orderSide === 'BUY'
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700'
                            : 'bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700'
                        }`}
                      >
                        {isPurchasing
                          ? (orderSide === 'BUY' ? t('dashboard.investmentPage.purchasing') || 'Purchasing...' : 'Selling...')
                          : `${orderSide === 'BUY' ? t('dashboard.investmentPage.buy') : 'Sell'} ${numberOfShares > 0 ? `${numberOfShares.toFixed(2)} ${numberOfShares >= 1 ? t('dashboard.investmentPage.shares') : t('dashboard.investmentPage.share')}` : ''}`
                        }
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
