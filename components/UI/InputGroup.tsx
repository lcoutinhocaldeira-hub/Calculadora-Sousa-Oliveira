import React from 'react';
import { AlertCircle } from 'lucide-react';

interface InputGroupProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
  suffix?: string;
  prefix?: string;
}

export const InputGroup: React.FC<InputGroupProps> = ({
  label,
  error,
  icon,
  suffix,
  prefix,
  className,
  id,
  ...props
}) => {
  return (
    <div className={`w-full ${className}`}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative rounded-md shadow-sm">
        {prefix && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="text-gray-500 sm:text-sm">{prefix}</span>
          </div>
        )}
        
        <input
          id={id}
          className={`
            block w-full rounded-md border py-2.5 sm:text-sm focus:ring-2 focus:ring-offset-0 transition-all
            ${prefix ? 'pl-10' : 'pl-3'}
            ${suffix ? 'pr-12' : 'pr-3'}
            ${error 
              ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500' 
              : 'border-gray-300 text-gray-900 focus:border-brand-500 focus:ring-brand-500'
            }
          `}
          {...props}
        />

        {suffix && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <span className="text-gray-500 sm:text-sm">{suffix}</span>
          </div>
        )}
      </div>
      
      {error && (
        <div className="mt-1 flex items-center text-sm text-red-600 animate-fadeIn">
          <AlertCircle className="h-4 w-4 mr-1" />
          {error}
        </div>
      )}
    </div>
  );
};