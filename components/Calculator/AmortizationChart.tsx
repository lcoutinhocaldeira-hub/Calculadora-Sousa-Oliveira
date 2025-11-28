import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { AmortizationRow } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface AmortizationChartProps {
  data: AmortizationRow[];
}

export const AmortizationChart: React.FC<AmortizationChartProps> = ({ data }) => {
  // Downsample data for better performance if too many months
  const chartData = data.length > 60 
    ? data.filter((_, index) => index % Math.ceil(data.length / 40) === 0 || index === data.length - 1)
    : data;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-96">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Evolução do Pagamento</h3>
      <ResponsiveContainer width="100%" height="85%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorPrincipal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#b91c1c" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#b91c1c" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorInterest" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#059669" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
          <XAxis 
            dataKey="period" 
            tick={{fontSize: 12, fill: '#6b7280'}} 
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            tickFormatter={(val) => `R$${(val/1000).toFixed(0)}k`}
            tick={{fontSize: 12, fill: '#6b7280'}} 
            tickLine={false}
            axisLine={false}
          />
          <Tooltip 
            formatter={(value: number) => [formatCurrency(value), '']}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Legend verticalAlign="top" height={36}/>
          <Area 
            type="monotone" 
            dataKey="totalPrincipalPaid" 
            name="Amortização Acumulada"
            stackId="1" 
            stroke="#b91c1c" 
            fill="url(#colorPrincipal)" 
            animationDuration={1500}
          />
          <Area 
            type="monotone" 
            dataKey="totalInterestPaid" 
            name="Juros Acumulados"
            stackId="1" 
            stroke="#059669" 
            fill="url(#colorInterest)" 
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};