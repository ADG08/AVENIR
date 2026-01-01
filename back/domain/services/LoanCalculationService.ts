/**
 * Service de calcul des crédits
 * Centralise tous les calculs financiers liés aux crédits
 */
export interface LoanCalculationResult {
  amount: number;
  duration: number;
  annualInterestRate: number;
  insuranceRate: number;
  monthlyPayment: number;
  totalCost: number;
  totalInterest: number;
  insuranceCost: number;
}

export class LoanCalculationService {
  private static roundToCents(value: number): number {
    return Math.round(value * 100) / 100;
  }

  static calculateLoan(
    amount: number,
    duration: number,
    annualInterestRate: number,
    insuranceRate: number,
  ): LoanCalculationResult {
    const principal = this.roundToCents(amount);
    const months = duration;
    const annualRate = annualInterestRate / 100;
    const insuranceRateDecimal = insuranceRate / 100;

    const monthlyRate = annualRate / 12;

    // Calcul de la mensualité sans assurance
    const monthlyPaymentWithoutInsurance =
      principal * (monthlyRate / (1 - Math.pow(1 + monthlyRate, -months)));

    // Calcul de l'assurance
    const insuranceCost = this.roundToCents(principal * insuranceRateDecimal);
    const monthlyInsurance = insuranceCost / months;

    // Mensualité totale (crédit + assurance)
    const monthlyPayment = this.roundToCents(monthlyPaymentWithoutInsurance + monthlyInsurance);

    const totalCost = this.roundToCents(monthlyPayment * months);
    const totalInterest = this.roundToCents(totalCost - principal - insuranceCost);

    return {
      amount: principal,
      duration: months,
      annualInterestRate: this.roundToCents(annualInterestRate),
      insuranceRate: this.roundToCents(insuranceRate),
      monthlyPayment,
      totalCost,
      totalInterest,
      insuranceCost,
    };
  }
}
