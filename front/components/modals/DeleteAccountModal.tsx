'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AnimatedFormSection, ModalButton } from '@/components/ui/modal-helpers';
import { useLanguage } from '@/hooks/use-language';
import { motion } from 'framer-motion';
import { Copy, Check, AlertTriangle } from 'lucide-react';
import { accountApi, Account } from '@/lib/api/account.api';
import { transactionApi } from '@/lib/api/transaction.api';
import { AccountType } from '@/types/enums';
import { TransactionType } from '@avenir/shared/enums';
import { formatCurrency } from '@/lib/format';
import { useToast } from '@/hooks/use-toast';

type DeleteAccountModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    accounts: Account[];
    accountType?: AccountType;
    onSuccess?: () => void;
};

const createDeleteAccountSchema = (hasBalance: boolean) => z.object({
    selectedAccount: z.string().min(1, 'Vous devez sélectionner un compte'),
    destinationAccount: hasBalance 
        ? z.string().min(1, 'Vous devez sélectionner un compte courant pour transférer le solde')
        : z.string().optional(),
    verificationText: z.string().min(1, 'Le texte de vérification est requis'),
});

const getFilteredAccounts = (accounts: Account[], accountType?: AccountType) => {
    const filteredAccounts = accountType 
        ? accounts.filter(account => account.type === accountType)
        : accounts.filter(account => account.type === AccountType.CURRENT);
    
    const isLastCurrentAccount = accountType === AccountType.CURRENT && filteredAccounts.length === 1;
    
    return {
        accounts: filteredAccounts,
        isLastCurrentAccount,
    };
};

export const DeleteAccountModal = ({ open, onOpenChange, accounts, accountType, onSuccess }: DeleteAccountModalProps) => {
    const { t } = useLanguage();
    const { toast } = useToast();
    const [copied, setCopied] = useState(false);

    const form = useForm<z.infer<ReturnType<typeof createDeleteAccountSchema>>>({
        resolver: zodResolver(createDeleteAccountSchema(false)),
        defaultValues: {
            selectedAccount: '',
            destinationAccount: '',
            verificationText: '',
        },
        mode: 'onChange',
    });

    useEffect(() => {
        if (open) {
            form.reset({
                selectedAccount: '',
                destinationAccount: '',
                verificationText: '',
            });
            setCopied(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    const selectedAccount = form.watch('selectedAccount');
    const destinationAccount = form.watch('destinationAccount');
    const verificationText = form.watch('verificationText');

    const selectedAccountData = accounts.find(acc => acc.id === selectedAccount);
    const selectedAccountLabel = selectedAccountData?.name || selectedAccountData?.iban || '';
    const hasBalance = selectedAccountData ? selectedAccountData.balance > 0 : false;
    const confirmationText = selectedAccount
        ? `${t('dashboard.deleteAccountModal.confirmationText')} : ${selectedAccountLabel}`
        : t('dashboard.deleteAccountModal.confirmationText');
    const isVerified = verificationText === confirmationText;

    // Get available current accounts (excluding the account to be deleted)
    const availableCurrentAccounts = accounts.filter(
        acc => acc.type === AccountType.CURRENT && acc.id !== selectedAccount
    );

    // Clear destination account when selected account changes or when balance becomes zero
    useEffect(() => {
        if (selectedAccount && !hasBalance) {
            form.setValue('destinationAccount', '');
            form.clearErrors('destinationAccount');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasBalance, selectedAccount]);

    // Update schema when balance changes
    useEffect(() => {
        const schema = createDeleteAccountSchema(hasBalance);
        form.clearErrors();
        // Re-validate with new schema
    }, [hasBalance, form]);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(confirmationText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSubmit = async (data: z.infer<ReturnType<typeof createDeleteAccountSchema>>) => {
        if (!isVerified) return;

        const selectedAccountData = accounts.find(acc => acc.id === data.selectedAccount);
        if (!selectedAccountData) {
            return;
        }

        if (selectedAccountData.type === AccountType.CURRENT) {
            const currentAccountsCount = accounts.filter(acc => acc.type === AccountType.CURRENT).length;
            if (currentAccountsCount <= 1) {
                return;
            }
        }

        // If account has balance, transfer it to destination account
        if (hasBalance && selectedAccountData.balance > 0) {
            if (!data.destinationAccount) {
                return;
            }

            try {
                // Transfer the balance to the destination account
                await transactionApi.createTransaction({
                    fromAccountId: data.selectedAccount,
                    toAccountId: data.destinationAccount,
                    amount: selectedAccountData.balance,
                    description: `Transfert du solde avant suppression du compte`,
                    type: TransactionType.TRANSFER,
                });
            } catch (error) {
                toast({
                    title: t('common.error'),
                    description: error instanceof Error ? error.message : 'Erreur lors du transfert du solde',
                    variant: 'destructive',
                });
                return;
            }
        }

        try {
            await accountApi.deleteAccount(data.selectedAccount);

            toast({
                title: t('common.success'),
                description: t('dashboard.deleteAccountModal.successDescription') || 'Compte supprimé avec succès',
            });

            form.reset();
            setCopied(false);
            onOpenChange(false);
            onSuccess?.();
        } catch (error) {
            toast({
                title: t('common.error'),
                description: error instanceof Error ? error.message : 'Une erreur est survenue lors de la suppression',
                variant: 'destructive',
            });
        }
    };

    const handleCancel = () => {
        form.reset();
        setCopied(false);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                        </div>
                        <div className="flex-1">
                            <DialogTitle className="text-red-600">{t('dashboard.deleteAccountModal.title')}</DialogTitle>
                            <DialogDescription className="mt-1">{t('dashboard.deleteAccountModal.description')}</DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)}>
                        <AnimatedFormSection delay={0.1}>
                            <div className="space-y-4 py-4">
                                <FormField
                                    control={form.control}
                                    name="selectedAccount"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t('dashboard.deleteAccountModal.selectAccount')}</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                disabled={form.formState.isSubmitting}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="h-11">
                                                        <SelectValue placeholder={t('dashboard.deleteAccountModal.selectAccountPlaceholder')} />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {(() => {
                                                        const { accounts: filteredAccounts, isLastCurrentAccount } = getFilteredAccounts(accounts, accountType);
                                                        
                                                            return filteredAccounts.map((account) => (
                                                                <SelectItem 
                                                                    key={account.id} 
                                                                    value={account.id}
                                                                    disabled={isLastCurrentAccount}
                                                                >
                                                                    {account.name || account.iban}
                                                                    {isLastCurrentAccount && ` ${t('dashboard.deleteAccountModal.cannotDeleteLastCurrentSuffix')}`}
                                                                </SelectItem>
                                                            ));
                                                    })()}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                        {selectedAccount && hasBalance && availableCurrentAccounts.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                transition={{ duration: 0.3 }}
                                className="space-y-3 rounded-lg border border-blue-200 bg-blue-50 p-4"
                            >
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-blue-900">
                                        Transférer le solde vers un compte courant
                                    </Label>
                                    <p className="text-xs text-blue-700">
                                        Ce compte a un solde de {formatCurrency(selectedAccountData?.balance || 0, selectedAccountData?.currency || 'EUR')}. 
                                        Sélectionnez un compte courant pour transférer ce montant avant la suppression.
                                    </p>
                                    <FormField
                                        control={form.control}
                                        name="destinationAccount"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Compte courant de destination</FormLabel>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    value={field.value}
                                                    disabled={form.formState.isSubmitting}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className="h-11">
                                                            <SelectValue placeholder="Sélectionnez un compte courant" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {availableCurrentAccounts.map((account) => (
                                                            <SelectItem key={account.id} value={account.id}>
                                                                <div className="flex items-center justify-between gap-4">
                                                                    <span>{account.name || account.iban}</span>
                                                                    <span className="text-xs text-gray-500">
                                                                        {formatCurrency(account.balance, account.currency)}
                                                                    </span>
                                                                </div>
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </motion.div>
                        )}

                        {selectedAccount && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                transition={{ duration: 0.3 }}
                                className="space-y-3 rounded-lg border border-red-200 bg-red-50 p-4"
                            >
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-red-900">
                                        {t('dashboard.deleteAccountModal.verificationLabel')}
                                    </Label>
                                    <div className="flex items-center gap-2 rounded-lg bg-white p-3 border border-red-200">
                                        <span className="flex-1 text-red-600">{confirmationText}</span>
                                        <motion.button
                                            type="button"
                                            onClick={handleCopy}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-100 transition-colors hover:bg-gray-200"
                                        >
                                            {copied ? (
                                                <Check className="h-4 w-4 text-green-600" />
                                            ) : (
                                                <Copy className="h-4 w-4 text-gray-600" />
                                            )}
                                        </motion.button>
                                    </div>
                                </div>

                                <FormField
                                    control={form.control}
                                    name="verificationText"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t('dashboard.deleteAccountModal.verificationInput')}</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder={t('dashboard.deleteAccountModal.verificationPlaceholder')}
                                                    disabled={form.formState.isSubmitting}
                                                    className={`h-11 ${
                                                        verificationText && !isVerified
                                                            ? 'border-red-500 focus:ring-red-500'
                                                            : verificationText && isVerified
                                                            ? 'border-green-500 focus:ring-green-500'
                                                            : ''
                                                    }`}
                                                />
                                            </FormControl>
                                            {verificationText && !isVerified && (
                                                <p className="text-xs text-red-600">{t('dashboard.deleteAccountModal.verificationError')}</p>
                                            )}
                                            {isVerified && (
                                                <p className="text-xs text-green-600">{t('dashboard.deleteAccountModal.verificationSuccess')}</p>
                                            )}
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
                                    variant="danger"
                                    disabled={form.formState.isSubmitting || !isVerified || (hasBalance && !destinationAccount)}
                                >
                                    {form.formState.isSubmitting ? t('common.loading') : t('common.delete')}
                                </ModalButton>
                            </DialogFooter>
                        </AnimatedFormSection>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
