'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { AnimatedFormSection, ModalButton } from '@/components/ui/modal-helpers';
import { useLanguage } from '@/hooks/use-language';

type AddSavingsModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

const SAVINGS_TYPES = [
    { value: 'livret-a', labelKey: 'dashboard.savingsTypes.livretA' },
    { value: 'livret-jeune', labelKey: 'dashboard.savingsTypes.livretJeune' },
    { value: 'ldds', labelKey: 'dashboard.savingsTypes.ldds' },
    { value: 'pel', labelKey: 'dashboard.savingsTypes.pel' },
    { value: 'cel', labelKey: 'dashboard.savingsTypes.cel' },
    { value: 'lep', labelKey: 'dashboard.savingsTypes.lep' },
];

export const AddSavingsModal = ({ open, onOpenChange }: AddSavingsModalProps) => {
    const { t } = useLanguage();
    const [savingsType, setSavingsType] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        await new Promise((resolve) => setTimeout(resolve, 1000));

        setIsLoading(false);
        setSavingsType('');
        onOpenChange(false);
    };

    const handleCancel = () => {
        setSavingsType('');
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('dashboard.addSavingsModal.title')}</DialogTitle>
                    <DialogDescription>{t('dashboard.addSavingsModal.description')}</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <AnimatedFormSection delay={0.1}>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="savingsType">{t('dashboard.addSavingsModal.savingsType')}</Label>
                                <Select value={savingsType} onValueChange={setSavingsType} disabled={isLoading}>
                                    <SelectTrigger id="savingsType" className="h-11">
                                        <SelectValue placeholder={t('dashboard.addSavingsModal.savingsTypePlaceholder')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {SAVINGS_TYPES.map((type) => (
                                            <SelectItem key={type.value} value={type.value}>
                                                {t(type.labelKey)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
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
                                disabled={isLoading || !savingsType}
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
