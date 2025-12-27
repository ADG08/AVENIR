'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AnimatedFormSection, ModalButton } from '@/components/ui/modal-helpers';
import { useLanguage } from '@/hooks/use-language';
import { accountApi, Account } from '@/lib/api/account.api';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { AccountType, SavingType } from '@/types/enums';

type AddSavingsModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    accounts: Account[];
    onSuccess?: () => void;
};

const SAVINGS_TYPES = [
    { value: SavingType.LivretA, labelKey: 'dashboard.savingsTypes.livretA' as const },
    { value: SavingType.LivretJeune, labelKey: 'dashboard.savingsTypes.livretJeune' as const },
    { value: SavingType.PEA, labelKey: 'dashboard.savingsTypes.pea' as const },
    { value: SavingType.PEL, labelKey: 'dashboard.savingsTypes.pel' as const },
] as const;

const addSavingsSchema = z.object({
    savingsType: z.nativeEnum(SavingType),
});

type AddSavingsFormData = z.infer<typeof addSavingsSchema>;

export const AddSavingsModal = ({ open, onOpenChange, accounts, onSuccess }: AddSavingsModalProps) => {
    const { t } = useLanguage();
    const { user } = useAuth();
    const { toast } = useToast();

    const usedSavingTypes = new Set(
        accounts
            .filter((acc) => acc.type === AccountType.SAVINGS && acc.savingType)
            .map((acc) => acc.savingType)
    );

    const availableSavingsTypes = SAVINGS_TYPES.filter(
        (type) => !usedSavingTypes.has(type.value)
    );

    const form = useForm<AddSavingsFormData>({
        resolver: zodResolver(addSavingsSchema),
        defaultValues: {
            savingsType: undefined,
        },
    });

    useEffect(() => {
        if (open) {
            form.reset({
                savingsType: undefined,
            });
        }
    }, [open, form]);

    const handleSubmit = async (data: AddSavingsFormData) => {
        if (!user?.id) {
            toast({
                title: t('common.error'),
                description: t('dashboard.addSavingsModal.authRequired'),
                variant: 'destructive',
            });
            return;
        }

        const hasExistingAccount = accounts.some(
            (acc) => acc.type === AccountType.SAVINGS && acc.savingType === data.savingsType
        );

        if (hasExistingAccount) {
            toast({
                title: t('common.error'),
                description: t('dashboard.addSavingsModal.duplicateSavingType'),
                variant: 'destructive',
            });
            return;
        }

        try {
            await accountApi.addAccount({
                name: data.savingsType,
                type: AccountType.SAVINGS,
                savingType: data.savingsType,
            });

            toast({
                title: t('common.success'),
                description: t('dashboard.addSavingsModal.successDescription'),
            });

            form.reset();
            onOpenChange(false);
            onSuccess?.();
        } catch (error) {
            toast({
                title: t('common.error'),
                description: error instanceof Error ? error.message : 'Une erreur est survenue',
                variant: 'destructive',
            });
        }
    };

    const handleCancel = () => {
        form.reset();
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('dashboard.addSavingsModal.title')}</DialogTitle>
                    <DialogDescription>{t('dashboard.addSavingsModal.description')}</DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)}>
                        <AnimatedFormSection delay={0.1}>
                            <div className="space-y-4 py-4">
                                <FormField
                                    control={form.control}
                                    name="savingsType"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t('dashboard.addSavingsModal.savingsType')}</FormLabel>
                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                                disabled={form.formState.isSubmitting}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="h-11">
                                                        <SelectValue placeholder={t('dashboard.addSavingsModal.savingsTypePlaceholder')} />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {availableSavingsTypes.length === 0 ? (
                                                        <div className="px-2 py-6 text-center text-sm text-gray-500">
                                                            {t('dashboard.addSavingsModal.allTypesUsed')}
                                                        </div>
                                                    ) : (
                                                        availableSavingsTypes.map((type) => (
                                                            <SelectItem key={type.value} value={type.value}>
                                                                {t(type.labelKey)}
                                                            </SelectItem>
                                                        ))
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
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
                                    disabled={form.formState.isSubmitting || !form.formState.isValid || availableSavingsTypes.length === 0}
                                >
                                    {form.formState.isSubmitting ? t('common.loading') : t('common.create')}
                                </ModalButton>
                            </DialogFooter>
                        </AnimatedFormSection>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
