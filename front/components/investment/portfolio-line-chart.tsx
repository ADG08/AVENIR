'use client';

import * as React from 'react';
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUp } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { EmptyState } from '@/components/investment/empty-state';

interface PortfolioLineChartProps {
  title: string;
  description: string;
  currentValue: string;
  change: string;
  isPositive: boolean;
  data: Array<{ date: string; value: number }>;
  period: 'yearly' | 'monthly' | 'weekly';
  onPeriodChange: (period: 'yearly' | 'monthly' | 'weekly') => void;
}

export const PortfolioLineChart = ({
  title,
  description,
  currentValue,
  change,
  isPositive,
  data,
  period,
  onPeriodChange,
}: PortfolioLineChartProps) => {
  const { t } = useLanguage();

  const chartConfig = {
    value: {
      label: t('dashboard.investmentPage.portfolioValue'),
      color: 'hsl(var(--chart-1))',
    },
  } satisfies ChartConfig;

  const isEmpty = data.length === 0;

  return (
    <Card className="py-4 sm:py-0">
      <CardHeader className="flex flex-col border-b !p-0">
        <div className="flex flex-col gap-4 px-6 pb-4 pt-6">
          <div className="flex items-center justify-between">
            <CardTitle className="font-manrope text-lg font-semibold text-gray-900">{title}</CardTitle>
            {!isEmpty && (
              <Select value={period} onValueChange={onPeriodChange}>
                <SelectTrigger className="h-9 w-[115px] text-xs sm:h-10 sm:w-[140px] sm:text-sm">
                  <SelectValue placeholder={t('dashboard.investmentPage.selectPeriod')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yearly">{t('dashboard.yearly')}</SelectItem>
                  <SelectItem value="monthly">{t('dashboard.monthly')}</SelectItem>
                  <SelectItem value="weekly">{t('dashboard.weekly')}</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
          {!isEmpty && (
            <>
              <div className="flex items-baseline gap-2">
                <h2 className="financial-amount text-3xl font-bold tracking-tight text-gray-900">
                  {currentValue}
                </h2>
                <span
                  className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}
                >
                  {isPositive && <ArrowUp className="h-3 w-3" />}
                  {change.replace('+', '')}
                </span>
              </div>
              <CardDescription className="font-manrope flex items-center gap-1 text-sm text-gray-500">
                {isPositive && <ArrowUp className="h-3 w-3 text-green-600" />}
                {description.replace('+ ', '')}
              </CardDescription>
            </>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        {isEmpty ? (
          <EmptyState
            title={t('dashboard.investmentPage.emptyState.portfolioValue')}
            description={t('dashboard.investmentPage.emptyState.portfolioValueDescription')}
          />
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
            <LineChart
              accessibilityLayer
              data={data}
              margin={{
                left: 12,
                right: 12,
              }}
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
                  return date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  });
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
                stroke="var(--color-value)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};
