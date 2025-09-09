import React, { useState, useEffect } from 'react';
import { useFoldoutPaneGroup } from './FoldoutPaneGroup';

export interface FoldoutPaneProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
  toggleText?: string;
  toggleTitle?: string;
  className?: string;
  coverClassName?: string;
  leafClassName?: string;
  groupId?: string;
}

export function FoldoutPane({
  children,
  defaultOpen = false,
  toggleText = "muokkaa",
  toggleTitle,
  className = "bg-gray-50 rounded",
  coverClassName = "flex items-center justify-between p-4",
  leafClassName = "border-t border-gray-200 p-4",
  groupId
}: FoldoutPaneProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const groupContext = useFoldoutPaneGroup();
  
  const isGrouped = groupId && groupContext;
  const actualIsOpen = isGrouped ? groupContext.openPane === groupId : isOpen;
  
  useEffect(() => {
    if (isGrouped && defaultOpen) {
      groupContext.setOpenPane(groupId);
    }
  }, [isGrouped, defaultOpen, groupId, groupContext]);

  const childrenArray = React.Children.toArray(children);
  const cover = childrenArray[0];
  const leaf = childrenArray.slice(1);

  return (
    <div className={className}>
      {/* Cover section - always visible */}
      <div className={coverClassName}>
        {cover}
        <button
          onClick={() => {
            if (isGrouped) {
              groupContext.setOpenPane(actualIsOpen ? null : groupId);
            } else {
              setIsOpen(!isOpen);
            }
          }}
          className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-all duration-200 px-3 py-1 rounded"
          title={toggleTitle}
        >
          {toggleText}
        </button>
      </div>

      {/* Leaf section - toggleable */}
      {actualIsOpen && (
        <div className={leafClassName}>
          {leaf}
        </div>
      )}
    </div>
  );
}