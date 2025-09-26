import React from 'react';
import { InputProps } from '../../types';

const Input: React.FC<InputProps> = ({
  id,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  label,
  error,
  disabled = false,
  required = false,
  autoFocus = false,
  className = '',
  'data-testid': testId,
  ...props
}) => {
  const inputId = id || name;

  const baseClasses = 'w-full px-4 py-3 border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1';

  const stateClasses = error
    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500';

  const disabledClasses = disabled
    ? 'bg-gray-50 cursor-not-allowed opacity-60'
    : 'bg-white hover:border-gray-400';

  const classes = [
    baseClasses,
    stateClasses,
    disabledClasses,
    'rounded-lg',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <input
        id={inputId}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        autoFocus={autoFocus}
        className={classes}
        data-testid={testId}
        {...props}
      />

      {error && (
        <p className="text-sm text-red-600 flex items-center">
          <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;