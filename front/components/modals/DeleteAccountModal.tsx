'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AnimatedFormSection, ModalButton } from '@/components/ui/modal-helpers';
import { useLanguage } from '@/hooks/use-language';
import { motion } from 'framer-motion';
import { Copy, Check, AlertTriangle } from 'lucide-react';

type DeleteAccountModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

const MOCK_ACCOUNTS = [
    { value: 'account-1', label: 'Compte Principal' },
    { value: 'account-2', label: 'Compte Secondaire' },
    { value: 'account-3', label: 'Compte Épargne Voyage' },
];

export const DeleteAccountModal = ({ open, onOpenChange }: DeleteAccountModalProps) => {
    const { t } = useLanguage();
    const [selectedAccount, setSelectedAccount] = useState('');
    const [verificationText, setVerificationText] = useState('');
    const [copied, setCopied] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const selectedAccountLabel = MOCK_ACCOUNTS.find(acc => acc.value === selectedAccount)?.label || '';
    const confirmationText = selectedAccount
        ? `${t('dashboard.deleteAccountModal.confirmationText')} : ${selectedAccountLabel}`
        : t('dashboard.deleteAccountModal.confirmationText');
    const isVerified = verificationText === confirmationText;

    const handleCopy = async () => {
        await navigator.clipboard.writeText(confirmationText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isVerified) return;

        setIsLoading(true);

        await new Promise((resolve) => setTimeout(resolve, 1000));

        setIsLoading(false);
        setSelectedAccount('');
        setVerificationText('');
        onOpenChange(false);
    };

    const handleCancel = () => {
        setSelectedAccount('');
        setVerificationText('');
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

                <form onSubmit={handleSubmit}>
                    <AnimatedFormSection delay={0.1}>
                        <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="accountToDelete">{t('dashboard.deleteAccountModal.selectAccount')}</Label>
                            <Select value={selectedAccount} onValueChange={setSelectedAccount} disabled={isLoading}>
                                <SelectTrigger id="accountToDelete" className="h-11">
                                    <SelectValue placeholder={t('dashboard.deleteAccountModal.selectAccountPlaceholder')} />
                                </SelectTrigger>
                                <SelectContent>
                                    {MOCK_ACCOUNTS.map((account) => (
                                        <SelectItem key={account.value} value={account.value}>
                                            {account.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

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

                                <div className="space-y-2">
                                    <Label htmlFor="verification">{t('dashboard.deleteAccountModal.verificationInput')}</Label>
                                    <Input
                                        id="verification"
                                        value={verificationText}
                                        onChange={(e) => setVerificationText(e.target.value)}
                                        placeholder={t('dashboard.deleteAccountModal.verificationPlaceholder')}
                                        disabled={isLoading}
                                        className={`h-11 ${
                                            verificationText && !isVerified
                                                ? 'border-red-500 focus:ring-red-500'
                                                : verificationText && isVerified
                                                ? 'border-green-500 focus:ring-green-500'
                                                : ''
                                        }`}
                                    />
                                    {verificationText && !isVerified && (
                                        <p className="text-xs text-red-600">{t('dashboard.deleteAccountModal.verificationError')}</p>
                                    )}
                                    {isVerified && (
                                        <p className="text-xs text-green-600">{t('dashboard.deleteAccountModal.verificationSuccess')}</p>
                                    )}
                                </div>
                            </motion.div>
                        )}
                        </div>
                    </AnimatedFormSection>

                    <AnimatedFormSection delay={0.15}>
                        <DialogFooter>
                            <ModalButton onClick={handleCancel} disabled={isLoading}>
                                {t('common.cancel')}
                            </ModalButton>
                            <ModalButton
                                type="submit"
                                variant="danger"
                                disabled={isLoading || !isVerified || !selectedAccount}
                            >
                                {isLoading ? t('common.loading') : t('common.delete')}
                            </ModalButton>
                        </DialogFooter>
                    </AnimatedFormSection>
                </form>
            </DialogContent>
        </Dialog>
    );
};
