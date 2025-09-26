/**
 * Search Bar component - Provides URL search functionality
 */

import React from 'react';
import { Input, Button } from '../../../shared/components';
import { useDebounce } from '../../../shared/hooks';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onClear,
  placeholder = "Buscar URLs...",
  className
}) => {
  const debouncedValue = useDebounce(value, 300);

  React.useEffect(() => {
    // This effect could trigger search API calls
    // For now, we'll use it for local filtering
  }, [debouncedValue]);

  const handleClear = () => {
    onChange('');
    onClear?.();
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <Input
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="pl-10 pr-10"
        />

        {value && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <Button
              onClick={handleClear}
              variant="ghost"
              size="sm"
              className="p-1"
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              }
              title="Limpiar búsqueda"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;