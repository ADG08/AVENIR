export const formatCurrency = (amount: number, currency: string = 'EUR', locale: string = 'fr-FR'): string => {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
    }).format(amount);
};

