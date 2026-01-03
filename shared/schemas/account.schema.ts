import { z } from 'zod';
import { AccountType, SavingType } from '../enums';

const idSchema = z.string().min(1, 'ID cannot be empty').refine(
    (id) => {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        const mockIdRegex = /^(client|adv|dir|chat|msg|account)(-[a-z0-9]+)+$/i;
        return uuidRegex.test(id) || mockIdRegex.test(id);
    },
    { message: 'Invalid ID format (must be UUID or mock ID)' }
);

// SCHÉMAS DE VALIDATION COMPTE
export const addAccountSchema = z.object({
    userId: idSchema,
    name: z.string().max(50, 'Account name cannot exceed 50 characters').optional(),
    type: z.nativeEnum(AccountType, {
        message: 'Invalid account type. Must be CURRENT or SAVINGS'
    }),
    savingType: z.nativeEnum(SavingType, {
        message: 'Invalid saving type'
    }).optional(),
}).refine(
    (data) => {
        // If type is SAVINGS, savingType must be provided
        if (data.type === AccountType.SAVINGS && !data.savingType) {
            return false;
        }
        // If type is CURRENT, savingType should not be provided
        if (data.type === AccountType.CURRENT && data.savingType) {
            return false;
        }
        return true;
    },
    {
        message: 'Saving type is required for SAVINGS accounts and should not be provided for CURRENT accounts',
        path: ['savingType']
    }
);

export const deleteAccountSchema = z.object({
    id: idSchema,
    userId: idSchema,
});

export const updateAccountNameSchema = z.object({
    id: idSchema,
    name: z.string().min(1, 'Account name cannot be empty').max(50, 'Account name cannot exceed 50 characters').nullable(),
    userId: idSchema,
});

export const getAccountsSchema = z.object({
    userId: idSchema,
});

// Types inférés
export type AddAccountInput = z.infer<typeof addAccountSchema>;
export type DeleteAccountInput = z.infer<typeof deleteAccountSchema>;
export type UpdateAccountNameInput = z.infer<typeof updateAccountNameSchema>;
export type GetAccountsInput = z.infer<typeof getAccountsSchema>;

