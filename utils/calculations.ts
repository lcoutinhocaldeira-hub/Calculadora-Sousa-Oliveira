import { AmortizationRow, CalculationResult } from '../types';

export const calculatePriceTable = (
  amount: number,
  rate: number,
  period: number,
  downPayment: number = 0,
  isRateYearly: boolean = false,
  isPeriodYears: boolean = false
): CalculationResult => {
  
  // 1. Adjust Principal
  const principal = amount - downPayment;
  if (principal <= 0) {
    throw new Error("O valor da entrada não pode ser maior ou igual ao valor do financiamento.");
  }

  // 2. Adjust Rate to Monthly
  let monthlyRate = isRateYearly 
    ? Math.pow(1 + rate / 100, 1 / 12) - 1 
    : rate / 100;

  // 3. Adjust Period to Months
  const totalMonths = isPeriodYears ? period * 12 : period;

  // 4. Calculate PMT (Monthly Payment)
  // Formula: PMT = PV * (i * (1 + i)^n) / ((1 + i)^n - 1)
  const pmt = 
    principal * 
    ((monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
    (Math.pow(1 + monthlyRate, totalMonths) - 1));

  const schedule: AmortizationRow[] = [];
  let currentBalance = principal;
  let totalInterestPaid = 0;
  let totalPrincipalPaid = 0;

  for (let i = 1; i <= totalMonths; i++) {
    const interest = currentBalance * monthlyRate;
    const amortization = pmt - interest;
    
    // Handle last installment rounding differences
    let finalPayment = pmt;
    let finalAmortization = amortization;
    
    if (i === totalMonths) {
        finalAmortization = currentBalance;
        finalPayment = currentBalance + interest;
        currentBalance = 0;
    } else {
        currentBalance -= amortization;
        if (currentBalance < 0) currentBalance = 0; // Safety check
    }

    totalInterestPaid += interest;
    totalPrincipalPaid += finalAmortization;

    schedule.push({
      period: i,
      payment: finalPayment,
      interest: interest,
      principal: finalAmortization,
      balance: currentBalance,
      totalInterestPaid,
      totalPrincipalPaid
    });
  }

  return {
    monthlyPayment: pmt,
    totalAmount: totalPrincipalPaid + totalInterestPaid + downPayment, // Total cost including down payment
    totalInterest: totalInterestPaid,
    totalPrincipal: principal, // Financed amount
    schedule,
  };
};

export const calculateSACTable = (
  amount: number,
  rate: number,
  period: number,
  downPayment: number = 0,
  isRateYearly: boolean = false,
  isPeriodYears: boolean = false
): CalculationResult => {
  
  const principal = amount - downPayment;
  if (principal <= 0) throw new Error("Entrada inválida.");

  let monthlyRate = isRateYearly 
    ? Math.pow(1 + rate / 100, 1 / 12) - 1 
    : rate / 100;

  const totalMonths = isPeriodYears ? period * 12 : period;

  // SAC: Constant Amortization
  const constantAmortization = principal / totalMonths;

  const schedule: AmortizationRow[] = [];
  let currentBalance = principal;
  let totalInterestPaid = 0;
  let totalPrincipalPaid = 0;

  for (let i = 1; i <= totalMonths; i++) {
    const interest = currentBalance * monthlyRate;
    const payment = constantAmortization + interest;
    
    // Update logic for SAC
    let finalAmortization = constantAmortization;
    let finalPayment = payment;

    // Last payment check for precision
    if (i === totalMonths) {
        finalAmortization = currentBalance;
        finalPayment = finalAmortization + interest;
        currentBalance = 0;
    } else {
        currentBalance -= constantAmortization;
        if (currentBalance < 0) currentBalance = 0;
    }

    totalInterestPaid += interest;
    totalPrincipalPaid += finalAmortization;

    schedule.push({
      period: i,
      payment: finalPayment,
      interest: interest,
      principal: finalAmortization,
      balance: currentBalance,
      totalInterestPaid,
      totalPrincipalPaid
    });
  }

  // Monthly payment varies in SAC, we return the first one as reference for "monthlyPayment" prop
  // but usually SAC is described by "First Payment" and "Last Payment"
  return {
    monthlyPayment: schedule[0].payment, 
    totalAmount: totalPrincipalPaid + totalInterestPaid + downPayment,
    totalInterest: totalInterestPaid,
    totalPrincipal: principal,
    schedule,
  };
};