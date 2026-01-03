import { UserRole } from '@/types/enums';

export const getDashboardRouteByRole = (role: UserRole): string => {
  switch (role) {
    case 'ADVISOR':
      return '/dashboard/clients';
    case 'DIRECTOR':
      return '/dashboard/investment';
    case 'CLIENT':
    default:
      return '/dashboard';
  }
};
