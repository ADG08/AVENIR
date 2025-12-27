import { z } from 'zod';

const idSchema = z.string().min(1, 'ID cannot be empty').refine(
    (id) => {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        const mockIdRegex = /^(client|adv|dir|news)(-[a-z0-9]+)+$/i;
        return uuidRegex.test(id) || mockIdRegex.test(id);
    },
    { message: 'Invalid ID format (must be UUID or mock ID like news-001)' }
);

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

export const getNewsByIdSchema = z.object({
    newsId: idSchema,
});

export const deleteNewsSchema = z.object({
    newsId: idSchema,
    userId: z.string(),
});

export const getAllNewsSchema = z.object({
    limit: z.string().optional().transform((val) => val ? parseInt(val, 10) : undefined),
    offset: z.string().optional().transform((val) => val ? parseInt(val, 10) : undefined),
});

export type CreateNewsInput = z.infer<typeof createNewsSchema>;
export type GetNewsByIdInput = z.infer<typeof getNewsByIdSchema>;
export type DeleteNewsInput = z.infer<typeof deleteNewsSchema>;
export type GetAllNewsInput = z.infer<typeof getAllNewsSchema>;
