import { z } from 'zod';

export const createNewsSchema = z.object({
  title: z
    .string()
    .min(1, 'Le titre est requis')
    .min(5, 'Le titre doit contenir au moins 5 caractères')
    .max(200, 'Le titre ne peut pas dépasser 200 caractères'),
  description: z
    .string()
    .min(1, 'La description est requise')
    .min(20, 'La description doit contenir au moins 20 caractères')
    .max(5000, 'La description ne peut pas dépasser 5000 caractères'),
});

export type CreateNewsData = z.infer<typeof createNewsSchema>;

export const getAllNewsSchema = z.object({
  limit: z.number().min(1).max(100).optional().default(10),
  offset: z.number().min(0).optional().default(0),
});

export const deleteNewsParamsSchema = z.object({
  newsId: z.uuid('ID d\'actualité invalide'),
});
