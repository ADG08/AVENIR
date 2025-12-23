export const UserRole = {
    CLIENT: 'CLIENT',
    ADVISOR: 'ADVISOR',
    DIRECTOR: 'DIRECTOR'
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];