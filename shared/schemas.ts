import { z } from "zod";

export const registrationSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "Le prénom doit contenir au moins 2 caractères" }),
  lastName: z
    .string()
    .min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  email: z
    .string()
    .min(1, { message: "L'email est requis" })
    .email({ message: "Format d'email invalide" }),
  passcode: z
    .string()
    .min(8, { message: "Le code secret doit contenir au moins 8 caractères" })
    .regex(/[A-Z]/, { message: "Le code secret doit contenir au moins une majuscule" })
    .regex(/[a-z]/, { message: "Le code secret doit contenir au moins une minuscule" })
    .regex(/[0-9]/, { message: "Le code secret doit contenir au moins un chiffre" }),
});

export type RegistrationInput = z.infer<typeof registrationSchema>;
