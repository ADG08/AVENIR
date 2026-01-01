import { LoanRepository } from '@avenir/domain/repositories/LoanRepository';
import { LoanResponse } from '../../responses/LoanResponse';

export class GetClientLoansUseCase {
  constructor(private readonly loanRepository: LoanRepository) {}

  async execute(clientId: string): Promise<LoanResponse[]> {
    const loans = await this.loanRepository.getLoansByClientId(clientId);
    const sortedLoans = loans.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return sortedLoans.map(loan => LoanResponse.fromLoan(loan));
  }
}
