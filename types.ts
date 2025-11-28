export interface FinancingFormData {
  amount: number | string;
  interestRate: number | string;
  period: number | string;
  downPayment: number | string;
  periodType: 'months' | 'years';
  rateType: 'monthly' | 'yearly';
}

export interface AmortizationRow {
  period: number;
  payment: number;
  interest: number;
  principal: number;
  balance: number;
  totalInterestPaid: number;
  totalPrincipalPaid: number;
}

export interface CalculationResult {
  monthlyPayment: number;
  totalAmount: number;
  totalInterest: number;
  totalPrincipal: number;
  schedule: AmortizationRow[];
}

export interface ValidationErrors {
  amount?: string;
  interestRate?: string;
  period?: string;
  downPayment?: string;
}