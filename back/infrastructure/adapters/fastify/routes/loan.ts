import {FastifyInstance, FastifyReply, FastifyRequest} from 'fastify';
import { LoanController } from '../controllers/LoanController';
import { authMiddleware } from '../middleware/authMiddleware';

export async function loanRoutes(
  fastify: FastifyInstance,
  options: { loanController: LoanController },
) {
  const { loanController } = options;

  fastify.post(
  '/loans',
    { preHandler: authMiddleware },
    async (request: FastifyRequest, reply: FastifyReply) => {
      return loanController.createLoan(request as any, reply);
    }
  );

  fastify.get(
  '/loans/client/:clientId',
    { preHandler: authMiddleware },
    async (request: FastifyRequest, reply: FastifyReply) => {
      return loanController.getClientLoans(request as any, reply);
    }
  );
}
