'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Newspaper } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createNewsSchema, type CreateNewsFormData } from '@/lib/validation/client-forms.schema';

interface CreateNewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, description: string) => Promise<void>;
  isLoading?: boolean;
}

export const CreateNewsModal = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: CreateNewsModalProps) => {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<CreateNewsFormData>({
    resolver: zodResolver(createNewsSchema),
    mode: 'onChange',
  });

  const onFormSubmit = async (data: CreateNewsFormData) => {
    if (isLoading) return;
    await onSubmit(data.title, data.description);
    handleClose();
  };

  const handleClose = () => {
    if (!isLoading) {
      reset();
      onClose();
    }
  };

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
              className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-200 p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                    <Newspaper className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {t('news.modal.title')}
                    </h2>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  disabled={isLoading}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onFormSubmit)} className="p-6">
                <div className="space-y-6">
                  {/* Titre */}
                  <div>
                    <label
                      htmlFor="news-title"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      {t('news.modal.newsTitle')}
                    </label>
                    <input
                      id="news-title"
                      type="text"
                      {...register('title')}
                      placeholder={t('news.modal.newsTitlePlaceholder')}
                      disabled={isLoading}
                      className={`w-full rounded-lg border ${
                        errors.title ? 'border-red-500' : 'border-gray-300'
                      } bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50`}
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label
                      htmlFor="news-description"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      {t('news.modal.description')}
                    </label>
                    <textarea
                      id="news-description"
                      {...register('description')}
                      placeholder={t('news.modal.descriptionPlaceholder')}
                      disabled={isLoading}
                      rows={6}
                      className={`w-full resize-none rounded-lg border ${
                        errors.description ? 'border-red-500' : 'border-gray-300'
                      } bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50`}
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-8 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isLoading}
                    className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
                  >
                    {t('news.modal.cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || !isValid}
                    className="rounded-lg bg-blue-600 px-6 py-2.5 font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        {t('news.modal.publishing')}
                      </span>
                    ) : (
                      t('news.modal.publish')
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
