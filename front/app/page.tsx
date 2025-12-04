'use client';

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import '@/i18n/config';

export default function Home() {
  const { toast } = useToast();
  const { t, i18n } = useTranslation('common');

  const handleShowToast = () => {
    toast({
      title: t('common.welcome'),
      description: i18n.language === 'fr'
        ? "Application bancaire moderne"
        : "Modern banking application",
    });
  };

  const handleToggleLanguage = () => {
    const newLang = i18n.language === 'fr' ? 'en' : 'fr';
    i18n.changeLanguage(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', newLang);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <main className="flex flex-col items-center justify-center gap-8 p-8">
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {t('home.title')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-md">
            {t('common.welcome')} - {t('home.subtitle')}
          </p>
          <p className="text-sm text-muted-foreground">
            {t('home.currentLanguage')}: {i18n.language.toUpperCase()}
          </p>
        </div>

        <div className="flex gap-4 flex-wrap justify-center">
          <Button onClick={handleShowToast} size="lg">
            {t('common.welcome')}
          </Button>
          <Button onClick={handleToggleLanguage} variant="outline" size="lg">
            {t('home.switchLanguage')}
          </Button>
        </div>

        <div className="mt-8 p-6 rounded-lg border bg-card text-card-foreground shadow-sm max-w-md">
          <h2 className="text-lg font-semibold mb-2">{t('home.technologies')}</h2>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>✓ Next.js 16 avec App Router</li>
            <li>✓ TypeScript</li>
            <li>✓ tRPC pour les API type-safe</li>
            <li>✓ TailwindCSS pour le styling</li>
            <li>✓ Radix UI pour les composants</li>
            <li>✓ React Hook Form + Zod</li>
            <li>✓ i18next pour l'internationalisation (FR/EN)</li>
            <li>✓ Framer Motion pour les animations</li>
          </ul>
        </div>
      </main>
    </div>
  );
}

