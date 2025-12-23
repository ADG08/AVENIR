'use client';

import {ClientWithDetails} from '@/types/client';
import {AnimatePresence, motion} from 'framer-motion';
import {Bell, Calendar, ChevronDown, MessageCircle, TrendingUp, X} from 'lucide-react';
import {useTranslation} from 'react-i18next';
import {useRouter} from 'next/navigation';
import {useState} from 'react';
import {ChatStatus, LoanStatus} from "@avenir/shared/enums";

interface ClientDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: ClientWithDetails | null;
  onSendNotification: () => void;
  onGrantLoan: () => void;
}

export const ClientDetailsModal = ({
  isOpen,
  onClose,
  client,
  onSendNotification,
  onGrantLoan,
}: ClientDetailsModalProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [isLoansOpen, setIsLoansOpen] = useState(true);
  const [isChatsOpen, setIsChatsOpen] = useState(true);

  if (!client) return null;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(value);
  };

  const handleOpenChat = (chatId: string) => {
    // Stocker le chatId dans sessionStorage pour l'ouvrir après navigation
    sessionStorage.setItem('openChatId', chatId);
    onClose();
    router.push('/dashboard/contact');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-xl"
            >
              {/* Header */}
              <div className="sticky top-0 z-10 border-b border-gray-200 bg-white p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-blue-600 text-white shadow-lg">
                      <span className="text-2xl font-bold">
                        {client.firstName[0]}
                        {client.lastName[0]}
                      </span>
                    </div>

                    {/* Informations */}
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {client.firstName} {client.lastName}
                      </h2>
                      <p className="mt-1 text-sm text-gray-500">{client.email}</p>
                      <p className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                        <Calendar className="h-3 w-3" />
                        {t('clients.clientSince')} {formatDate(client.clientSince)}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={onClose}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Actions */}
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={onSendNotification}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    <Bell className="h-4 w-4" />
                    {t('clients.sendNotification')}
                  </button>
                  <button
                    onClick={onGrantLoan}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-linear-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-all hover:from-blue-700 hover:to-indigo-700"
                  >
                    <TrendingUp className="h-4 w-4" />
                    {t('clients.grantLoan')}
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Section Crédits */}
                <div>
                  <button
                    onClick={() => setIsLoansOpen(!isLoansOpen)}
                    className="mb-4 flex w-full items-center justify-between rounded-lg p-2 transition-colors hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {t('clients.loansTitle')}
                      </h3>
                      {client.loans.length > 0 && (
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                          {client.loans.length} {client.loans.length > 1 ? t('clients.loanPlural') : t('clients.loanSingular')}
                        </span>
                      )}
                    </div>
                    <motion.div
                      animate={{ rotate: isLoansOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {isLoansOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ overflow: 'hidden' }}
                      >

                  {client.loans.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
                      <TrendingUp className="mx-auto h-12 w-12 text-gray-300" />
                      <p className="mt-3 text-sm font-medium text-gray-900">
                        {t('clients.noLoans')}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {t('clients.noLoansDescription')}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {client.loans.map((loan) => {
                        const progress = ((loan.amount - loan.remainingBalance) / loan.amount) * 100;
                        return (
                          <motion.div
                            key={loan.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
                          >
                            {/* En-tête du crédit */}
                            <div className="bg-linear-to-r from-blue-50 to-indigo-50 p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <h4 className="text-base font-bold text-gray-900">
                                      {loan.name}
                                    </h4>
                                    <span
                                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                        loan.status === LoanStatus.ACTIVE
                                          ? 'bg-green-100 text-green-700'
                                          : loan.status === LoanStatus.COMPLETED
                                          ? 'bg-blue-100 text-blue-700'
                                          : 'bg-red-100 text-red-700'
                                      }`}
                                    >
                                      {loan.status === LoanStatus.ACTIVE
                                        ? t('clients.loan.status.active')
                                        : loan.status === LoanStatus.COMPLETED
                                        ? t('clients.loan.status.completed')
                                        : t('clients.loan.status.defaulted')}
                                    </span>
                                  </div>
                                  <p className="mt-1 text-sm text-gray-600">
                                    {t('clients.since')} {formatDate(loan.startDate)}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-xs text-gray-500">{t('clients.loan.monthlyPayment')}</p>
                                  <p className="text-2xl font-bold text-gray-900">
                                    {formatCurrency(loan.monthlyPayment)}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Corps du crédit */}
                            <div className="p-4">
                              {/* Informations principales */}
                              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                                <div>
                                  <p className="text-xs text-gray-500">{t('clients.loan.initialAmount')}</p>
                                  <p className="mt-1 text-sm font-semibold text-gray-900">
                                    {formatCurrency(loan.amount)}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">{t('clients.loan.remainingBalance')}</p>
                                  <p className="mt-1 text-sm font-semibold text-red-700">
                                    {formatCurrency(loan.remainingBalance)}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">{t('clients.loan.totalDuration')}</p>
                                  <p className="mt-1 text-sm font-semibold text-gray-900">
                                    {loan.duration} {t('clients.loan.months')}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">{t('clients.loan.interestRate')}</p>
                                  <p className="mt-1 text-sm font-semibold text-gray-900">
                                    {loan.interestRate}%
                                  </p>
                                </div>
                              </div>

                              {/* Barre de progression */}
                              <div className="mt-4">
                                <div className="mb-2 flex items-center justify-between">
                                  <span className="text-xs font-medium text-gray-700">
                                    {t('clients.repayment')}
                                  </span>
                                  <span className="text-xs font-bold text-gray-900">
                                    {Math.round(progress)}%
                                  </span>
                                </div>
                                <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 1, ease: 'easeOut' }}
                                    className="h-full rounded-full bg-linear-to-r from-green-500 to-emerald-500"
                                  />
                                </div>
                              </div>

                              {/* Détails supplémentaires */}
                              <div className="mt-4 flex items-center justify-between rounded-lg bg-gray-50 p-3">
                                <div className="flex items-center gap-4 text-xs text-gray-600">
                                  <div>
                                    <span className="font-medium">{t('clients.loan.totalCost')}:</span>{' '}
                                    {formatCurrency(loan.totalCost)}
                                  </div>
                                  <div>
                                    <span className="font-medium">{t('clients.loan.totalInterest')}:</span>{' '}
                                    {formatCurrency(loan.totalInterest)}
                                  </div>
                                  <div>
                                    <span className="font-medium">{t('clients.loan.insurance')}:</span>{' '}
                                    {formatCurrency(loan.insuranceCost)}
                                  </div>
                                </div>
                                <div className="text-xs text-gray-500">
                                  {t('clients.end')}: {new Date(loan.endDate).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

                {/* Discussions actives */}
                <div>
                  <button
                    onClick={() => setIsChatsOpen(!isChatsOpen)}
                    className="mb-4 flex w-full items-center justify-between rounded-lg p-2 transition-colors hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {t('clients.activeChats')}
                      </h3>
                      {client.activeChats.length > 0 && (
                        <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700">
                          {client.activeChats.length} {client.activeChats.length > 1 ? t('clients.chatPlural') : t('clients.chatSingular')}
                        </span>
                      )}
                    </div>
                    <motion.div
                      animate={{ rotate: isChatsOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {isChatsOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ overflow: 'hidden' }}
                      >
                  {client.activeChats.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
                      <MessageCircle className="mx-auto h-12 w-12 text-gray-300" />
                      <p className="mt-3 text-sm text-gray-500">
                        {t('clients.noActiveChats')}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {client.activeChats.map((chat) => (
                        <motion.div
                          key={chat.id}
                          whileHover={{ scale: 1.01 }}
                          onClick={() => handleOpenChat(chat.id)}
                          className="group cursor-pointer rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-blue-300 hover:shadow-md"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <MessageCircle className="h-5 w-5 text-blue-600" />
                                <span className="text-sm font-medium text-gray-900">
                                  {t('clients.conversation')}
                                </span>
                                <span
                                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                    chat.status === ChatStatus.PENDING
                                      ? 'bg-amber-100 text-amber-700'
                                      : chat.status === ChatStatus.ACTIVE
                                      ? 'bg-blue-100 text-blue-700'
                                      : 'bg-gray-100 text-gray-700'
                                  }`}
                                >
                                  {chat.status === ChatStatus.PENDING
                                    ? t('chat.status.pending')
                                    : chat.status === ChatStatus.ACTIVE
                                    ? t('chat.status.active')
                                    : t('chat.status.closed')}
                                </span>
                              </div>
                              {chat.lastMessage && (
                                <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                                  {chat.lastMessage.content}
                                </p>
                              )}
                            </div>
                            <div className="ml-4 text-sm text-blue-600 opacity-0 transition-opacity group-hover:opacity-100">
                              {t('clients.openChat')} →
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
