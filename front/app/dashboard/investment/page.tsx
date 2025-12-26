'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/use-language';
import { DashboardHeader } from '@/components/dashboard-header';
import { StockTicker } from '@/components/investment/stock-ticker';
import { PortfolioLineChart } from '@/components/investment/portfolio-line-chart';
import { PortfolioDonutChart } from '@/components/investment/portfolio-donut-chart';
import { PortfolioDistribution } from '@/components/investment/portfolio-distribution';
import { StockListItem } from '@/components/investment/stock-list-item';
import { MarketInsightItem } from '@/components/investment/market-insight-item';
import { StockDetailModal } from '@/components/investment/stock-detail-modal';
import type { ChartConfig } from '@/components/ui/chart';
import type { Stock } from '@/components/investment/types';

const getAvatarUrl = (symbol: string, bgColor: string) =>
  `https://ui-avatars.com/api/?name=${symbol}&background=${bgColor}&color=fff&size=128&bold=true`;

const STOCK_COLORS: Record<string, string> = {
  AAPL: '6366f1',
  ABNB: '8b5cf6',
  NVDA: '10b981',
  AMZN: 'f97316',
  GOOGL: '3b82f6',
  META: 'a855f7',
  MSFT: '0ea5e9',
  NFLX: 'dc2626',
  AMD: 'ec4899',
  TSLA: 'ef4444',
  DIS: '8b5cf6',
  UBER: '14b8a6',
};

interface PortfolioPosition {
  id: string;
  stockId: string;
  symbol: string;
  name: string;
  quantity: number;
  averageBuyPrice: number;
  currentPrice: number;
  totalInvested: number;
  currentValue: number;
  profitLoss: number;
  profitLossPercent: number;
}

interface PortfolioSummary {
  totalValue: number;
  totalInvested: number;
  totalProfitLoss: number;
  totalProfitLossPercent: number;
  positions: PortfolioPosition[];
}

interface StockData {
  id: string;
  symbol: string;
  name: string;
  currentPrice: number;
  bestBid: number | null;
  bestAsk: number | null;
  change: number;
  changePercent: number;
}

export default function InvestmentPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('investment');
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioSummary | null>(null);
  const [stocksLoading, setStocksLoading] = useState(true);
  const [portfolioLoading, setPortfolioLoading] = useState(true);

  const fetchStocks = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/investment/stocks', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setStocks(data);
      }
    } catch (error) {
      console.error('Error fetching stocks:', error);
    } finally {
      setStocksLoading(false);
    }
  };

  const fetchPortfolio = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/investment/portfolio', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setPortfolio(data);
      }
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    } finally {
      setPortfolioLoading(false);
    }
  };

  const refreshData = async () => {
    await Promise.all([fetchStocks(), fetchPortfolio()]);
  };

  useEffect(() => {
    fetchStocks();
    fetchPortfolio();
  }, []);

  const handleStockClick = (stock: Stock) => {
    setSelectedStock(stock);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const tickerStocks = stocks.map(stock => ({
    id: stock.id,
    symbol: stock.symbol,
    name: stock.name,
    price: `$${stock.currentPrice.toFixed(2)}`,
    change: stock.changePercent ? `${stock.changePercent > 0 ? '+' : ''}${stock.changePercent.toFixed(2)}%` : '+0.00%',
    isPositive: (stock.changePercent ?? 0) >= 0,
    logo: getAvatarUrl(stock.symbol, STOCK_COLORS[stock.symbol] || '6366f1'),
    currentPrice: stock.currentPrice,
  }));

  const portfolioData = [
    { date: '2024-01-01', value: 98000 },
    { date: '2024-02-01', value: 105000 },
    { date: '2024-03-01', value: 102000 },
    { date: '2024-04-01', value: 110000 },
    { date: '2024-05-01', value: 107000 },
    { date: '2024-06-01', value: 120000 },
    { date: '2024-07-01', value: 75000 },
    { date: '2024-08-01', value: 125000 },
    { date: '2024-09-01', value: 122000 },
    { date: '2024-10-01', value: 130000 },
    { date: '2024-11-01', value: 127000 },
    { date: '2024-12-01', value: 134815 },
  ];

  const profitsChartData = [
    { name: 'stocks', value: 3200, fill: 'hsl(262, 83%, 58%)' },
    { name: 'funds', value: 2100, fill: 'hsl(270, 70%, 62%)' },
    { name: 'bonds', value: 1800, fill: 'hsl(330, 81%, 60%)' },
    { name: 'realStocks', value: 1336, fill: 'hsl(24, 100%, 50%)' },
  ];

  const profitsChartConfig = {
    value: {
      label: t('dashboard.investmentPage.profit'),
    },
    stocks: {
      label: t('dashboard.investmentPage.stocks'),
      color: 'hsl(262, 83%, 58%)',
    },
    funds: {
      label: t('dashboard.investmentPage.funds'),
      color: 'hsl(270, 70%, 62%)',
    },
    bonds: {
      label: t('dashboard.investmentPage.bonds'),
      color: 'hsl(330, 81%, 60%)',
    },
    realStocks: {
      label: t('dashboard.investmentPage.realStocks'),
      color: 'hsl(24, 100%, 50%)',
    },
  } satisfies ChartConfig;

  const distributionItems = portfolio ? portfolio.positions.map(position => ({
    symbol: position.symbol,
    percentage: (position.currentValue / portfolio.totalValue) * 100,
    amount: `$${position.currentValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    color: `#${STOCK_COLORS[position.symbol] || '6366f1'}`,
  })) : [];

  const myAssets = portfolio ? portfolio.positions.map(position => {
    const stockData = stocks.find(s => s.id === position.stockId);
    return {
      symbol: position.symbol,
      name: position.name,
      logo: getAvatarUrl(position.symbol, STOCK_COLORS[position.symbol] || '6366f1'),
      price: `$${position.currentValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: `${position.profitLossPercent >= 0 ? '+' : ''}${position.profitLossPercent.toFixed(2)}%`,
      isPositive: position.profitLossPercent >= 0,
      quantity: position.quantity,
      stockData: stockData ? {
        id: stockData.id,
        symbol: stockData.symbol,
        name: stockData.name,
        price: `$${stockData.currentPrice.toFixed(2)}`,
        change: stockData.changePercent ? `${stockData.changePercent > 0 ? '+' : ''}${stockData.changePercent.toFixed(2)}%` : '+0.00%',
        isPositive: (stockData.changePercent ?? 0) >= 0,
        logo: getAvatarUrl(stockData.symbol, STOCK_COLORS[stockData.symbol] || '6366f1'),
        currentPrice: stockData.currentPrice,
      } : null,
    };
  }) : [];

  const marketInsights = [
    {
      title: 'Tesla Stock 4% After Q2 Sales Report',
      description: 'Tesla shares jump following better than expected quarterly results with strong margins...',
      image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=100&h=100&fit=crop',
    },
    {
      title: 'Apple Announces $100 Billion Share Buyback',
      description: 'Apple board approves largest buyback program in company history, citing strong cash position...',
      image: 'https://images.unsplash.com/photo-1611532736579-6b16e2b50449?w=100&h=100&fit=crop',
    },
    {
      title: 'Meta Launches AI Powered Ad Platform',
      description: 'Meta unveils new AI advertising platform designed to improve ad targeting and increase revenue...',
      image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=100&h=100&fit=crop',
    },
    {
      title: 'Shares of Bank Increased Fed Due to Interest',
      description: 'Banking sector rallies as Federal Reserve signals potential rate cuts in coming months...',
      image: 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=100&h=100&fit=crop',
    },
  ];

  if (stocksLoading || portfolioLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
        <DashboardHeader activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="mx-auto max-w-[1800px] p-6">
          <div className="flex items-center justify-center h-[60vh]">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
              <p className="mt-4 text-gray-600">Loading investment data...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <DashboardHeader activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="mx-auto max-w-[1800px] p-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <StockTicker stocks={tickerStocks} onStockClick={handleStockClick} />
        </motion.div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-3"
          >
            <PortfolioLineChart
              title={t('dashboard.investmentPage.portfolioValue')}
              description={`${(portfolio?.totalProfitLoss ?? 0) >= 0 ? '+' : ''} $${(portfolio?.totalProfitLoss ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${t('dashboard.investmentPage.yesterdaysIncome')}`}
              currentValue={`$${(portfolio?.totalValue ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              change={`${(portfolio?.totalProfitLossPercent ?? 0) >= 0 ? '+' : ''}${(portfolio?.totalProfitLossPercent ?? 0).toFixed(2)}%`}
              isPositive={(portfolio?.totalProfitLossPercent ?? 0) >= 0}
              data={portfolioData}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="lg:col-span-2"
          >
            <PortfolioDonutChart
              title={t('dashboard.investmentPage.totalProfits')}
              description=""
              totalAmount={`$${(portfolio?.totalProfitLoss ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              centerLabel={`${(portfolio?.totalProfitLossPercent ?? 0) >= 0 ? '+' : ''}${(portfolio?.totalProfitLossPercent ?? 0).toFixed(2)}% total`}
              data={profitsChartData}
              config={profitsChartConfig}
            />
          </motion.div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <PortfolioDistribution title={t('dashboard.investmentPage.portfolioDistribution')} items={distributionItems} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="rounded-2xl border bg-white p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">{t('dashboard.investmentPage.myAssets')}</h3>
              <button className="cursor-pointer text-sm font-medium text-blue-600 transition-colors hover:text-blue-700">
                {t('dashboard.investmentPage.viewAll')}
              </button>
            </div>
            <div className="space-y-3">
              {myAssets.map((asset, index) => (
                <StockListItem
                  key={asset.symbol}
                  symbol={asset.symbol}
                  name={asset.name}
                  logo={asset.logo}
                  price={asset.price}
                  change={asset.change}
                  isPositive={asset.isPositive}
                  quantity={asset.quantity}
                  index={index}
                  onClick={asset.stockData ? () => handleStockClick(asset.stockData!) : undefined}
                />
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl border bg-white p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">{t('dashboard.investmentPage.marketInsight')}</h3>
              <button className="cursor-pointer text-sm font-medium text-blue-600 transition-colors hover:text-blue-700">
                {t('dashboard.investmentPage.viewAll')}
              </button>
            </div>
            <div className="space-y-3">
              {marketInsights.map((insight, index) => (
                <MarketInsightItem key={index} {...insight} index={index} />
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      <StockDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        stock={selectedStock}
        onPurchaseSuccess={refreshData}
      />
    </div>
  );
}
