'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, Info, CheckCircle, AlertTriangle, Newspaper } from 'lucide-react';
import { Notification } from '@/types/notification';
import { News } from '@/types/news';
import { NotificationType } from '@avenir/shared/enums';
import { useTranslation } from 'react-i18next';
import { getNewsById } from '@/lib/api/news.api';
import { translateNotification } from '@/lib/notification-translator';

interface NotificationDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  notification: Notification | null;
  onNewsNotFound?: () => void;
}

export const NotificationDetailModal = ({
  isOpen,
  onClose,
  notification,
  onNewsNotFound,
}: NotificationDetailModalProps) => {
  const { t } = useTranslation('common');
  const [news, setNews] = useState<News | null>(null);
  const [isLoadingNews, setIsLoadingNews] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const fetchNews = async () => {
      if (notification?.newsId && isOpen) {
        try {
          setIsLoadingNews(true);
          const newsData = await getNewsById(notification.newsId);
          setNews(newsData);
        } catch {
          setNews(null);
          if (onNewsNotFound) {
            onNewsNotFound();
          }
          onClose();
        } finally {
          setIsLoadingNews(false);
        }
      } else {
        setNews(null);
      }
    };

    fetchNews();
  }, [notification?.newsId, isOpen, onNewsNotFound, onClose]);

  if (!notification) return null;

  const translatedNotification = translateNotification(notification.title, notification.message, t);

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.LOAN:
        return <TrendingUp className="h-8 w-8 text-blue-600" />;
      case NotificationType.SUCCESS:
        return <CheckCircle className="h-8 w-8 text-green-600" />;
      case NotificationType.WARNING:
        return <AlertTriangle className="h-8 w-8 text-orange-600" />;
      case NotificationType.NEWS:
        return <Newspaper className="h-8 w-8 text-purple-600" />;
      case NotificationType.INFO:
      default:
        return <Info className="h-8 w-8 text-blue-600" />;
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-9998 bg-black/50 backdrop-blur-sm"
            style={{ margin: 0 }}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-9999 flex items-center justify-center p-4"
            style={{ margin: 0, pointerEvents: 'none' }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl flex flex-col"
              style={{ pointerEvents: 'auto' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="border-b border-gray-200 p-6">
                <div className="flex items-start gap-4">
                  <div className="shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-xl font-bold text-gray-900">
                      {news ? news.title : translatedNotification.title}
                    </h2>
                    {(news?.authorName || notification.advisorName) && (
                      <p className="mt-1 text-sm text-gray-600">
                        {t('notifications.from')}: {news?.authorName || notification.advisorName}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-gray-400">
                      {formatDate(news ? news.createdAt : notification.createdAt)}
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="shrink-0 rounded-full p-1 transition-colors hover:bg-gray-100"
                    aria-label={t('common.close')}
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="overflow-y-auto p-6 flex-1">
                {isLoadingNews ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                  </div>
                ) : news ? (
                  <div className="space-y-4">
                    <p className="whitespace-pre-wrap text-gray-700">
                      {news.description}
                    </p>
                  </div>
                ) : notification?.newsId ? (
                  <div className="flex items-center justify-center py-8">
                    <p className="text-sm text-gray-500">{t('common.loading')}</p>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap text-gray-700">
                    {translatedNotification.message}
                  </p>
                )}
              </div>

              {/* Footer */}
              <div className="shrink-0 border-t border-gray-200 p-6">
                <button
                  onClick={onClose}
                  className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
                >
                  {t('common.close')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
  if (typeof window === 'undefined') return null;
  return createPortal(modalContent, document.body);
};
