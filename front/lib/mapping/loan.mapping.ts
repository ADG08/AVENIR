import { ClientLoan } from '@/types/client';
import { LoanStatus } from '@avenir/shared/enums';
import { LoanApiResponse } from '@/lib/api/loan.api';

export const mapLoanApiResponseToClientLoan = (
  loan: LoanApiResponse,
  clientId: string
): ClientLoan => {
  const endDate = new Date(loan.createdAt);
  endDate.setMonth(endDate.getMonth() + loan.duration);

  return {
    id: loan.id,
    clientId: clientId,
    name: loan.name,
    amount: loan.amount,
    duration: loan.duration,
    interestRate: loan.annualInterestRate,
    insuranceRate: loan.insuranceRate,
    monthlyPayment: loan.monthlyPayment,
    totalCost: loan.totalCost,
    totalInterest: loan.totalInterest,
    insuranceCost: loan.insuranceCost,
    remainingPayment: loan.remainingPayment,
    progressPercentage: loan.progressPercentage,
    monthsPaid: loan.monthsPaid,
    status: loan.status as LoanStatus,
    startDate: loan.createdAt,
    endDate: endDate,
    createdAt: loan.createdAt,
  };
};

export const mapLoansApiResponseToClientLoans = (
  loans: LoanApiResponse[],
  clientId: string
): ClientLoan[] => {
  return loans.map(loan => mapLoanApiResponseToClientLoan(loan, clientId));
};
