import { FastifyInstance, FastifyPluginOptions, FastifyRequest, FastifyReply } from 'fastify';
import { UserController } from '../controllers/UserController';
import { AddUserRequest, RegisterUserRequest, LoginUserRequest } from '../../../../application/requests';
import { registrationSchema, loginSchema } from '@avenir/shared';
import { ZodError } from 'zod';

export async function userRoutes(
    fastify: FastifyInstance,
    options: FastifyPluginOptions & { userController: UserController }
) {
    const { userController } = options;

    fastify.get('/users', async (request: FastifyRequest<{ Querystring: { role?: string } }>, reply: FastifyReply) => {
        return userController.getUsers(request, reply);
    });

    fastify.get('/users/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
        return userController.getUser(request, reply);
    });

    fastify.post('/users', async (request: FastifyRequest<{ Body: AddUserRequest }>, reply: FastifyReply) => {
        return userController.addUser(request, reply);
    });

    fastify.post('/register', async (request: FastifyRequest<{ Body: RegisterUserRequest }>, reply: FastifyReply) => {
        try {
            const validatedData = registrationSchema.parse(request.body);
            request.body = validatedData;
            return userController.registerUser(request, reply);
        } catch (error) {
            if (error instanceof ZodError) {
                return reply.code(400).send({
                    error: 'Validation error',
                    message: error.issues[0]?.message || 'Invalid request data',
                    details: error.issues
                });
            }
            throw error;
        }
    });

    fastify.post('/login', async (request: FastifyRequest<{ Body: LoginUserRequest }>, reply: FastifyReply) => {
        try {
            const validatedData = loginSchema.parse(request.body);
            request.body = validatedData;
            return userController.loginUser(request, reply);
        } catch (error) {
            if (error instanceof ZodError) {
                return reply.code(400).send({
                    error: 'Validation error',
                    message: error.issues[0]?.message || 'Invalid request data',
                    details: error.issues
                });
            }
            throw error;
        }
    });

    fastify.get('/verify-email', async (request: FastifyRequest<{ Querystring: { token: string } }>, reply: FastifyReply) => {
        if (!request.query.token) {
            return reply.code(400).send({
                error: 'Validation error',
                message: 'Token is required'
            });
        }
        return userController.verifyEmail(request, reply);
    });
}

