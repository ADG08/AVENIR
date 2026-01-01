import { FastifyRequest, FastifyReply } from 'fastify';
import { CreateLoanUseCase } from '../../../../application/usecases/loan/CreateLoanUseCase';
import { GetClientLoansUseCase } from '../../../../application/usecases/loan/GetClientLoansUseCase';
import { CreateLoanRequest } from '../../../../application/requests/CreateLoanRequest';
import { createLoanSchema } from '@avenir/shared/schemas/loan.schema';
import { z } from 'zod';
import { LoanResponse } from '../../../../application/responses/LoanResponse';

export class LoanController {
  constructor(
    private readonly createLoanUseCase: CreateLoanUseCase,
    private readonly getClientLoansUseCase: GetClientLoansUseCase,
  ) {}

  async createLoan(
    request: FastifyRequest<{
      Body: {
        name: string;
        clientId: string;
        amount: number;
        duration: number;
        interestRate: number;
        insuranceRate: number;
      };
    }>,
    reply: FastifyReply,
  ) {
    try {
      if (!request.user) {
        return reply.code(401).send({
          error: 'Unauthorized',
          message: 'Authentication required',
        });
      }

      const validatedData = createLoanSchema.parse(request.body);
      const createLoanRequest = new CreateLoanRequest(
        validatedData.name,
        request.user.userId,
        validatedData.clientId,
        validatedData.amount,
        validatedData.duration,
        validatedData.interestRate,
        validatedData.insuranceRate,
      );

      const loan = await this.createLoanUseCase.execute(createLoanRequest);
      const loanResponse = LoanResponse.fromLoan(loan);

      return reply.code(201).send(loanResponse);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.code(400).send({
          error: 'Validation error',
          message: error.issues.map(e => `${e.path.join('.')}: ${e.message}`).join(', '),
        });
      }

      return reply.code(500).send({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async getClientLoans(
    request: FastifyRequest<{ Params: { clientId: string } }>,
    reply: FastifyReply,
  ) {
    try {
      if (!request.user) {
        return reply.code(401).send({
          error: 'Unauthorized',
          message: 'Authentication required',
        });
      }

      const loans = await this.getClientLoansUseCase.execute(request.params.clientId);
      const loansResponse = loans.map(loan => LoanResponse.fromLoan(loan));

      return reply.code(200).send(loansResponse);
    } catch (error) {
      return reply.code(500).send({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
