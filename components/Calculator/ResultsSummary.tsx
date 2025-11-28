import React from 'react';
import { formatCurrency } from '../../utils/formatters';
import { CalculationResult } from '../../types';
import { Calculator, DollarSign, TrendingUp, CalendarCheck } from 'lucide-react';

interface ResultsSummaryProps {
  results: CalculationResult;
}

export const ResultsSummary: React.FC<ResultsSummaryProps> = ({ results }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      {/* Monthly Payment - Featured */}
      <div className="md:col-span-2 bg-gradient-to-r from-brand-600 to-brand-700 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
            <CalendarCheck size={120} />
        </div>
        <p className="text-brand-100 font-medium mb-1 text-sm uppercase tracking-wider">Valor da Parcela (Inicial)</p>
        <h3 className="text-4xl font-bold tracking-tight">
          {formatCurrency(results.monthlyPayment)}
        </h3>
        <p className="text-brand-100 text-sm mt-2">
            Sistema Price (Parcelas Fixas)
        </p>
      </div>

      {/* Total Interest */}
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-red-50 rounded-lg text-red-600">
                <TrendingUp size={20} />
            </div>
            <span className="text-xs font-semibold px-2 py-1 bg-gray-100 text-gray-600 rounded-full">Custo</span>
        </div>
        <div>
            <p className="text-gray-500 text-sm font-medium">Total em Juros</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(results.totalInterest)}</p>
        </div>
      </div>

      {/* Total Cost */}
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-50 rounded-lg text-green-600">
                <DollarSign size={20} />
            </div>
            <span className="text-xs font-semibold px-2 py-1 bg-gray-100 text-gray-600 rounded-full">Total</span>
        </div>
        <div>
            <p className="text-gray-500 text-sm font-medium">Total a Pagar</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(results.totalAmount)}</p>
        </div>
      </div>
    </div>
  );
};