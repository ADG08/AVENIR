export class LoanResponse {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly advisorId: string,
    public readonly clientId: string,
    public readonly amount: number,
    public readonly duration: number,
    public readonly annualInterestRate: number,
    public readonly insuranceRate: number,
    public readonly monthlyPayment: number,
    public readonly totalCost: number,
    public readonly totalInterest: number,
    public readonly insuranceCost: number,
    public readonly paidAmount: number,
    public readonly remainingPayment: number,
    public readonly progressPercentage: number,
    public readonly monthsPaid: number,
    public readonly status: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static fromLoan(loan: any): LoanResponse {
    return new LoanResponse(
      loan.id,
      loan.name,
      loan.advisorId,
      loan.clientId,
      loan.amount,
      loan.duration,
      loan.annualInterestRate,
      loan.insuranceRate,
      loan.monthlyPayment,
      loan.totalCost,
      loan.totalInterest,
      loan.insuranceCost,
      loan.paidAmount,
      loan.remainingPayment,
      loan.progressPercentage,
      loan.monthsPaid,
      loan.status,
      loan.createdAt,
      loan.updatedAt,
    );
  }
}
