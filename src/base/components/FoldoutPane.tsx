import React, { useState } from 'react';

export interface FoldoutPaneProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
  toggleText?: string;
  toggleTitle?: string;
  className?: string;
  coverClassName?: string;
  leafClassName?: string;
}

export function FoldoutPane({
  children,
  defaultOpen = false,
  toggleText = "muokkaa",
  toggleTitle,
  className = "bg-gray-50 rounded",
  coverClassName = "flex items-center justify-between p-4",
  leafClassName = "border-t border-gray-200 p-4"
}: FoldoutPaneProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const childrenArray = React.Children.toArray(children);
  const cover = childrenArray[0];
  const leaf = childrenArray.slice(1);

  return (
    <div className={className}>
      {/* Cover section - always visible */}
      <div className={coverClassName}>
        {cover}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-all duration-200 px-3 py-1 rounded"
          title={toggleTitle}
        >
          {toggleText}
        </button>
      </div>

      {/* Leaf section - toggleable */}
      {isOpen && (
        <div className={leafClassName}>
          {leaf}
        </div>
      )}
    </div>
  );
}