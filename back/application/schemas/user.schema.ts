import { z } from 'zod';
import { UserRole } from '@avenir/domain/enumerations/UserRole';
import { UserState } from '@avenir/domain/enumerations/UserState';

export const addUserSchema = z.object({
    firstName: z.string().min(1, 'First name is required').max(100, 'First name is too long'),
    lastName: z.string().min(1, 'Last name is required').max(100, 'Last name is too long'),
    email: z.string().email('Invalid email format'),
    identityNumber: z.string().min(1, 'Identity number is required'),
    passcode: z.string().min(4, 'Passcode must be at least 4 characters'),
    role: z.nativeEnum(UserRole),
});

export const getUserSchema = z.object({
    userId: z.string().uuid('Invalid user ID format'),
});

export const updateUserSchema = z.object({
    userId: z.string().uuid('Invalid user ID format'),
    firstName: z.string().min(1).max(100).optional(),
    lastName: z.string().min(1).max(100).optional(),
    email: z.string().email().optional(),
    state: z.nativeEnum(UserState).optional(),
});

// Types inférés
export type AddUserInput = z.infer<typeof addUserSchema>;
export type GetUserInput = z.infer<typeof getUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
