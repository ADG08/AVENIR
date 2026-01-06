import { Request, Response } from 'express';

export class LoanController {
    constructor(
        private readonly createLoanUseCase: any,
        private readonly getClientLoansUseCase: any,
        private readonly processMonthlyPaymentsUseCase: any,
        private readonly userRepository: any
    ) {}
}
