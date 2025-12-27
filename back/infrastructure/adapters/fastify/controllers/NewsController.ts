import { FastifyRequest, FastifyReply } from 'fastify';
import { CreateNewsUseCase } from '@avenir/application/usecases/news/CreateNewsUseCase';
import { GetAllNewsUseCase } from '@avenir/application/usecases/news/GetAllNewsUseCase';
import { DeleteNewsUseCase } from '@avenir/application/usecases/news/DeleteNewsUseCase';
import { CreateNewsRequest } from '@avenir/application/requests/CreateNewsRequest';
import { GetAllNewsRequest } from '@avenir/application/requests/GetAllNewsRequest';
import { DeleteNewsRequest } from '@avenir/application/requests/DeleteNewsRequest';
import { ValidationError } from '@avenir/application/errors';
import { NewsNotFoundError, UserNotFoundError, UnauthorizedNewsAccessError } from '@avenir/domain/errors';
import {
  createNewsSchema,
  deleteNewsSchema,
  getAllNewsSchema,
} from '@avenir/shared/schemas/news.schema';
import { ZodError } from 'zod';
import { JwtPayload } from '../../auth/JwtService';

declare module 'fastify' {
  interface FastifyRequest {
    user?: JwtPayload;
  }
}

export class NewsController {
  constructor(
    private readonly createNewsUseCase: CreateNewsUseCase,
    private readonly getAllNewsUseCase: GetAllNewsUseCase,
    private readonly deleteNewsUseCase: DeleteNewsUseCase
  ) {}

  async createNews(
    request: FastifyRequest<{ Body: { title: string; description: string } }>,
    reply: FastifyReply
  ) {
    try {
      if (!request.user) {
        return reply.code(401).send({
          error: 'Unauthorized',
          message: 'Authentication required',
        });
      }

      const validatedData = createNewsSchema.parse({
        title: request.body.title,
        description: request.body.description,
      });

      const createNewsRequest: CreateNewsRequest = new CreateNewsRequest(
        validatedData.title,
        validatedData.description,
        request.user.userId,
        ''
      );

      const response = await this.createNewsUseCase.execute(createNewsRequest);

      reply.code(201).send(response);
    } catch (error) {
      if (error instanceof ZodError) {
        reply.code(400).send({
          error: 'Validation error',
          message: error.issues
            .map((e: any) => `${e.path.join('.')}: ${e.message}`)
            .join(', '),
        });
        return;
      }

      if (error instanceof ValidationError) {
        reply.code(400).send({
          error: 'Validation error',
          message: error.message,
        });
        return;
      }

      console.error('Erreur lors de la création de l\'actualité:', error);
      reply.code(500).send({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async getAllNews(
    request: FastifyRequest<{ Querystring: { limit?: string; offset?: string } }>,
    reply: FastifyReply
  ) {
    try {
      const validatedData = getAllNewsSchema.parse(request.query);
      const getAllNewsRequest = new GetAllNewsRequest(
        validatedData.limit,
        validatedData.offset
      );

      const response = await this.getAllNewsUseCase.execute(getAllNewsRequest);

      reply.code(200).send(response);
    } catch (error) {
      if (error instanceof ZodError) {
        reply.code(400).send({
          error: 'Validation error',
          message: error.issues
            .map((e: any) => `${e.path.join('.')}: ${e.message}`)
            .join(', '),
        });
        return;
      }

      console.error('Erreur lors de la récupération des actualités:', error);
      reply.code(500).send({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async deleteNews(
    request: FastifyRequest<{ Params: { newsId: string } }>,
    reply: FastifyReply
  ) {
    try {
      if (!request.user) {
        return reply.code(401).send({
          error: 'Unauthorized',
          message: 'Authentication required',
        });
      }

      const validatedData = deleteNewsSchema.parse({
        newsId: request.params.newsId,
        userId: request.user.userId,
      });

      const deleteNewsRequest = new DeleteNewsRequest(
        validatedData.newsId,
        validatedData.userId
      );

      await this.deleteNewsUseCase.execute(deleteNewsRequest);

      reply.code(204).send();
    } catch (error) {
      if (error instanceof ZodError) {
        reply.code(400).send({
          error: 'Validation error',
          message: error.issues
            .map((e: any) => `${e.path.join('.')}: ${e.message}`)
            .join(', '),
        });
        return;
      }

      if (error instanceof NewsNotFoundError) {
        reply.code(404).send({
          error: error.message,
        });
        return;
      }

      if (error instanceof UserNotFoundError) {
        reply.code(404).send({
          error: error.message,
        });
        return;
      }

      if (error instanceof UnauthorizedNewsAccessError) {
        reply.code(403).send({
          error: error.message,
        });
        return;
      }

      console.error('Erreur lors de la suppression de l\'actualité:', error);
      reply.code(500).send({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
