import { FastifyRequest, FastifyReply } from 'fastify';
import { SendMessageUseCase } from '@avenir/application/usecases/chat/SendMessageUseCase';
import { MarkMessageAsReadUseCase } from '@avenir/application/usecases/chat/MarkMessageAsReadUseCase';
import { SendMessageRequest } from '@avenir/application/requests';
import { ChatNotFoundError, UserNotFoundError, UnauthorizedChatAccessError, MessageNotFoundError } from '@avenir/domain/errors';
import { ValidationError } from '@avenir/application/errors';
import { webSocketService } from '../../services/WebSocketService';

export class MessageController {
    constructor(
        private readonly sendMessageUseCase: SendMessageUseCase,
        private readonly markMessageAsReadUseCase: MarkMessageAsReadUseCase,
    ) {}

    async sendMessage(
        request: FastifyRequest<{ Body: SendMessageRequest }>,
        reply: FastifyReply
    ) {
        try {
            const sendMessageRequest: SendMessageRequest = request.body;
            const response = await this.sendMessageUseCase.execute(sendMessageRequest);

            webSocketService.notifyNewMessage(
                sendMessageRequest.chatId,
                [sendMessageRequest.senderId], // À améliorer en récupérant tous les participants
                response
            );

            return reply.code(201).send(response);
        } catch (error) {
            if (error instanceof ChatNotFoundError) {
                return reply.code(404).send({
                    error: 'Chat not found',
                    message: error.message,
                });
            }

            if (error instanceof UserNotFoundError) {
                return reply.code(404).send({
                    error: 'User not found',
                    message: error.message,
                });
            }

            if (error instanceof UnauthorizedChatAccessError) {
                return reply.code(403).send({
                    error: 'Unauthorized',
                    message: error.message,
                });
            }

            if (error instanceof ValidationError) {
                return reply.code(400).send({
                    error: 'Validation error',
                    message: error.message,
                });
            }

            return reply.code(500).send({
                error: 'Internal server error',
                message: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }

    async markAsRead(
        request: FastifyRequest<{ Params: { messageId: string } }>,
        reply: FastifyReply
    ) {
        try {
            await this.markMessageAsReadUseCase.execute(request.params.messageId);
            return reply.code(200).send({ success: true });
        } catch (error) {
            if (error instanceof MessageNotFoundError) {
                return reply.code(404).send({
                    error: 'Message not found',
                    message: error.message,
                });
            }

            if (error instanceof ValidationError) {
                return reply.code(400).send({
                    error: 'Validation error',
                    message: error.message,
                });
            }

            return reply.code(500).send({
                error: 'Internal server error',
                message: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
}
