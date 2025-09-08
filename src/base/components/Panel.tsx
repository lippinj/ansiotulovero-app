import React from 'react';
import { Expandable } from './Expandable';

export interface PanelProps {
  title?: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  expandable?: boolean;
}

interface PanelTitleProps {
  children: React.ReactNode;
}

function PanelTitle({ children }: PanelTitleProps) {
  return (
    <h2 className="text-lg font-bold text-gray-800 mb-3">
      {children}
    </h2>
  );
}

interface PanelContentProps {
  children: React.ReactNode;
}

function PanelContent({ children }: PanelContentProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      {children}
    </div>
  );
}

interface StaticPanelProps {
  title?: string;
  children: React.ReactNode;
}

function StaticPanel({ title, children }: StaticPanelProps) {
  return (
    <div>
      {title && <PanelTitle>{title}</PanelTitle>}
      <PanelContent>{children}</PanelContent>
    </div>
  );
}

interface ExpandablePanelProps {
  title?: string;
  children: React.ReactNode;
  defaultExpanded: boolean;
}

function ExpandablePanel({ title, children, defaultExpanded }: ExpandablePanelProps) {
  return (
    <Expandable defaultExpanded={defaultExpanded}>
      {(isExpanded, toggle) => (
        <div>
          {title && (
            <button
              onClick={toggle}
              className="flex items-center w-full text-lg font-bold text-gray-800 mb-3 hover:text-gray-600"
            >
              <span className="mr-2">
                {isExpanded ? '▼' : '▶'}
              </span>
              {title}
            </button>
          )}
          {isExpanded && <PanelContent>{children}</PanelContent>}
        </div>
      )}
    </Expandable>
  );
}

export function Panel({ title, children, defaultExpanded = false, expandable = true }: PanelProps) {
  if (!expandable) {
    return <StaticPanel title={title}>{children}</StaticPanel>;
  }

  return (
    <ExpandablePanel title={title} defaultExpanded={defaultExpanded}>
      {children}
    </ExpandablePanel>
  );
}