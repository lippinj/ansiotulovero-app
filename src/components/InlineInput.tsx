import React, { useState, useEffect } from 'react';

export interface InlineInputProps {
  value: number;
  onChange: (value: number) => void;
  unit?: string;
  step?: number;
  width?: string;
}

export function InlineInput({ 
  value, 
  onChange, 
  unit = '%', 
  step = 0.01, 
  width = "w-16" 
}: InlineInputProps) {
  const [inputValue, setInputValue] = useState(value.toString());

  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    // Only call onChange if the value is a valid number
    const numericValue = parseFloat(newValue);
    if (!isNaN(numericValue)) {
      onChange(numericValue);
    } else if (newValue === '' || newValue === '-') {
      // Allow empty string or just a minus sign during typing
      onChange(0);
    }
  };

  return (
    <div className="inline-flex items-center">
      <input
        type="number"
        step={step}
        value={inputValue}
        onChange={handleChange}
        className={`${width} px-1 py-1 border border-gray-300 rounded text-xs mx-1`}
      />
      <span className="text-xs text-gray-500">{unit}</span>
    </div>
  );
}