'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registrationSchema, type RegistrationInput } from '@avenir/shared';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import { motion } from 'framer-motion';

export const RegistrationForm = () => {
    const { toast } = useToast();
    const { t } = useTranslation('common');

    const form = useForm<RegistrationInput>({
        resolver: zodResolver(registrationSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            passcode: '',
        },
    });

    const handleSubmit = async (data: RegistrationInput) => {
        try {
            toast({
                title: t('auth.registration.success'),
                description: t('auth.registration.successDescription'),
            });
        } catch (error) {
            toast({
                title: t('errors.error'),
                description: t('auth.registration.error'),
                variant: 'destructive',
            });
        }
    };

    return (
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="space-y-2 text-center"
            >
                <h1 className="text-3xl font-light tracking-tight text-gray-900 md:text-4xl">
                    {t('auth.registration.title')}
                </h1>
                <p className="text-base font-light text-gray-600">
                    {t('auth.registration.subtitle')}
                </p>
            </motion.div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                    >
                        <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-semibold text-gray-900 mb-2">
                                    {t('auth.registration.firstName')}
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder={t('auth.registration.firstNamePlaceholder')}
                                        className="h-12 font-light text-base rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#004d91] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#004d91]/30"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.3 }}
                    >
                        <FormField
                            control={form.control}
                            name="lastName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-semibold text-gray-900 mb-2">
                                    {t('auth.registration.lastName')}
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder={t('auth.registration.lastNamePlaceholder')}
                                        className="h-12 font-light text-base rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#004d91] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#004d91]/30"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.4 }}
                    >
                        <FormField
                            control={form.control}
                            name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-semibold text-gray-900 mb-2">
                                    {t('auth.registration.email')}
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="email"
                                        placeholder={t('auth.registration.emailPlaceholder')}
                                        className="h-12 font-light text-base rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#004d91] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#004d91]/30"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.5 }}
                    >
                        <FormField
                            control={form.control}
                            name="passcode"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-semibold text-gray-900 mb-2">
                                    {t('auth.registration.passcode')}
                                </FormLabel>
                                <FormControl>
                                    <PasswordInput
                                        placeholder={t('auth.registration.passcodePlaceholder')}
                                        className="h-12 font-light text-base rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#004d91] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#004d91]/30"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.6 }}
                    >
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Button
                                type="submit"
                                className="w-full h-12 font-light text-base text-white hover:opacity-90 transition-opacity"
                                style={{ backgroundColor: '#004d91' }}
                                disabled={form.formState.isSubmitting}
                            >
                                {form.formState.isSubmitting
                                    ? t('common.loading')
                                    : t('auth.registration.submit')}
                            </Button>
                        </motion.div>
                    </motion.div>
                </form>
            </Form>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="text-center text-sm"
            >
                <span className="font-light text-gray-600">{t('auth.registration.hasAccount')} </span>
                <a
                    href="/login"
                    className="font-light text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                    tabIndex={0}
                >
                    {t('auth.registration.signIn')}
                </a>
            </motion.div>
        </div>
    );
};
