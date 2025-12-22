export const UserState = {
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE',
    BANNED: 'BANNED'
} as const;

export type UserState = typeof UserState[keyof typeof UserState];
