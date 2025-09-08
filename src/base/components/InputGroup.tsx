import React from "react";

interface InputGroupProps {
  title?: string;
  children: React.ReactNode;
}

export function InputGroup({ title, children }: InputGroupProps) {
  return (
    <div className="space-y-2">
      {title && <h3 className="text-sm font-semibold text-gray-800 mb-2">{title}</h3>}
      {children}
    </div>
  );
}

interface InputGroupItemProps {
  label: string;
  children: React.ReactNode;
}

export function InputGroupItem({ label, children }: InputGroupItemProps) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1">
        {label}
      </label>
      {children}
    </div>
  );
}