import { FastifyInstance, FastifyPluginOptions, FastifyRequest, FastifyReply } from 'fastify';
import { NewsController } from '../controllers/NewsController';
import { authMiddleware } from '../middleware/authMiddleware';

export async function newsRoutes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions & {
    newsController: NewsController;
  }
) {
  const { newsController } = options;

  fastify.post(
    '/news',
    { preHandler: authMiddleware },
    async (request: FastifyRequest, reply: FastifyReply) => {
      return newsController.createNews(request as any, reply);
    }
  );

  fastify.get(
    '/news',
    { preHandler: authMiddleware },
    async (request: FastifyRequest, reply: FastifyReply) => {
      return newsController.getAllNews(request as any, reply);
    }
  );

  fastify.get(
    '/news/:newsId',
    { preHandler: authMiddleware },
    async (request: FastifyRequest, reply: FastifyReply) => {
      return newsController.getNewsById(request as any, reply);
    }
  );

  fastify.delete(
    '/news/:newsId',
    { preHandler: authMiddleware },
    async (request: FastifyRequest, reply: FastifyReply) => {
      return newsController.deleteNews(request as any, reply);
    }
  );
}
