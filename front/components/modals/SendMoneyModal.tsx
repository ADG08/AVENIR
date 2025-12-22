'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { AnimatedFormSection, ModalButton } from '@/components/ui/modal-helpers';
import { useLanguage } from '@/hooks/use-language';
import { motion } from 'framer-motion';

type SendMoneyModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

const MOCK_ACCOUNTS = [
    { value: 'account-1', label: 'Compte Principal', balance: '5 420,00 €' },
    { value: 'account-2', label: 'Compte Secondaire', balance: '2 150,00 €' },
    { value: 'account-3', label: 'Compte Épargne Voyage', balance: '8 900,00 €' },
];

const MOCK_DESTINATIONS = [
    { value: 'account-2', label: 'Compte Secondaire', type: 'own' as const },
    { value: 'account-3', label: 'Compte Épargne Voyage', type: 'own' as const },
    { value: 'rib-1', label: 'Jean Martin - FR76 1234 5678 9012 3456 7890 123', type: 'rib' as const },
    { value: 'rib-2', label: 'Marie Dupont - FR76 9876 5432 1098 7654 3210 987', type: 'rib' as const },
    { value: 'rib-3', label: 'Entreprise SARL - FR76 1111 2222 3333 4444 5555 666', type: 'rib' as const },
];

const sendMoneySchema = z.object({
    sourceAccount: z.string().min(1, 'Vous devez sélectionner un compte source'),
    destination: z.string().min(1, 'Vous devez sélectionner un destinataire'),
    amount: z.string().min(1, 'Le montant est requis').refine((val) => {
        const num = parseFloat(val.replace(',', '.'));
        return !isNaN(num) && num > 0;
    }, 'Le montant doit être supérieur à 0'),
    description: z.string().optional(),
});

type SendMoneyFormData = z.infer<typeof sendMoneySchema>;

export const SendMoneyModal = ({ open, onOpenChange }: SendMoneyModalProps) => {
    const { t } = useLanguage();

    const form = useForm<SendMoneyFormData>({
        resolver: zodResolver(sendMoneySchema),
        defaultValues: {
            sourceAccount: '',
            destination: '',
            amount: '',
            description: '',
        },
    });

    useEffect(() => {
        if (open) {
            form.reset();
        }
    }, [open, form]);

    const sourceAccount = form.watch('sourceAccount');

    const availableDestinations = MOCK_DESTINATIONS.filter(
        (dest) => dest.value !== sourceAccount
    );

    const handleSubmit = async (data: SendMoneyFormData) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        form.reset();
        onOpenChange(false);
    };

    const handleCancel = () => {
        form.reset();
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('dashboard.sendMoneyModal.title')}</DialogTitle>
                    <DialogDescription>{t('dashboard.sendMoneyModal.description')}</DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)}>
                        <AnimatedFormSection delay={0.1}>
                            <div className="space-y-4 py-4">
                                <FormField
                                    control={form.control}
                                    name="sourceAccount"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t('dashboard.sendMoneyModal.sourceAccount')}</FormLabel>
                                            <Select
                                                onValueChange={(value) => {
                                                    field.onChange(value);
                                                    form.setValue('destination', '');
                                                }}
                                                defaultValue={field.value}
                                                disabled={form.formState.isSubmitting}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="h-11">
                                                        <SelectValue placeholder={t('dashboard.sendMoneyModal.sourceAccountPlaceholder')} />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {MOCK_ACCOUNTS.map((account) => (
                                                        <SelectItem key={account.value} value={account.value}>
                                                            <div className="flex items-center justify-between gap-4">
                                                                <span>{account.label}</span>
                                                                <span className="text-xs text-gray-500">{account.balance}</span>
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {sourceAccount && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <FormField
                                            control={form.control}
                                            name="destination"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>{t('dashboard.sendMoneyModal.destination')}</FormLabel>
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        value={field.value}
                                                        disabled={form.formState.isSubmitting}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger className="h-11">
                                                                <SelectValue placeholder={t('dashboard.sendMoneyModal.destinationPlaceholder')} />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <div className="px-2 py-1.5 text-xs font-semibold text-gray-500">
                                                                {t('dashboard.sendMoneyModal.myAccounts')}
                                                            </div>
                                                            {availableDestinations
                                                                .filter((dest) => dest.type === 'own')
                                                                .map((dest) => (
                                                                    <SelectItem key={dest.value} value={dest.value}>
                                                                        {dest.label}
                                                                    </SelectItem>
                                                                ))}
                                                            <div className="px-2 py-1.5 text-xs font-semibold text-gray-500">
                                                                {t('dashboard.sendMoneyModal.savedRIBs')}
                                                            </div>
                                                            {availableDestinations
                                                                .filter((dest) => dest.type === 'rib')
                                                                .map((dest) => (
                                                                    <SelectItem key={dest.value} value={dest.value}>
                                                                        {dest.label}
                                                                    </SelectItem>
                                                                ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </motion.div>
                                )}

                                {sourceAccount && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        transition={{ duration: 0.3, delay: 0.1 }}
                                    >
                                        <FormField
                                            control={form.control}
                                            name="amount"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>{t('dashboard.sendMoneyModal.amount')}</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Input
                                                                {...field}
                                                                type="text"
                                                                placeholder="0,00"
                                                                disabled={form.formState.isSubmitting}
                                                                className="h-11 pr-8"
                                                            />
                                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">€</span>
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </motion.div>
                                )}

                                {sourceAccount && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        transition={{ duration: 0.3, delay: 0.15 }}
                                    >
                                        <FormField
                                            control={form.control}
                                            name="description"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>{t('dashboard.sendMoneyModal.description')} ({t('common.optional')})</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            placeholder={t('dashboard.sendMoneyModal.descriptionPlaceholder')}
                                                            disabled={form.formState.isSubmitting}
                                                            className="h-11"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </motion.div>
                                )}
                            </div>
                        </AnimatedFormSection>

                        <AnimatedFormSection delay={0.15}>
                            <DialogFooter>
                                <ModalButton onClick={handleCancel} disabled={form.formState.isSubmitting}>
                                    {t('common.cancel')}
                                </ModalButton>
                                <ModalButton
                                    type="submit"
                                    variant="primary"
                                    disabled={form.formState.isSubmitting || !form.formState.isValid}
                                >
                                    {form.formState.isSubmitting ? t('common.loading') : t('common.send')}
                                </ModalButton>
                            </DialogFooter>
                        </AnimatedFormSection>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
