import React, { useState, useEffect } from 'react';
import { FinancingFormData, ValidationErrors, CalculationResult } from './types';
import { calculatePriceTable, calculateSACTable } from './utils/calculations';
import { InputGroup } from './components/UI/InputGroup';
import { ResultsSummary } from './components/Calculator/ResultsSummary';
import { AmortizationTable } from './components/Calculator/AmortizationTable';
import { AmortizationChart } from './components/Calculator/AmortizationChart';
import { ComparisonChart } from './components/Calculator/ComparisonChart';
import { Calculator, AlertTriangle } from 'lucide-react';

const App: React.FC = () => {
  // State
  const [formData, setFormData] = useState<FinancingFormData>({
    amount: '100000',
    interestRate: '1.5',
    period: '24',
    downPayment: '0',
    periodType: 'months',
    rateType: 'monthly'
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [sacResult, setSacResult] = useState<CalculationResult | null>(null);

  // Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validate = (): boolean => {
    const newErrors: ValidationErrors = {};
    const amount = Number(formData.amount);
    const rate = Number(formData.interestRate);
    const period = Number(formData.period);
    const downPayment = Number(formData.downPayment);

    // Amount
    if (!formData.amount || amount < 1000) newErrors.amount = "Mínimo de R$ 1.000";
    if (amount > 10000000) newErrors.amount = "Máximo de R$ 10.000.000";

    // Rate
    if (!formData.interestRate || rate < 0.1) newErrors.interestRate = "Mínimo 0,1%";
    if (rate > 15 && formData.rateType === 'monthly') newErrors.interestRate = "Máximo 15% ao mês";
    if (rate > 200 && formData.rateType === 'yearly') newErrors.interestRate = "Taxa anual muito alta";

    // Period
    const totalMonths = formData.periodType === 'years' ? period * 12 : period;
    if (!formData.period || totalMonths < 6) newErrors.period = "Prazo mínimo de 6 meses";
    if (totalMonths > 480) newErrors.period = "Prazo máximo de 480 meses (40 anos)";

    // Down Payment
    if (downPayment >= amount) newErrors.downPayment = "A entrada deve ser menor que o valor total";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (validate()) {
      try {
        const amount = Number(formData.amount);
        const rate = Number(formData.interestRate);
        const period = Number(formData.period);
        const downPayment = Number(formData.downPayment);
        const isRateYearly = formData.rateType === 'yearly';
        const isPeriodYears = formData.periodType === 'years';

        // Calculate Price
        const priceRes = calculatePriceTable(
          amount, rate, period, downPayment, isRateYearly, isPeriodYears
        );
        setResult(priceRes);

        // Calculate SAC for comparison
        const sacRes = calculateSACTable(
          amount, rate, period, downPayment, isRateYearly, isPeriodYears
        );
        setSacResult(sacRes);

      } catch (err) {
        // Handle logic errors (like negative principal)
        console.error(err);
      }
    } else {
        setResult(null);
        setSacResult(null);
    }
  };

  // Auto-calculate on mount
  useEffect(() => {
    handleCalculate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:h-28 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Logo Recreation (SVG Vector) */}
            <div className="flex flex-col items-center select-none">
                {/* Bridge Icon */}
                <svg width="60" height="35" viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-brand-700 mb-1">
                    {/* Pillars */}
                    <path d="M38 10 L38 52" stroke="currentColor" strokeWidth="3" strokeLinecap="square" />
                    <path d="M62 10 L62 52" stroke="currentColor" strokeWidth="3" strokeLinecap="square" />
                    {/* Main Cable */}
                    <path d="M5 42 C 30 25, 70 25, 95 42" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    {/* Deck Curve */}
                    <path d="M12 45 Q 50 38 88 45" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                {/* Text */}
                <div className="text-center">
                    <h1 className="text-base sm:text-lg font-bold tracking-widest text-black uppercase leading-none font-sans">Sousa de Oliveira</h1>
                    <p className="text-[10px] sm:text-[11px] tracking-[0.3em] text-gray-600 uppercase mt-1 font-normal">Consultoria</p>
                </div>
            </div>
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-500">
            <a href="#" className="hover:text-brand-600 transition-colors">Tabela Price</a>
            <a href="#" className="hover:text-brand-600 transition-colors">Tabela SAC</a>
            <a href="#" className="hover:text-brand-600 transition-colors">Sobre</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Input Form */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-32">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900">Simulador de Financiamento</h2>
                <p className="text-sm text-gray-500 mt-1">Preencha os dados para simular seu financiamento.</p>
              </div>

              <form onSubmit={handleCalculate} className="space-y-5">
                
                {/* Amount */}
                <InputGroup 
                  id="amount"
                  name="amount"
                  type="number"
                  label="Valor do Financiamento"
                  prefix="R$"
                  placeholder="0,00"
                  value={formData.amount}
                  onChange={handleInputChange}
                  error={errors.amount}
                />

                {/* Down Payment */}
                <InputGroup 
                  id="downPayment"
                  name="downPayment"
                  type="number"
                  label="Valor da Entrada (Opcional)"
                  prefix="R$"
                  placeholder="0,00"
                  value={formData.downPayment}
                  onChange={handleInputChange}
                  error={errors.downPayment}
                />

                {/* Interest Rate */}
                <div className="flex gap-2">
                    <InputGroup 
                      className="flex-grow"
                      id="interestRate"
                      name="interestRate"
                      type="number"
                      step="0.01"
                      label="Taxa de Juros"
                      suffix="%"
                      value={formData.interestRate}
                      onChange={handleInputChange}
                      error={errors.interestRate}
                    />
                    <div className="w-1/3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Período</label>
                        <select 
                            name="rateType"
                            value={formData.rateType}
                            onChange={handleInputChange}
                            className="block w-full rounded-md border border-gray-300 py-2.5 pl-3 pr-8 text-sm focus:border-brand-500 focus:ring-brand-500"
                        >
                            <option value="monthly">Ao Mês</option>
                            <option value="yearly">Ao Ano</option>
                        </select>
                    </div>
                </div>

                {/* Term */}
                <div className="flex gap-2">
                    <InputGroup 
                      className="flex-grow"
                      id="period"
                      name="period"
                      type="number"
                      label="Prazo"
                      value={formData.period}
                      onChange={handleInputChange}
                      error={errors.period}
                    />
                    <div className="w-1/3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Unidade</label>
                        <select 
                            name="periodType"
                            value={formData.periodType}
                            onChange={handleInputChange}
                            className="block w-full rounded-md border border-gray-300 py-2.5 pl-3 pr-8 text-sm focus:border-brand-500 focus:ring-brand-500"
                        >
                            <option value="months">Meses</option>
                            <option value="years">Anos</option>
                        </select>
                    </div>
                </div>

                <div className="pt-4">
                  <button 
                    type="submit"
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-colors"
                  >
                    Calcular Financiamento
                  </button>
                </div>
              </form>
              
              <div className="mt-6 bg-brand-50 p-4 rounded-lg flex gap-3 items-start">
                 <AlertTriangle className="text-brand-600 shrink-0 mt-0.5" size={18}/>
                 <p className="text-xs text-brand-800 leading-relaxed">
                   Os cálculos são estimativas baseadas na <strong>Tabela Price</strong> e não incluem IOF, seguros e outras taxas administrativas que podem ser cobradas pela instituição financeira.
                 </p>
              </div>
            </div>
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-8">
            {result ? (
              <div className="animate-fadeIn pb-12">
                 <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Resultados da Simulação</h2>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Cálculo Realizado</span>
                 </div>
                 
                 <ResultsSummary results={result} />
                 
                 <div className="grid grid-cols-1 gap-8">
                    <AmortizationChart data={result.schedule} />
                    
                    {sacResult && (
                        <ComparisonChart 
                            priceSchedule={result.schedule} 
                            sacSchedule={sacResult.schedule} 
                        />
                    )}
                    
                    <AmortizationTable schedule={result.schedule} />
                 </div>
              </div>
            ) : (
                <div className="h-full flex flex-col items-center justify-center bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center text-gray-500">
                    <Calculator size={48} className="mb-4 text-gray-300" />
                    <p className="text-lg font-medium">Preencha o formulário e calcule</p>
                    <p className="text-sm mt-2 max-w-xs">Os resultados detalhados do seu financiamento aparecerão aqui.</p>
                </div>
            )}
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
          <p className="mb-2">&copy; {new Date().getFullYear()} Sousa de Oliveira Consultoria.</p>
          <p>
            Esta ferramenta é apenas para fins informativos e não constitui aconselhamento financeiro oficial.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;