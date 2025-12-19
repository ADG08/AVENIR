'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AnimatedFormSection, ModalButton } from '@/components/ui/modal-helpers';
import { useLanguage } from '@/hooks/use-language';

type AddAccountModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export const AddAccountModal = ({ open, onOpenChange }: AddAccountModalProps) => {
    const { t } = useLanguage();
    const [accountName, setAccountName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        await new Promise((resolve) => setTimeout(resolve, 1000));

        setIsLoading(false);
        setAccountName('');
        onOpenChange(false);
    };

    const handleCancel = () => {
        setAccountName('');
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('dashboard.addAccountModal.title')}</DialogTitle>
                    <DialogDescription>{t('dashboard.addAccountModal.description')}</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <AnimatedFormSection delay={0.1}>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="accountName">{t('dashboard.addAccountModal.accountName')}</Label>
                                <Input
                                    id="accountName"
                                    value={accountName}
                                    onChange={(e) => setAccountName(e.target.value)}
                                    placeholder={t('dashboard.addAccountModal.accountNamePlaceholder')}
                                    required
                                    disabled={isLoading}
                                    className="h-11"
                                />
                            </div>
                        </div>
                    </AnimatedFormSection>

                    <AnimatedFormSection delay={0.15}>
                        <DialogFooter>
                            <ModalButton onClick={handleCancel} disabled={isLoading}>
                                {t('common.cancel')}
                            </ModalButton>
                            <ModalButton
                                type="submit"
                                variant="primary"
                                disabled={isLoading || !accountName.trim()}
                            >
                                {isLoading ? t('common.loading') : t('common.create')}
                            </ModalButton>
                        </DialogFooter>
                    </AnimatedFormSection>
                </form>
            </DialogContent>
        </Dialog>
    );
};
