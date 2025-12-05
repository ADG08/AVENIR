import { z } from "zod";

// Schémas de validation pour les formulaires

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "L'email est requis" })
    .email({ message: "Format d'email invalide" }),
  password: z
    .string()
    .min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" }),
});

export const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: "L'email est requis" })
      .email({ message: "Format d'email invalide" }),
    password: z
      .string()
      .min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" })
      .regex(/[A-Z]/, { message: "Le mot de passe doit contenir au moins une majuscule" })
      .regex(/[a-z]/, { message: "Le mot de passe doit contenir au moins une minuscule" })
      .regex(/[0-9]/, { message: "Le mot de passe doit contenir au moins un chiffre" }),
    confirmPassword: z.string(),
    firstName: z
      .string()
      .min(2, { message: "Le prénom doit contenir au moins 2 caractères" }),
    lastName: z
      .string()
      .min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export const userProfileSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "Le prénom doit contenir au moins 2 caractères" }),
  lastName: z
    .string()
    .min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  email: z
    .string()
    .email({ message: "Format d'email invalide" }),
  phone: z
    .string()
    .regex(/^(\+33|0)[1-9](\d{2}){4}$/, { message: "Numéro de téléphone invalide" })
    .optional()
    .or(z.literal("")),
});

export const transactionSchema = z.object({
  amount: z
    .number({ message: "Le montant doit être un nombre" })
    .positive({ message: "Le montant doit être positif" })
    .multipleOf(0.01, { message: "Le montant ne peut avoir plus de 2 décimales" }),
  description: z
    .string()
    .min(3, { message: "La description doit contenir au moins 3 caractères" })
    .max(255, { message: "La description ne peut pas dépasser 255 caractères" }),
  recipientAccount: z
    .string()
    .regex(/^[A-Z]{2}\d{2}[A-Z0-9]+$/, { message: "IBAN invalide" }),
});

// Types générés à partir des schémas
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type UserProfileInput = z.infer<typeof userProfileSchema>;
export type TransactionInput = z.infer<typeof transactionSchema>;

