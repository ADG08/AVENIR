'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/use-language';
import { DashboardHeader } from '@/components/dashboard-header';
import { StockTicker } from '@/components/investment/stock-ticker';
import { PortfolioLineChart } from '@/components/investment/portfolio-line-chart';
import { PortfolioDonutChart } from '@/components/investment/portfolio-donut-chart';
import { PortfolioDistribution } from '@/components/investment/portfolio-distribution';
import { StockListItem } from '@/components/investment/stock-list-item';
import { MarketInsightItem } from '@/components/investment/market-insight-item';
import type { ChartConfig } from '@/components/ui/chart';

const getAvatarUrl = (symbol: string, bgColor: string) =>
  `https://ui-avatars.com/api/?name=${symbol}&background=${bgColor}&color=fff&size=128&bold=true`;

export default function InvestmentPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('investment');

  const tickerStocks = [
    { symbol: 'AAPL', price: '$192.00', change: '+0.52%', isPositive: true, logo: getAvatarUrl('AAPL', '6366f1') },
    { symbol: 'AIRBNB', price: '$141.00', change: '+1.12%', isPositive: true, logo: getAvatarUrl('ABNB', '8b5cf6') },
    { symbol: 'NVDA', price: '$147.00', change: '+1.55%', isPositive: true, logo: getAvatarUrl('NVDA', '10b981') },
    { symbol: 'AMZN', price: '$191.00', change: '+0.81%', isPositive: true, logo: getAvatarUrl('AMZN', 'f97316') },
    { symbol: 'SPTR', price: '$152.00', change: '+0.34%', isPositive: true, logo: getAvatarUrl('SPOT', '22c55e') },
    { symbol: 'TSLA', price: '$245.00', change: '-0.43%', isPositive: false, logo: getAvatarUrl('TSLA', 'ef4444') },
    { symbol: 'GOOGL', price: '$175.30', change: '+1.24%', isPositive: true, logo: getAvatarUrl('GOOG', '3b82f6') },
    { symbol: 'META', price: '$512.85', change: '+2.15%', isPositive: true, logo: getAvatarUrl('META', 'a855f7') },
    { symbol: 'MSFT', price: '$428.50', change: '-0.22%', isPositive: false, logo: getAvatarUrl('MSFT', '0ea5e9') },
    { symbol: 'NFLX', price: '$685.20', change: '+3.47%', isPositive: true, logo: getAvatarUrl('NFLX', 'dc2626') },
    { symbol: 'AMD', price: '$162.90', change: '+1.89%', isPositive: true, logo: getAvatarUrl('AMD', 'ec4899') },
    { symbol: 'INTC', price: '$42.15', change: '-1.05%', isPositive: false, logo: getAvatarUrl('INTC', '06b6d4') },
    { symbol: 'DIS', price: '$93.75', change: '+0.67%', isPositive: true, logo: getAvatarUrl('DIS', '8b5cf6') },
    { symbol: 'UBER', price: '$78.40', change: '+2.31%', isPositive: true, logo: getAvatarUrl('UBER', '14b8a6') },
    { symbol: 'PYPL', price: '$61.20', change: '-0.89%', isPositive: false, logo: getAvatarUrl('PYPL', '2563eb') },
  ];

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

  const distributionItems = [
    { symbol: 'AAPL', percentage: 35, amount: '$47,185.25', color: '#6366f1' },
    { symbol: 'AIRBNB', percentage: 25, amount: '$33,703.75', color: '#8b5cf6' },
    { symbol: 'NVDA', percentage: 22, amount: '$29,659.30', color: '#ec4899' },
    { symbol: 'AMZN', percentage: 18, amount: '$24,266.70', color: '#f97316' },
  ];

  const myAssets = [
    { symbol: 'AAPL', name: 'Apple Inc.', logo: getAvatarUrl('AAPL', '6366f1'), price: '$47,185.25', change: '+0.52%', isPositive: true },
    { symbol: 'AIRBNB', name: 'Airbnb Inc.', logo: getAvatarUrl('ABNB', '8b5cf6'), price: '$33,703.75', change: '+1.12%', isPositive: true },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', logo: getAvatarUrl('NVDA', '10b981'), price: '$29,659.30', change: '+1.55%', isPositive: true },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', logo: getAvatarUrl('AMZN', 'f97316'), price: '$24,266.70', change: '+0.81%', isPositive: true },
  ];

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

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <DashboardHeader activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="mx-auto max-w-[1800px] p-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <StockTicker stocks={tickerStocks} />
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
              description={`+ $10,489.00 ${t('dashboard.investmentPage.yesterdaysIncome')}`}
              currentValue="$134,815.00"
              change="+5.27%"
              isPositive
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
              totalAmount="$8,436"
              centerLabel="+$278.90 this month"
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
                <StockListItem key={asset.symbol} {...asset} index={index} />
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
    </div>
  );
}
