import { FastifyInstance, FastifyPluginOptions, FastifyRequest, FastifyReply } from 'fastify';
import { UserController } from '../controllers/UserController';
import { authMiddleware } from '../middleware/authMiddleware';

export async function authRoutes(
    fastify: FastifyInstance,
    options: FastifyPluginOptions & { userController: UserController }
) {
    const { userController } = options;

    // Get current authenticated user
    fastify.get('/me', { preHandler: authMiddleware }, async (request: FastifyRequest, reply: FastifyReply) => {
        return userController.getCurrentUser(request, reply);
    });

    // Logout
    fastify.post('/logout', async (request: FastifyRequest, reply: FastifyReply) => {
        return userController.logout(request, reply);
    });

    // Refresh access token
    fastify.post('/refresh', async (request: FastifyRequest, reply: FastifyReply) => {
        return userController.refreshToken(request, reply);
    });
}
