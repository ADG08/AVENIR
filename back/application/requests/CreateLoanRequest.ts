export class CreateLoanRequest {
  constructor(
    public readonly name: string,
    public readonly advisorId: string,
    public readonly clientId: string,
    public readonly amount: number,
    public readonly duration: number,
    public readonly interestRate: number,
    public readonly insuranceRate: number,
  ) {}
}
