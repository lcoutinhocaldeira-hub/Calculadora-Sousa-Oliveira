import React, { useState } from 'react';
import { AmortizationRow } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { ChevronDown, ChevronUp, Download } from 'lucide-react';

interface AmortizationTableProps {
  schedule: AmortizationRow[];
}

export const AmortizationTable: React.FC<AmortizationTableProps> = ({ schedule }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [visibleRows, setVisibleRows] = useState(12);

  const toggleOpen = () => setIsOpen(!isOpen);
  
  const showMore = () => {
    setVisibleRows(prev => Math.min(prev + 24, schedule.length));
  };

  const handleDownloadCSV = () => {
    const headers = ['Parcela', 'Valor Parcela', 'Amortização', 'Juros', 'Saldo Devedor'];
    const csvContent = [
      headers.join(','),
      ...schedule.map(row => [
        row.period,
        row.payment.toFixed(2),
        row.principal.toFixed(2),
        row.interest.toFixed(2),
        row.balance.toFixed(2)
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'tabela_price_simulacao.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-8">
      <div 
        className="p-6 flex items-center justify-between cursor-pointer bg-gray-50 border-b border-gray-100 hover:bg-gray-100 transition-colors"
        onClick={toggleOpen}
      >
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Tabela de Amortização</h3>
          <p className="text-sm text-gray-500">Detalhes mensais do financiamento</p>
        </div>
        <div className="flex items-center space-x-2">
            <button 
                onClick={(e) => { e.stopPropagation(); handleDownloadCSV(); }}
                className="p-2 text-gray-500 hover:text-brand-600 hover:bg-white rounded-full transition-all"
                title="Exportar CSV"
            >
                <Download size={20} />
            </button>
            {isOpen ? <ChevronUp className="text-gray-500" /> : <ChevronDown className="text-gray-500" />}
        </div>
      </div>

      {isOpen && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Parcela</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Amortização</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Juros</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Saldo Devedor</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {schedule.slice(0, visibleRows).map((row) => (
                <tr key={row.period} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{row.period}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 font-semibold">{formatCurrency(row.payment)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-green-600 hidden sm:table-cell">{formatCurrency(row.principal)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-red-600 hidden sm:table-cell">{formatCurrency(row.interest)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">{formatCurrency(row.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {visibleRows < schedule.length && (
            <div className="p-4 bg-gray-50 text-center border-t border-gray-200">
              <button 
                onClick={showMore}
                className="text-sm font-medium text-brand-600 hover:text-brand-800 transition-colors"
              >
                Carregar mais parcelas...
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};