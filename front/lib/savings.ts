import { Account } from '@/lib/api/account.api';
import { SavingTypeMaxAmount } from '@/types/enums';
import { formatCurrency } from './format';
import { TFunction } from 'i18next';

export const calculateSavingsProgress = (
    account: Account,
    t: TFunction<'common'>
): { progress: number; targetAmount: string } => {
    let progress = 0;
    let targetAmount = t('dashboard.noLimit');

    if (account.savingType) {
        const maxAmount = SavingTypeMaxAmount[account.savingType];
        if (maxAmount && maxAmount > 0) {
            const formattedMaxAmount = formatCurrency(maxAmount, account.currency || 'EUR');
            targetAmount = `${formattedMaxAmount} (${t('dashboard.plafond')})`;
            progress = Math.min(Math.round((account.balance / maxAmount) * 100), 100);
        } else {
            progress = 100;
        }
    } else {
        progress = 100;
    }

    return { progress, targetAmount };
};

