'use client';

import { ClientWithDetails } from '@/types/client';
import { motion } from 'framer-motion';
import { User, MessageCircle, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {ChatStatus, LoanStatus, UserState} from '@avenir/shared/enums';

interface ClientCardProps {
  client: ClientWithDetails;
  onClick: () => void;
}

export const ClientCard = ({ client, onClick }: ClientCardProps) => {
  const { t } = useTranslation();

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
    });
  };

  const getStateBadge = (state: string) => {
    switch (state) {
      case UserState.ACTIVE:
        return (
          <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
            {t('clients.state.active')}
          </span>
        );
      case UserState.INACTIVE:
        return (
          <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700">
            {t('clients.state.inactive')}
          </span>
        );
      case UserState.BANNED:
        return (
          <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
            {t('clients.state.banned')}
          </span>
        );
      default:
        return null;
    }
  };

  const activeLoansCount = client.loans.filter((loan) => loan.status !== LoanStatus.COMPLETED).length;
  const activeChatsCount = client.activeChats.filter((chat) => chat.status !== ChatStatus.CLOSED).length;

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group cursor-pointer rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-gray-300 hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-blue-600 text-white shadow-lg">
            <User className="h-7 w-7" />
          </div>

          {/* Informations principales */}
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-bold text-gray-900">
                {client.firstName} {client.lastName}
              </h3>
              {getStateBadge(client.state)}
            </div>
            <p className="text-sm text-gray-500">{client.email}</p>
            <p className="mt-1 text-xs text-gray-400">
              {t('clients.clientSince')} {formatDate(client.clientSince)}
            </p>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2 rounded-lg bg-blue-50 p-3">
          <MessageCircle className="h-5 w-5 text-blue-600" />
          <div>
            <p className="text-xs text-gray-600">{t('clients.activeChats')}</p>
            <p className="text-lg font-bold text-gray-900">{activeChatsCount}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3">
          <TrendingUp className="h-5 w-5 text-green-600" />
          <div>
            <p className="text-xs text-gray-600">{t('clients.totalLoans')}</p>
            <p className="text-lg font-bold text-gray-900">{activeLoansCount}</p>
          </div>
        </div>
      </div>

      {/* Indicateur hover */}
      <div className="mt-4 flex items-center justify-center text-sm text-gray-400 transition-colors group-hover:text-blue-600">
        <span>{t('clients.clientDetails')}</span>
      </div>
    </motion.div>
  );
};
