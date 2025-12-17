import { z } from 'zod';

export enum ChatStatus {
    PENDING = 'PENDING',
    ACTIVE = 'ACTIVE',
    CLOSED = 'CLOSED'
}

// SCHÉMAS DE VALIDATION CHAT
export const createChatSchema = z.object({
    clientId: z.uuid('Invalid client ID format'),
    initialMessage: z.string().min(1, 'Initial message cannot be empty').max(5000, 'Message is too long'),
});

export const sendMessageSchema = z.object({
    chatId: z.uuid('Invalid chat ID format'),
    senderId: z.uuid('Invalid sender ID format'),
    content: z.string().min(1, 'Message cannot be empty').max(5000, 'Message is too long'),
});

export const getChatsSchema = z.object({
    userId: z.uuid('Invalid user ID format'),
    userRole: z.enum(['DIRECTOR', 'ADVISOR', 'CLIENT'] as const),
});

export const getChatByIdSchema = z.object({
    chatId: z.uuid('Invalid chat ID format'),
    userId: z.uuid('Invalid user ID format'),
});

export const transferChatSchema = z.object({
    chatId: z.uuid('Invalid chat ID format'),
    newAdvisorId: z.uuid('Invalid advisor ID format'),
});

export const markMessageAsReadSchema = z.object({
    messageId: z.uuid('Invalid message ID format'),
});

export const markChatMessagesAsReadSchema = z.object({
    chatId: z.uuid('Invalid chat ID format'),
    userId: z.uuid('Invalid user ID format'),
});

export const closeChatSchema = z.object({
    chatId: z.uuid('Invalid chat ID format'),
    userId: z.uuid('Invalid user ID format'),
});


export type CreateChatInput = z.infer<typeof createChatSchema>;
export type SendMessageInput = z.infer<typeof sendMessageSchema>;
export type GetChatsInput = z.infer<typeof getChatsSchema>;
export type GetChatByIdInput = z.infer<typeof getChatByIdSchema>;
export type TransferChatInput = z.infer<typeof transferChatSchema>;
export type MarkMessageAsReadInput = z.infer<typeof markMessageAsReadSchema>;
export type MarkChatMessagesAsReadInput = z.infer<typeof markChatMessagesAsReadSchema>;
export type CloseChatInput = z.infer<typeof closeChatSchema>;
