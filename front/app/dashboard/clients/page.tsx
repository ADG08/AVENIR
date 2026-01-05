'use client';

import { useState, useEffect, useCallback } from 'react';
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
import { useSSE, SSEEventType, isLoanCreatedPayload } from '@/contexts/SSEContext';
import { getAdvisorClients } from '@/lib/api/advisor.api';
import { createNotification } from '@/lib/api/notification.api';
import {createLoan} from '@/lib/api/loan.api';
import { mapAdvisorClientsToClientDetails } from '@/lib/mapping/client.mapping';
import { CustomNotificationType } from '@avenir/shared/enums';
import { mapLoansApiResponseToClientLoans } from '@/lib/mapping/loan.mapping';
import { mapSSELoanToLoanApiResponse } from '@/lib/mapping/sse.mapping';

export default function ClientsPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  const { subscribe } = useSSE();
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

  const loadClients = useCallback(async () => {
    if (!currentUser) return;

    try {
      setIsLoadingClients(true);

      const advisorClients = await getAdvisorClients(currentUser.id);
      const clientsList = mapAdvisorClientsToClientDetails(advisorClients, currentUser.id);

      setClients(clientsList);
    } catch {
      toast({
        title: t('clients.errors.loadingClients'),
        variant: 'destructive',
      });
    } finally {
      setIsLoadingClients(false);
    }
  }, [currentUser, toast, t]);

  useEffect(() => {
    void loadClients();
  }, [loadClients]);

  // Gestion de l'ouverture automatique d'un client depuis sessionStorage
  useEffect(() => {
    const clientIdFromStorage = sessionStorage.getItem('openClientId');
    if (clientIdFromStorage && clients.length > 0) {
      const clientToOpen = clients.find(c => c.id === clientIdFromStorage);
      if (clientToOpen) {
        setSelectedClient(clientToOpen);
        setIsDetailsModalOpen(true);
        sessionStorage.removeItem('openClientId');
      }
    }
  }, [clients]);

  // Écoute des événements SSE pour les mises à jour de crédits en temps réel
  useEffect(() => {
    const unsubscribeFromSSE = subscribe((event) => {
      if (event.type === SSEEventType.LOAN_CREATED && currentUser && isLoanCreatedPayload(event.data)) {
        try {
          const loanPayload = mapSSELoanToLoanApiResponse(event.data);
          const updatedLoan = mapLoansApiResponseToClientLoans([loanPayload], currentUser.id)[0];

          setClients(prevClients => {
            return prevClients.map(client => {
              if (client.id === loanPayload.clientId) {
                const existingLoanIndex = client.loans.findIndex(loan => loan.id === updatedLoan.id);

                if (existingLoanIndex >= 0) {
                  // Mettre à jour le crédit existant
                  const updatedLoans = [...client.loans];
                  updatedLoans[existingLoanIndex] = updatedLoan;
                  return {
                    ...client,
                    loans: updatedLoans.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  };
                } else {
                  return {
                    ...client,
                    loans: [updatedLoan, ...client.loans].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  };
                }
              }
              return client;
            });
          });

          // Mettre à jour le client sélectionné
          setSelectedClient(prevSelected => {
            if (prevSelected && prevSelected.id === loanPayload.clientId) {
              const existingLoanIndex = prevSelected.loans.findIndex(loan => loan.id === updatedLoan.id);

              if (existingLoanIndex >= 0) {
                const updatedLoans = [...prevSelected.loans];
                updatedLoans[existingLoanIndex] = updatedLoan;
                return {
                  ...prevSelected,
                  loans: updatedLoans.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                };
              } else {
                return {
                  ...prevSelected,
                  loans: [updatedLoan, ...prevSelected.loans].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                };
              }
            }
            return prevSelected;
          });
        } catch (error) {
          console.error('Erreur lors du traitement de la mise à jour du crédit:', error);
        }
      }
    });

    return () => unsubscribeFromSSE();
  }, [subscribe, currentUser]);

  const handleClientClick = (client: ClientWithDetails) => {
    setSelectedClient(client);
    setIsDetailsModalOpen(true);
  };

  const handleSendNotification = async (title: string, message: string, type: CustomNotificationType) => {
    if (!selectedClient || !currentUser) return;

    try {
      setIsLoadingNotification(true);

      await createNotification({
        userId: selectedClient.id,
        title,
        message,
        type,
        advisorName: `${currentUser.firstName} ${currentUser.lastName}`,
      });

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

      const createdLoan = await createLoan({
        name: loanData.name,
        clientId: selectedClient.id,
        amount: loanData.amount,
        duration: loanData.duration,
        interestRate: loanData.interestRate,
        insuranceRate: loanData.insuranceRate,
      });

      const formatCurrency = (value: number) =>
        new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);

      toast({
        title: t('clients.loan.success'),
        description: (
          <div className="mt-2 space-y-1">
            <p className="font-semibold">
              {t('clients.loan.monthlyPayment')}: {formatCurrency(createdLoan.monthlyPayment)}
            </p>
            <p className="text-sm">
              {t('clients.loan.totalCost')}: {formatCurrency(createdLoan.totalCost)}
            </p>
            <p className="text-sm">
              {t('clients.loan.totalInterest')}: {formatCurrency(createdLoan.totalInterest)}
            </p>
            <p className="text-sm">
              {t('clients.loan.insuranceCost')}: {formatCurrency(createdLoan.insuranceCost)}
            </p>
          </div>
        ),
      });

      await loadClients();
      setIsLoanModalOpen(false);
      setIsDetailsModalOpen(false);
    } catch {
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

      <main className="mx-auto max-w-450 p-6">
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
        onClientUpdate={(updatedClient) => {
          setClients(prevClients =>
            prevClients.map(c => c.id === updatedClient.id ? updatedClient : c)
          );
          setSelectedClient(updatedClient);
        }}
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
