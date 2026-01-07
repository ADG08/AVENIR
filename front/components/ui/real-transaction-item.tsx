'use client';

import { motion } from 'framer-motion';
import { ArrowDown, ArrowRightLeft, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Transaction } from '@/lib/api/transaction.api';
import { TransactionType } from '@avenir/shared/enums';
import { formatCurrency } from '@/lib/format';
import { useLanguage } from '@/hooks/use-language';

type RealTransactionItemProps = {
  transaction: Transaction;
  accountName?: string;
  className?: string;
};

export const RealTransactionItem = ({
  transaction,
  accountName,
  className,
}: RealTransactionItemProps) => {
  const { t } = useLanguage();

  const getTransactionIcon = () => {
    switch (transaction.type) {
      case TransactionType.DEPOSIT:
        return <ArrowDown className="h-6 w-6 text-green-600" />;
      case TransactionType.TRANSFER:
        return <ArrowRightLeft className="h-6 w-6 text-blue-600" />;
      default:
        return <CreditCard className="h-6 w-6 text-gray-600" />;
    }
  };

  const getTransactionTypeLabel = () => {
    switch (transaction.type) {
      case TransactionType.DEPOSIT:
        return t('dashboard.transactionsConfig.types.deposit') || 'Deposit';
      case TransactionType.TRANSFER:
        return t('dashboard.transactionsConfig.types.transfer') || 'Transfer';
      default:
        return transaction.type;
    }
  };

  const getAmountColor = () => {
    switch (transaction.type) {
      case TransactionType.DEPOSIT:
        return 'text-green-600';
      case TransactionType.TRANSFER:
        return 'text-blue-600';
      default:
        return 'text-gray-900';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDateFull = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const isToday = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const formattedAmount = formatCurrency(transaction.amount, 'EUR');
  const transactionDate = isToday(transaction.createdAt)
    ? formatDate(transaction.createdAt)
    : formatDateFull(transaction.createdAt);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'flex cursor-pointer flex-col gap-3 rounded-xl bg-gray-50 p-4 transition-all duration-200',
        'hover:bg-gray-100 md:flex-row md:items-center md:justify-between md:gap-4',
        className
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-white border-2 border-gray-200">
            {getTransactionIcon()}
          </div>

          <div className="space-y-1">
            <h4 className="font-semibold text-gray-900">
              {transaction.description || getTransactionTypeLabel()}
            </h4>
            <p className="text-sm text-gray-500">
              {accountName || transaction.fromAccountId.slice(0, 8)} • {transactionDate}
            </p>
          </div>
        </div>

        <span className={cn('text-lg font-bold financial-amount md:hidden', getAmountColor())}>
          {transaction.type === TransactionType.DEPOSIT ? '+' : '-'}
          {formattedAmount}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2 md:gap-4">
        <div className="min-w-[135px] rounded-full border border-gray-200 bg-white px-3 py-1.5 text-center">
          <span className="text-sm text-gray-600">{getTransactionTypeLabel()}</span>
        </div>

        <span className={cn('hidden min-w-[120px] text-right text-lg font-bold financial-amount md:inline', getAmountColor())}>
          {transaction.type === TransactionType.DEPOSIT ? '+' : '-'}
          {formattedAmount}
        </span>
      </div>
    </motion.div>
  );
};

