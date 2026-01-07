'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

type StatCardProps = {
    title: string;
    amount: string;
    trend?: string;
    variant?: 'primary' | 'default';
    className?: string;
};

export const StatCard = ({ title, amount, trend, variant = 'default', className }: StatCardProps) => {
    const isPrimary = variant === 'primary';
    const isPositiveTrend = trend?.startsWith('+');
    const hasTrend = !!trend;

    const cardBackground = isPrimary ? '#383bfe' : undefined;
    const textColor = isPrimary ? 'text-white' : 'text-gray-900';
    const titleColor = isPrimary ? 'text-white/90' : 'text-gray-600';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={cn(
                'relative overflow-hidden rounded-2xl p-6',
                isPrimary
                    ? 'text-white shadow-lg'
                    : 'bg-white border border-gray-100',
                className
            )}
            style={
                cardBackground
                    ? {
                        backgroundColor: cardBackground,
                    }
                    : undefined
            }
        >
            <div className="mb-8 flex items-start justify-between">
                <span className={cn('text-sm font-medium', titleColor)}>
                    {title}
                </span>
                <button
                    className={cn(
                        'flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-1 transition-all hover:scale-110',
                        isPrimary ? 'bg-white/20 border-white/30' : 'bg-white border-gray-300'
                    )}
                >
                    <ArrowUpRight className={cn('h-5 w-5', isPrimary ? 'text-white' : 'text-gray-600')} />
                </button>
            </div>

            <div className="space-y-2">
                <h3 className={cn('text-4xl font-bold tracking-tight financial-amount', textColor)}>
                    {amount}
                </h3>
                {hasTrend && (
                    <div className="flex items-center gap-1.5">
                        {isPositiveTrend ? (
                            <ChevronUp className={cn('h-4 w-4 stroke-[3]', textColor)} />
                        ) : (
                            <ChevronDown className={cn('h-4 w-4 stroke-[3]', textColor)} />
                        )}
                        <span className={cn('text-sm font-semibold', textColor)}>
                            {trend}
                        </span>
                    </div>
                )}
            </div>

            {isPrimary && (
                <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
            )}
        </motion.div>
    );
};
