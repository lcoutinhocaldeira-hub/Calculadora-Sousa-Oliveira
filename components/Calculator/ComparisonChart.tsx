import React, { useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { AmortizationRow } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface ComparisonChartProps {
  priceSchedule: AmortizationRow[];
  sacSchedule: AmortizationRow[];
}

export const ComparisonChart: React.FC<ComparisonChartProps> = ({ priceSchedule, sacSchedule }) => {
  const [viewMode, setViewMode] = useState<'payment' | 'interest'>('payment');

  // Merge data for the chart
  // We use the price schedule length as base since periods are the same
  const data = priceSchedule.map((priceRow, index) => {
    const sacRow = sacSchedule[index] || { payment: 0, totalInterestPaid: 0 };
    return {
      period: priceRow.period,
      pricePayment: priceRow.payment,
      sacPayment: sacRow.payment,
      priceInterestTotal: priceRow.totalInterestPaid,
      sacInterestTotal: sacRow.totalInterestPaid,
    };
  });

  // Downsample for performance if too large
  const chartData = data.length > 60 
    ? data.filter((_, index) => index % Math.ceil(data.length / 40) === 0 || index === data.length - 1)
    : data;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-8">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Price vs SAC</h3>
          <p className="text-sm text-gray-500">Comparativo entre os sistemas de amortização</p>
        </div>
        
        <div className="bg-gray-100 p-1 rounded-lg flex text-sm font-medium">
          <button
            onClick={() => setViewMode('payment')}
            className={`px-4 py-1.5 rounded-md transition-all ${
              viewMode === 'payment' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Valor da Parcela
          </button>
          <button
            onClick={() => setViewMode('interest')}
            className={`px-4 py-1.5 rounded-md transition-all ${
              viewMode === 'interest' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Juros Acumulados
          </button>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            <XAxis 
              dataKey="period" 
              tick={{fontSize: 12, fill: '#6b7280'}} 
              tickLine={false}
              axisLine={false}
              label={{ value: 'Mês', position: 'insideBottomRight', offset: -5, fontSize: 12, fill: '#9ca3af' }}
            />
            <YAxis 
              tickFormatter={(val) => `R$${(val/1000).toFixed(0)}k`}
              tick={{fontSize: 12, fill: '#6b7280'}} 
              tickLine={false}
              axisLine={false}
            />
            <Tooltip 
              formatter={(value: number) => [formatCurrency(value), '']}
              labelFormatter={(label) => `Mês ${label}`}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Legend verticalAlign="top" height={36} iconType="circle"/>
            
            {viewMode === 'payment' ? (
              <>
                <Line 
                  type="monotone" 
                  dataKey="pricePayment" 
                  name="Parcela Price" 
                  stroke="#b91c1c" // Brand Red
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="sacPayment" 
                  name="Parcela SAC" 
                  stroke="#2563eb" // Blue for contrast
                  strokeWidth={2.5}
                  strokeDasharray="5 5"
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              </>
            ) : (
              <>
                <Line 
                  type="monotone" 
                  dataKey="priceInterestTotal" 
                  name="Juros Totais Price" 
                  stroke="#b91c1c" 
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="sacInterestTotal" 
                  name="Juros Totais SAC" 
                  stroke="#2563eb" 
                  strokeWidth={2.5}
                  strokeDasharray="5 5"
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              </>
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-4 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100">
        <div>
            <strong className="text-brand-700 block mb-1">Tabela Price:</strong>
            Parcelas fixas. Paga-se mais juros no total pois o saldo devedor cai mais lentamente.
        </div>
        <div>
            <strong className="text-blue-600 block mb-1">Tabela SAC:</strong>
            Parcelas decrescentes. Maior valor inicial, mas paga-se menos juros no final.
        </div>
      </div>
    </div>
  );
};