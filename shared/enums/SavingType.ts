export enum SavingType {
    LivretA = 'Livret A',
    LivretJeune = 'Livret Jeune',
    PEA = 'PEA',
    PEL = 'PEL'
}

export const SavingTypeMaxAmount: Record<SavingType, number> = {
    [SavingType.LivretA]: 22950,
    [SavingType.LivretJeune]: 1600,
    [SavingType.PEA]: 150000,
    [SavingType.PEL]: 61200,
};

