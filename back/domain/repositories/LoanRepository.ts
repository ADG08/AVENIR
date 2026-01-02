import { Loan } from '../entities/Loan';

export interface LoanRepository {
  createLoan(loan: Loan): Promise<Loan>;
  getLoanById(id: string): Promise<Loan | null>;
  getLoansByClientId(clientId: string): Promise<Loan[]>;
  getLoansByAdvisorId(advisorId: string): Promise<Loan[]>;
  getAllLoans(): Promise<Loan[]>;
}
