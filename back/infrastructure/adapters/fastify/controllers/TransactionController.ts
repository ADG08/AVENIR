import { FastifyRequest, FastifyReply } from 'fastify';
import { GetTransactionsUseCase } from '../../../../application/usecases/transaction/GetTransactionsUseCase';
import { CreateTransactionUseCase } from '../../../../application/usecases/transaction/CreateTransactionUseCase';
import { GetTransactionsRequest, CreateTransactionRequest } from '../../../../application/requests';
import { AccountNotFoundError } from '../../../../domain/errors';
import { UnauthorizedAccountAccessError } from '../../../../domain/errors';
import { ValidationError } from '../../../../application/errors';

export class TransactionController {
    constructor(
        private readonly getTransactionsUseCase: GetTransactionsUseCase,
        private readonly createTransactionUseCase: CreateTransactionUseCase
    ) {}

    async getTransactions(request: FastifyRequest<{ Querystring: { accountId?: string } }>, reply: FastifyReply) {
        try {
            if (!request.user) {
                return reply.code(401).send({
                    error: 'Unauthorized',
                    message: 'User not authenticated',
                });
            }

            const getTransactionsRequest: GetTransactionsRequest = {
                userId: request.user.userId,
                accountId: request.query.accountId,
            };

            const response = await this.getTransactionsUseCase.execute(getTransactionsRequest);
            return reply.code(200).send(response);
        } catch (error) {
            return reply.code(500).send({
                error: 'Internal server error',
                message: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }

    async createTransaction(request: FastifyRequest<{ Body: CreateTransactionRequest }>, reply: FastifyReply) {
        try {
            if (!request.user) {
                return reply.code(401).send({
                    error: 'Unauthorized',
                    message: 'User not authenticated',
                });
            }

            const createTransactionRequest: CreateTransactionRequest = {
                ...request.body,
                userId: request.user.userId,
            };

            const response = await this.createTransactionUseCase.execute(createTransactionRequest);
            return reply.code(201).send(response);
        } catch (error) {
            if (error instanceof AccountNotFoundError) {
                return reply.code(404).send({
                    error: 'Account not found',
                    message: error.message,
                });
            }

            if (error instanceof UnauthorizedAccountAccessError) {
                return reply.code(403).send({
                    error: 'Forbidden',
                    message: error.message,
                });
            }

            if (error instanceof ValidationError) {
                return reply.code(400).send({
                    error: 'Validation error',
                    message: error.message
                });
            }

            return reply.code(500).send({
                error: 'Internal server error',
                message: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
}

