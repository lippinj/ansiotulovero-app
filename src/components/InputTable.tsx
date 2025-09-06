import React from "react";

export interface InputTableRowProps {
  label: string;
  children: React.ReactNode;
}

export function InputTableRow({ label, children }: InputTableRowProps) {
  return (
    <tr>
      <td className="text-gray-700 py-1 pr-4 align-top w-40">{label}</td>
      <td className="text-gray-600 py-1">{children}</td>
    </tr>
  );
}

export interface InputTableProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function InputTable({
  title,
  children,
  className = "",
}: InputTableProps) {
  return (
    <div className={`flex-1 ${className}`}>
      {title && (
        <h3 className="text-sm font-semibold text-gray-700 mb-2">{title}</h3>
      )}
      <table className="w-full text-sm">
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export interface InputTableContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function InputTableContainer({
  children,
  className = "",
}: InputTableContainerProps) {
  return (
    <div
      className={`grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4 ${className}`}
    >
      {children}
    </div>
  );
}
