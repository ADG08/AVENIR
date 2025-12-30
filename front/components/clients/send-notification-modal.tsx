'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Info, AlertTriangle, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { sendNotificationSchema, type SendNotificationFormData } from '@/lib/validation/client-forms.schema';
import { CustomNotificationType } from '@avenir/shared';

interface SendNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, message: string, type: CustomNotificationType) => Promise<void>;
  clientName: string;
  isLoading?: boolean;
}

export const SendNotificationModal = ({
  isOpen,
  onClose,
  onSubmit,
  clientName,
  isLoading = false,
}: SendNotificationModalProps) => {
  const { t } = useTranslation();
  const [selectedType, setSelectedType] = useState<CustomNotificationType | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
  } = useForm<SendNotificationFormData>({
    resolver: zodResolver(sendNotificationSchema),
    mode: 'onChange',
  });

  const onFormSubmit = async (data: SendNotificationFormData) => {
    if (isLoading) return;
    await onSubmit(data.title, data.message, data.type);
    handleClose();
  };

  const handleClose = () => {
    if (!isLoading) {
      reset();
      setSelectedType(null);
      onClose();
    }
  };

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setSelectedType(null);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const handleTypeChange = (type: CustomNotificationType) => {
    setSelectedType(type);
    setValue('type', type, { shouldValidate: true });
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
              className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-xl"
            >
              {/* Header */}
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {t('clients.notification.title')}
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
              <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
                {/* Type Notification */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-gray-700">
                    {t('clients.notification.type.label')}
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {/* INFO */}
                    <label
                      className={`flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all ${
                        errors.type ? 'border-red-500' : 
                        selectedType === CustomNotificationType.INFO 
                          ? 'border-blue-500 bg-blue-50 shadow-md' 
                          : 'border-gray-200'
                      } hover:border-blue-400 hover:bg-blue-50 ${
                        isLoading ? 'cursor-not-allowed opacity-50' : ''
                      }`}
                    >
                      <input
                        type="radio"
                        value={CustomNotificationType.INFO}
                        checked={selectedType === CustomNotificationType.INFO}
                        onChange={() => handleTypeChange(CustomNotificationType.INFO)}
                        disabled={isLoading}
                        className="sr-only"
                      />
                      <Info className={`h-6 w-6 ${
                        selectedType === CustomNotificationType.INFO ? 'text-blue-600' : 'text-blue-500'
                      }`} />
                      <span className={`text-xs font-medium ${
                        selectedType === CustomNotificationType.INFO ? 'text-blue-900' : 'text-gray-700'
                      }`}>
                        {t('clients.notification.type.info')}
                      </span>
                    </label>

                    {/* WARNING */}
                    <label
                      className={`flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all ${
                        errors.type ? 'border-red-500' : 
                        selectedType === CustomNotificationType.WARNING 
                          ? 'border-orange-500 bg-orange-50 shadow-md' 
                          : 'border-gray-200'
                      } hover:border-orange-400 hover:bg-orange-50 ${
                        isLoading ? 'cursor-not-allowed opacity-50' : ''
                      }`}
                    >
                      <input
                        type="radio"
                        value={CustomNotificationType.WARNING}
                        checked={selectedType === CustomNotificationType.WARNING}
                        onChange={() => handleTypeChange(CustomNotificationType.WARNING)}
                        disabled={isLoading}
                        className="sr-only"
                      />
                      <AlertTriangle className={`h-6 w-6 ${
                        selectedType === CustomNotificationType.WARNING ? 'text-orange-600' : 'text-orange-500'
                      }`} />
                      <span className={`text-xs font-medium ${
                        selectedType === CustomNotificationType.WARNING ? 'text-orange-900' : 'text-gray-700'
                      }`}>
                        {t('clients.notification.type.warning')}
                      </span>
                    </label>

                    {/* SUCCESS */}
                    <label
                      className={`flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all ${
                        errors.type ? 'border-red-500' : 
                        selectedType === CustomNotificationType.SUCCESS 
                          ? 'border-green-500 bg-green-50 shadow-md' 
                          : 'border-gray-200'
                      } hover:border-green-400 hover:bg-green-50 ${
                        isLoading ? 'cursor-not-allowed opacity-50' : ''
                      }`}
                    >
                      <input
                        type="radio"
                        value={CustomNotificationType.SUCCESS}
                        checked={selectedType === CustomNotificationType.SUCCESS}
                        onChange={() => handleTypeChange(CustomNotificationType.SUCCESS)}
                        disabled={isLoading}
                        className="sr-only"
                      />
                      <CheckCircle className={`h-6 w-6 ${
                        selectedType === CustomNotificationType.SUCCESS ? 'text-green-600' : 'text-green-500'
                      }`} />
                      <span className={`text-xs font-medium ${
                        selectedType === CustomNotificationType.SUCCESS ? 'text-green-900' : 'text-gray-700'
                      }`}>
                        {t('clients.notification.type.success')}
                      </span>
                    </label>
                  </div>
                  {errors.type && (
                    <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
                  )}
                </div>

                {/* Titre */}
                <div>
                  <label htmlFor="notif-title" className="mb-2 block text-sm font-medium text-gray-700">
                    {t('clients.notification.titlePlaceholder')}
                  </label>
                  <input
                    id="notif-title"
                    type="text"
                    {...register('title')}
                    placeholder={t('clients.notification.titlePlaceholder')}
                    disabled={isLoading}
                    className={`w-full rounded-lg border ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    } bg-white px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50`}
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="notif-message" className="mb-2 block text-sm font-medium text-gray-700">
                    {t('clients.notification.message')}
                  </label>
                  <textarea
                    id="notif-message"
                    {...register('message')}
                    placeholder={t('clients.notification.messagePlaceholder')}
                    disabled={isLoading}
                    rows={5}
                    className={`w-full resize-none rounded-lg border ${
                      errors.message ? 'border-red-500' : 'border-gray-300'
                    } bg-white px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50`}
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                  )}
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
                    disabled={isLoading || !isValid}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        {t('clients.notification.sending')}
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        {t('clients.notification.send')}
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
