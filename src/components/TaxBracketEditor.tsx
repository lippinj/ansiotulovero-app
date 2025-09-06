import React from 'react';
import { TaxBracket } from '../tax/TaxParameters';

export interface TaxBracketEditorProps {
  brackets: TaxBracket[];
  onBracketsChange: (brackets: TaxBracket[]) => void;
}

export function TaxBracketEditor({ brackets, onBracketsChange }: TaxBracketEditorProps) {
  const addBracket = () => {
    const newBracket: TaxBracket = {
      min: 200000,
      max: Infinity,
      rate: 45
    };
    onBracketsChange([...brackets, newBracket]);
  };

  const removeBracket = (index: number) => {
    if (brackets.length <= 1) return;
    
    const newBrackets = [...brackets];
    const bracketToDelete = newBrackets[index];
    
    // If not removing the first bracket, extend the previous bracket to fill the space
    if (index > 0) {
      newBrackets[index - 1].max = bracketToDelete.max;
    }
    
    // Remove the bracket
    newBrackets.splice(index, 1);
    
    // Update max values to maintain continuity
    for (let i = 0; i < newBrackets.length - 1; i++) {
      newBrackets[i].max = newBrackets[i + 1].min;
    }
    newBrackets[newBrackets.length - 1].max = Infinity;
    
    onBracketsChange(newBrackets);
  };

  const updateBracketMin = (index: number, minValue: number) => {
    const newBrackets = [...brackets];
    newBrackets[index] = { ...newBrackets[index], min: minValue };
    
    // Update max values based on min values
    for (let i = 0; i < newBrackets.length - 1; i++) {
      newBrackets[i].max = newBrackets[i + 1].min;
    }
    newBrackets[newBrackets.length - 1].max = Infinity;
    
    onBracketsChange(newBrackets);
  };

  const updateBracketRate = (index: number, rate: number) => {
    const newBrackets = [...brackets];
    newBrackets[index] = { ...newBrackets[index], rate };
    onBracketsChange(newBrackets);
  };

  return (
    <div className="bg-gray-50 p-3 rounded">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-medium text-gray-700">Veroluokat</span>
        <button
          onClick={addBracket}
          className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
        >
          + Lisää
        </button>
      </div>
      <div className="space-y-2">
        {brackets.map((bracket, index) => (
          <div key={index} className="flex items-center space-x-2 text-xs">
            <input
              type="number"
              value={bracket.min}
              onChange={(e) => updateBracketMin(index, parseFloat(e.target.value) || 0)}
              className="w-20 px-1 py-1 border border-gray-300 rounded"
              disabled={index === 0}
            />
            <span>€+:</span>
            <input
              type="number"
              step={0.01}
              value={bracket.rate}
              onChange={(e) => updateBracketRate(index, parseFloat(e.target.value) || 0)}
              className="w-16 px-1 py-1 border border-gray-300 rounded"
            />
            <span>%</span>
            {brackets.length > 1 && (
              <button
                onClick={() => removeBracket(index)}
                className="text-red-500 hover:text-red-700 ml-2"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}