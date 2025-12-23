'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface DeleteNewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  newsTitle: string;
  isLoading?: boolean;
}

export const DeleteNewsModal = ({
  isOpen,
  onClose,
  onConfirm,
  newsTitle,
  isLoading = false,
}: DeleteNewsModalProps) => {
  const { t } = useTranslation();

  const handleConfirm = () => {
    if (!isLoading) {
      onConfirm();
    }
  };

  const handleClose = () => {
    if (!isLoading) {
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
              className="w-full max-w-md rounded-2xl bg-white shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-start justify-between p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-100">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900">
                      {t('news.delete.title')}
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                      {t('news.delete.message')}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  disabled={isLoading}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Content */}
              <div className="px-6 pb-6">
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">{t('news.delete.newsTitle')} :</span>{' '}
                    <span className="font-semibold text-gray-900">{newsTitle}</span>
                  </p>
                </div>
                <p className="mt-4 text-sm text-red-600">
                  {t('news.delete.warning')}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 border-t border-gray-200 p-6">
                <button
                  onClick={handleClose}
                  disabled={isLoading}
                  className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
                >
                  {t('common.cancel')}
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={isLoading}
                  className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      {t('news.delete.deleting')}
                    </span>
                  ) : (
                    t('news.delete.confirm')
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
