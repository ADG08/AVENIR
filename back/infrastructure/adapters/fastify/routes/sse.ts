import { FastifyInstance, FastifyRequest, FastifyPluginOptions } from 'fastify';
import { SSEService } from '../../services/SSEService';
import { authMiddleware } from '../middleware/authMiddleware';
import { RepositoryFactory } from '../../../factories/RepositoryFactory';

interface SSERouteOptions extends FastifyPluginOptions {
    sseService: SSEService;
}

export const sseRoutes = async (fastify: FastifyInstance, options: SSERouteOptions) => {
    const { sseService } = options;
    const userRepository = RepositoryFactory.createUserRepository();

    fastify.get(
        '/sse',
        { preHandler: authMiddleware },
        async (request: FastifyRequest, reply) => {
            try {
                const user = (request as any).user;
                if (!user || !user.userId) {
                    return reply.code(401).send({ error: 'Unauthorized', message: 'User not authenticated' });
                }

                const fullUser = await userRepository.getById(user.userId);
                if (!fullUser) {
                    return reply.code(401).send({ error: 'Unauthorized', message: 'User not found' });
                }

                sseService.registerClient(fullUser.id, fullUser.role, reply);

                // La réponse reste ouverte jusqu'à la déconnexion du client
                // Reply est géré par le SSEService
            } catch (error) {
                return reply.code(500).send({ error: 'Internal Server Error', message: 'Failed to establish SSE connection' });
            }
        }
    );
};
