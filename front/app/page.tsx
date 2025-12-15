'use client';

import '@/i18n/config';
import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/use-language';
import { LandingHeader } from '@/components/landing-header';
import { DashboardPreview } from '@/components/dashboard-preview';

export default function Home() {
    const { t } = useLanguage();

    return (
        <div className="relative min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
            <LandingHeader />

            {/* Background decorative elements */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 0.05, scale: 1 }}
                    transition={{ duration: 1.5 }}
                    className="absolute -right-1/4 -top-1/4 h-[800px] w-[800px] rounded-full bg-blue-600 blur-3xl"
                ></motion.div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 0.05, scale: 1 }}
                    transition={{ duration: 1.5, delay: 0.2 }}
                    className="absolute -bottom-1/4 -left-1/4 h-[600px] w-[600px] rounded-full bg-purple-600 blur-3xl"
                ></motion.div>
            </div>

            <main className="relative overflow-hidden">
                {/* Hero Section */}
                <section className="relative px-6 pb-32 pt-20 md:pb-20 md:pt-32">
                    <div className="mx-auto max-w-[1400px]">
                        <div className="mx-auto max-w-4xl text-center">
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                className="mb-6 text-4xl font-light leading-tight tracking-tight text-gray-900 md:text-5xl lg:text-6xl"
                            >
                                {t('landing.hero.title')}
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 0.5, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                className="mb-16 text-base font-light text-gray-600 opacity-60 md:text-lg lg:text-xl"
                            >
                                {t('landing.hero.subtitle')}
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                <motion.a
                                    href="#"
                                    className="inline-flex cursor-pointer items-center justify-center rounded-full bg-blue-600 px-8 py-4 text-base font-light text-white shadow-lg transition-all hover:bg-blue-700 md:text-lg"
                                    whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(59, 130, 246, 0.3)' }}
                                    whileTap={{ scale: 0.98 }}
                                    tabIndex={0}
                                    role="button"
                                    aria-label={t('landing.hero.cta')}
                                >
                                    {t('landing.hero.cta')}
                                </motion.a>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Dashboard Preview Section */}
                <section className="relative px-6 pb-20">
                    <DashboardPreview />
                </section>
            </main>
        </div>
    );
}
