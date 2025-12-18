'use client';

import { AuthLayout } from '@/components/auth/AuthLayout';
import { LoginForm } from '@/components/forms/LoginForm';
import type { CarouselSlide } from '@/components/auth/Carousel';

const carouselSlides: CarouselSlide[] = [
  {
    image: '/bank1.png',
    quote: 'Une carte qui s\'adapte à votre style de vie. Paiements sécurisés, partout dans le monde.',
    author: 'Marie Dubois',
    authorTitle: 'Directrice Innovation',
  },
  {
    image: '/bank2.png',
    quote: 'La confiance se construit sur la transparence. Votre banque doit être votre partenaire, pas votre obstacle.',
    author: 'Thomas Laurent',
    authorTitle: 'Conseiller Financier',
  },
  {
    image: '/bank3.png',
    quote: 'Chaque grande réussite commence par une vision claire et les bons outils pour la concrétiser.',
    author: 'Sophie Martin',
    authorTitle: 'Entrepreneure',
  },
];

const LoginPage = () => {
  return <AuthLayout slides={carouselSlides}>
    <LoginForm />
  </AuthLayout>;
};

export default LoginPage;
