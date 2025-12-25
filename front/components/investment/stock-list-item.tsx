'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface StockListItemProps {
  symbol: string;
  name: string;
  logo: string;
  price: string;
  change: string;
  isPositive: boolean;
  index: number;
}

export const StockListItem = ({
  symbol,
  name,
  logo,
  price,
  change,
  isPositive,
  index,
}: StockListItemProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-gray-300 hover:shadow-sm"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gray-100">
          <Image src={logo} alt={symbol} width={40} height={40} className="h-full w-full object-cover" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">{symbol}</p>
          <p className="text-xs text-gray-500">{name}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-semibold text-gray-900">{price}</p>
        <p className={`flex items-center justify-end gap-0.5 text-xs font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
          {change.replace('+', '').replace('-', '')}
        </p>
      </div>
    </motion.div>
  );
};
