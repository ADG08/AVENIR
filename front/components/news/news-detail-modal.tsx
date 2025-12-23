'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Newspaper, Calendar, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { News } from '@/types/news';

interface NewsDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  news: News | null;
}

export const NewsDetailModal = ({
  isOpen,
  onClose,
  news,
}: NewsDetailModalProps) => {
  const { t } = useTranslation();

  if (!news) return null;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
              className="w-full max-w-xl rounded-2xl bg-white shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-start justify-between border-b border-gray-200 p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-blue-100">
                    <Newspaper className="h-7 w-7 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {news.title}
                    </h2>
                    <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>{news.authorName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(news.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Content */}
              <div className="max-h-[60vh] overflow-y-auto p-6">
                <p className="whitespace-pre-wrap text-base leading-relaxed text-gray-700">
                  {news.description}
                </p>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 p-6">
                <button
                  onClick={onClose}
                  className="w-full rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
                >
                  {t('common.close')}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
