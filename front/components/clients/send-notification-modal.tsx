'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { sendNotificationSchema, type SendNotificationFormData } from '@/lib/validation/client-forms.schema';

interface SendNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, message: string) => Promise<void>;
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

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<SendNotificationFormData>({
    resolver: zodResolver(sendNotificationSchema),
    mode: 'onChange',
  });

  const onFormSubmit = async (data: SendNotificationFormData) => {
    if (isLoading) return;
    await onSubmit(data.title, data.message);
    handleClose();
  };

  const handleClose = () => {
    if (!isLoading) {
      reset();
      onClose();
    }
  };

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      reset();
    }
  }, [isOpen, reset]);

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
