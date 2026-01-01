import { z } from 'zod';

export const loanFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Le nom du crédit est requis')
    .min(3, 'Le nom doit contenir au moins 3 caractères')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères'),
  amount: z
    .number()
    .positive('Le montant doit être positif')
    .min(100, 'Le montant minimum est de 100€')
    .max(1000000000, 'Le montant maximum est de 1 000 000 000€'),
  duration: z
    .number()
    .int('La durée doit être un nombre entier')
    .positive('La durée doit être positive')
    .min(3, 'La durée minimum est de 3 mois')
    .max(372, 'La durée maximum est de 372 mois (31 ans)'),
  interestRate: z
    .number()
    .positive('Le taux d\'intérêt doit être positif')
    .min(0.1, 'Le taux minimum est de 0.1%')
    .max(20, 'Le taux maximum est de 20%'),
  insuranceRate: z
    .number()
    .nonnegative('Le taux d\'assurance ne peut pas être négatif')
    .max(7, 'Le taux d\'assurance maximum est de 7%'),
});

export const createLoanSchema = loanFormSchema.extend({
  clientId: z.uuid('ID client invalide'),
});

export type LoanFormData = z.infer<typeof loanFormSchema>;
export type CreateLoanData = z.infer<typeof createLoanSchema>;
