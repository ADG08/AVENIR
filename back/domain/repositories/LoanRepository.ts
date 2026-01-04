import { Loan } from '../entities/Loan';
import { LoanStatus } from "@avenir/shared/enums/LoanStatus";

export interface LoanRepository {
  createLoan(loan: Loan): Promise<Loan>;
  getLoanById(id: string): Promise<Loan | null>;
  getLoansByClientId(clientId: string): Promise<Loan[]>;
  getLoansByAdvisorId(advisorId: string): Promise<Loan[]>;
  getAllLoans(): Promise<Loan[]>;
  updateLoan(loan: Loan): Promise<Loan>;
  getLoansByStatus(status: LoanStatus): Promise<Loan[]>;
}
