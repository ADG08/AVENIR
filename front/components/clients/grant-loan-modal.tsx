'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface GrantLoanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (loanData: LoanCalculation) => Promise<void>;
  clientName: string;
  isLoading?: boolean;
}

export interface LoanCalculation {
  name: string;
  amount: number;
  duration: number;
  interestRate: number;
  insuranceRate: number;
  monthlyPayment: number;
  totalCost: number;
  totalInterest: number;
  insuranceCost: number;
}

export const GrantLoanModal = ({
  isOpen,
  onClose,
  onSubmit,
  clientName,
  isLoading = false,
}: GrantLoanModalProps) => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState('');
  const [interestRate, setInterestRate] = useState('3.5');
  const [insuranceRate, setInsuranceRate] = useState('0.36');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const principal = parseFloat(amount);
    const months = parseInt(duration);
    const annualRate = parseFloat(interestRate);
    const insuranceRateDecimal = parseFloat(insuranceRate);

    if (!name.trim() || !principal || !months || isNaN(annualRate) || isNaN(insuranceRateDecimal)) {
      return;
    }

    if (!isLoading) {
      // TODO : Récuperer les données du back
      const loanData: LoanCalculation = {
        name: name.trim(),
        amount: principal,
        duration: months,
        interestRate: annualRate,
        insuranceRate: insuranceRateDecimal,
        monthlyPayment: 0,
        totalCost: 0,
        totalInterest: 0,
        insuranceCost: 0,
      };

      await onSubmit(loanData);
      resetForm();
    }
  };

  const resetForm = () => {
    setName('');
    setAmount('');
    setDuration('');
    setInterestRate('3.5');
    setInsuranceRate('0.36');
  };

  const handleClose = () => {
    if (!isLoading) {
      resetForm();
      onClose();
    }
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
            onClick={handleClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-gray-200 bg-white p-6 shadow-xl"
            >
              {/* Header */}
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {t('clients.loan.title')}
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Pour {clientName}
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  disabled={isLoading}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nom du crédit */}
                <div>
                  <label htmlFor="loan-name" className="mb-2 block text-sm font-medium text-gray-700">
                    {t('clients.loan.name')}
                  </label>
                  <input
                    id="loan-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t('clients.loan.namePlaceholder')}
                    disabled={isLoading}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50"
                    required
                  />
                </div>

                {/* Inputs principaux */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {/* Montant */}
                  <div>
                    <label htmlFor="loan-amount" className="mb-2 block text-sm font-medium text-gray-700">
                      {t('clients.loan.amount')} (€)
                    </label>
                    <input
                      id="loan-amount"
                      type="number"
                      step="100"
                      min="1000"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder={t('clients.loan.amountPlaceholder')}
                      disabled={isLoading}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50"
                      required
                    />
                  </div>

                  {/* Durée */}
                  <div>
                    <label htmlFor="loan-duration" className="mb-2 block text-sm font-medium text-gray-700">
                      {t('clients.loan.duration')}
                    </label>
                    <input
                      id="loan-duration"
                      type="number"
                      step="1"
                      min="6"
                      max="360"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder={t('clients.loan.durationPlaceholder')}
                      disabled={isLoading}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50"
                      required
                    />
                  </div>

                  {/* Taux d'intérêt */}
                  <div>
                    <label htmlFor="loan-interest" className="mb-2 block text-sm font-medium text-gray-700">
                      {t('clients.loan.interestRate')}
                    </label>
                    <input
                      id="loan-interest"
                      type="number"
                      step="0.01"
                      min="0"
                      max="20"
                      value={interestRate}
                      onChange={(e) => setInterestRate(e.target.value)}
                      placeholder={t('clients.loan.interestRatePlaceholder')}
                      disabled={isLoading}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50"
                      required
                    />
                  </div>

                  {/* Taux d'assurance */}
                  <div>
                    <label htmlFor="loan-insurance" className="mb-2 block text-sm font-medium text-gray-700">
                      {t('clients.loan.insuranceRate')}
                    </label>
                    <input
                      id="loan-insurance"
                      type="number"
                      step="0.01"
                      min="0"
                      max="5"
                      value={insuranceRate}
                      onChange={(e) => setInsuranceRate(e.target.value)}
                      placeholder={t('clients.loan.insuranceRatePlaceholder')}
                      disabled={isLoading}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50"
                      required
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isLoading}
                    className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || !amount || !duration}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-linear-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-all hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        {t('clients.loan.granting')}
                      </>
                    ) : (
                      <>
                        <TrendingUp className="h-4 w-4" />
                        {t('clients.loan.grant')}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
