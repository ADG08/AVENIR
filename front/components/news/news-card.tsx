'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Newspaper, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { News } from '@/types/news';
import { NewsDetailModal } from './news-detail-modal';

interface NewsCardProps {
  news: News[];
}

export const NewsCard = ({ news }: NewsCardProps) => {
  const { t } = useTranslation();
  const [selectedNews, setSelectedNews] = useState<News | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleNewsClick = (newsItem: News) => {
    setSelectedNews(newsItem);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedNews(null), 300);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
    });
  };

  // Afficher les 3 dernières actualités
  const latestNews = news.slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border border-gray-100 bg-white p-6"
    >
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
            <Newspaper className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">{t('news.title')}</h3>
        </div>
        {news.length > 3 && (
          <button className="flex items-center gap-1 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700">
            {t('news.viewAll')}
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* News List */}
      {latestNews.length === 0 ? (
        <div className="py-8 text-center">
          <Newspaper className="mx-auto h-12 w-12 text-gray-300" />
          <p className="mt-3 text-sm font-medium text-gray-900">{t('news.noNews')}</p>
          <p className="mt-1 text-xs text-gray-500">{t('news.noNewsDescription')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {latestNews.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleNewsClick(item)}
              className="group cursor-pointer rounded-xl border border-gray-100 bg-gray-50 p-4 transition-all hover:border-blue-200 hover:bg-blue-50/50 hover:shadow-sm"
            >
              <div className="flex items-start gap-3">
                {/* Date badge */}
                <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg bg-white shadow-sm">
                  <span className="text-xs font-bold text-blue-600">
                    {formatTime(item.createdAt).split(' ')[0]}
                  </span>
                  <span className="text-[10px] text-gray-500">
                    {formatTime(item.createdAt).split(' ')[1]}
                  </span>
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <h4 className="mb-1 font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
                    {item.title}
                  </h4>
                  <p className="mb-2 line-clamp-2 text-sm text-gray-600">
                    {item.description}
                  </p>
                  <p className="text-xs text-gray-500">
                    {t('news.postedBy')} <span className="font-medium">{item.authorName}</span>
                  </p>
                </div>

                {/* Arrow */}
                <ChevronRight className="h-5 w-5 shrink-0 text-gray-400 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <NewsDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        news={selectedNews}
      />
    </motion.div>
  );
};
