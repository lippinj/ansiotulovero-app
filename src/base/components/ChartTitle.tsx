import React from 'react';

export interface ChartTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function ChartTitle({ 
  children, 
  className = "text-lg text-center font-normal text-gray-800 mt-8" 
}: ChartTitleProps) {
  return (
    <h3 className={className}>
      {children}
    </h3>
  );
}