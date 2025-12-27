'use client';

import { useState, useEffect } from 'react';
import { DashboardHeader } from '@/components/dashboard-header';
import { ClientCard } from '@/components/clients/client-card';
import { ClientDetailsModal } from '@/components/clients/client-details-modal';
import { SendNotificationModal } from '@/components/clients/send-notification-modal';
import { GrantLoanModal, LoanCalculation } from '@/components/clients/grant-loan-modal';
import { ClientWithDetails } from '@/types/client';
import { motion } from 'framer-motion';
import { Users, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { chatApi } from '@/lib/api/chat.api';
import { mapChatsFromApi } from '@/lib/mapping';
import { Chat } from '@/types/chat';
import { UserRole, UserState } from '@/types/enums';

export default function ClientsPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('clients');
  const [searchQuery, setSearchQuery] = useState('');
  const [clients, setClients] = useState<ClientWithDetails[]>([]);
  const [selectedClient, setSelectedClient] = useState<ClientWithDetails | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
  const [isLoadingNotification, setIsLoadingNotification] = useState(false);
  const [isLoadingLoan, setIsLoadingLoan] = useState(false);
  const [isLoadingClients, setIsLoadingClients] = useState(true);

  useEffect(() => {
    const loadClientsFromChats = async () => {
      if (!currentUser) return;

      try {
        setIsLoadingClients(true);
        const chatsResponse = await chatApi.getChats();

        if (!chatsResponse) {
          setClients([]);
          return;
        }

        const allChats = mapChatsFromApi(chatsResponse);

        const clientsMap = new Map<string, ClientWithDetails>();

        allChats.forEach((chat: Chat) => {
          const clientId = chat.clientId;

          if (!clientsMap.has(clientId)) {
            clientsMap.set(clientId, {
              id: clientId,
              firstName: chat.client?.firstName || 'Unknown',
              lastName: chat.client?.lastName || 'User',
              email: chat.client?.email || '',
              identityNumber: chat.client?.identityNumber || '',
              role: UserRole.CLIENT,
              state: UserState.ACTIVE,
              createdAt: chat.client?.createdAt || new Date(),
              updatedAt: chat.client?.updatedAt || new Date(),
              activeChats: [],
              loans: [],
              notifications: [],
              clientSince: chat.client?.createdAt || new Date(),
            });
          }

          const client = clientsMap.get(clientId)!;
          client.activeChats.push(chat);
        });

        const clientsList = Array.from(clientsMap.values());
        setClients(clientsList);
      } catch (error) {
        console.error('Error loading clients:', error);
        toast({
          title: t('clients.errors.loadingClients'),
          variant: 'destructive',
        });
      } finally {
        setIsLoadingClients(false);
      }
    };

    loadClientsFromChats();
  }, [currentUser, toast, t]);

  const handleClientClick = (client: ClientWithDetails) => {
    setSelectedClient(client);
    setIsDetailsModalOpen(true);
  };

  const handleSendNotification = async (_title: string, _message: string) => {
    if (!selectedClient) return;

    try {
      setIsLoadingNotification(true);

      // TODO: Remplacer par un vrai appel API
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast({
        title: t('clients.notification.success'),
        description: `Notification envoyée à ${selectedClient.firstName} ${selectedClient.lastName}`,
      });

      setIsNotificationModalOpen(false);
    } catch (error) {
      console.error('Error sending notification:', error);
      toast({
        title: t('clients.notification.error'),
        variant: 'destructive',
      });
    } finally {
      setIsLoadingNotification(false);
    }
  };

  const handleGrantLoan = async (loanData: LoanCalculation) => {
    if (!selectedClient) return;

    try {
      setIsLoadingLoan(true);

      // TODO: Remplacer par un vrai appel API
      // Simuler l'appel au back qui calcule et retourne les montants
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simuler la réponse du back avec les calculs
      // Le back utilisera la formule du crédit amortissable
      const principal = loanData.amount;
      const months = loanData.duration;
      const annualRate = loanData.interestRate / 100;
      const insuranceRateDecimal = loanData.insuranceRate / 100;

      // Taux mensuel
      const monthlyRate = annualRate / 12;

      // Calcul de la mensualité (formule du crédit amortissable)
      const monthlyPaymentWithoutInsurance =
        principal * (monthlyRate / (1 - Math.pow(1 + monthlyRate, -months)));

      // Coût total de l'assurance
      const insuranceCost = principal * insuranceRateDecimal;
      const monthlyInsurance = insuranceCost / months;

      // Mensualité totale
      const monthlyPayment = monthlyPaymentWithoutInsurance + monthlyInsurance;
      const totalCost = monthlyPayment * months;
      const totalInterest = totalCost - principal - insuranceCost;

      // Le back retournera ces valeurs calculées
      const calculatedLoan: LoanCalculation = {
        ...loanData,
        monthlyPayment: Math.round(monthlyPayment * 100) / 100,
        totalCost: Math.round(totalCost * 100) / 100,
        totalInterest: Math.round(totalInterest * 100) / 100,
        insuranceCost: Math.round(insuranceCost * 100) / 100,
      };

      const formatCurrency = (value: number) =>
        new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);

      toast({
        title: t('clients.loan.success'),
        description: (
          <div className="mt-2 space-y-1">
            <p className="font-semibold">
              {t('clients.loan.monthlyPayment')}: {formatCurrency(calculatedLoan.monthlyPayment)}
            </p>
            <p className="text-sm">
              {t('clients.loan.totalCost')}: {formatCurrency(calculatedLoan.totalCost)}
            </p>
            <p className="text-sm">
              {t('clients.loan.totalInterest')}: {formatCurrency(calculatedLoan.totalInterest)}
            </p>
            <p className="text-sm">
              {t('clients.loan.insuranceCost')}: {formatCurrency(calculatedLoan.insuranceCost)}
            </p>
          </div>
        ),
      });

      setIsLoanModalOpen(false);
      setIsDetailsModalOpen(false);
    } catch (error) {
      console.error('Error granting loan:', error);
      toast({
        title: t('clients.loan.error'),
        variant: 'destructive',
      });
    } finally {
      setIsLoadingLoan(false);
    }
  };

  const filteredClients = clients.filter((client) => {
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();
    const fullName = `${client.firstName} ${client.lastName}`.toLowerCase();
    const email = client.email.toLowerCase();

    return fullName.includes(query) || email.includes(query);
  });


  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <DashboardHeader activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="mx-auto max-w-[1800px] p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{t('clients.myClients')}</h1>
              <p className="mt-2 text-gray-600">
                {filteredClients.length} client{filteredClients.length > 1 ? 's' : ''}
              </p>
            </div>

            {/* Barre de recherche */}
            <div className="flex items-center gap-3 rounded-full border border-gray-200 bg-white px-4 py-2.5 shadow-sm">
              <Search className="h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder={t('common.search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 border-none bg-transparent text-sm text-gray-600 placeholder:text-gray-400 focus:outline-none"
              />
            </div>
          </div>
        </motion.div>

        {/* Liste des clients */}
        {isLoadingClients ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-12"
          >
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
            <p className="mt-4 text-sm text-gray-600">{t('common.loading')}</p>
          </motion.div>
        ) : filteredClients.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-12"
          >
            <Users className="h-16 w-16 text-gray-300" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              {searchQuery ? t('clients.noClients') : t('clients.noClients')}
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              {searchQuery
                ? `Aucun client ne correspond à "${searchQuery}"`
                : t('clients.noClientsDescription')}
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {filteredClients.map((client, index) => (
              <motion.div
                key={client.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ClientCard client={client} onClick={() => handleClientClick(client)} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>

      {/* Modals */}
      <ClientDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedClient(null);
        }}
        client={selectedClient}
        onSendNotification={() => setIsNotificationModalOpen(true)}
        onGrantLoan={() => setIsLoanModalOpen(true)}
      />

      <SendNotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        onSubmit={handleSendNotification}
        clientName={selectedClient ? `${selectedClient.firstName} ${selectedClient.lastName}` : ''}
        isLoading={isLoadingNotification}
      />

      <GrantLoanModal
        isOpen={isLoanModalOpen}
        onClose={() => setIsLoanModalOpen(false)}
        onSubmit={handleGrantLoan}
        clientName={selectedClient ? `${selectedClient.firstName} ${selectedClient.lastName}` : ''}
        isLoading={isLoadingLoan}
      />
    </div>
  );
}
