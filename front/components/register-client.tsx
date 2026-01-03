'use client';

import { useState } from 'react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { RegistrationForm } from '@/components/forms/RegistrationForm';
import type { CarouselSlide } from '@/components/auth/Carousel';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import Image from 'next/image';

interface RegisterClientProps {
  slides: CarouselSlide[];
}

export function RegisterClient({ slides }: RegisterClientProps) {
  const [showSuccess, setShowSuccess] = useState(false);

  if (showSuccess) {
    return (
      <AuthLayout slides={slides}>
        <div className="space-y-8 font-sans">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center"
          >
            <Image
              src="/avenir.png"
              alt="AVENIR Bank"
              width={200}
              height={60}
              className="h-auto w-auto"
              priority
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center space-y-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
              className="flex justify-center"
            >
              <div className="bg-blue-50 p-6 rounded-full">
                <Mail className="h-16 w-16 text-[#004d91]" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              <h2 className="text-3xl font-light tracking-tight text-gray-900">
                Email envoyé !
              </h2>
              <div className="space-y-3 text-base">
                <p className="text-gray-600 font-light">
                  Un email de vérification a été envoyé à votre adresse.
                </p>
                <p className="text-gray-600 font-light">
                  Veuillez vérifier votre boîte de réception et cliquer sur le lien
                  pour activer votre compte.
                </p>
                <p className="text-sm text-gray-500 font-light pt-2">
                  Pensez à vérifier vos spams si vous ne voyez pas l'email.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout slides={slides}>
      <RegistrationForm onSuccess={() => setShowSuccess(true)} />
    </AuthLayout>
  );
}
