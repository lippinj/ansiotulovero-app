import React from "react";
import { Expandable } from "./Expandable";

export interface PanelProps {
  title?: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  expandable?: boolean;
}

interface StaticPanelProps {
  title?: string;
  children: React.ReactNode;
}

function StaticPanel({ title, children }: StaticPanelProps) {
  if (!title) {
    return <div className="bg-white p-4 rounded shadow-md">{children}</div>;
  }

  return (
    <div className="bg-gray-50 rounded shadow-md">
      {/* Cover section - always visible */}
      <div className="flex items-center p-4">
        <div className="text-lg font-bold text-gray-800">{title}</div>
      </div>

      {/* Leaf section - always visible for static panels */}
      <div className="border-t border-gray-200 p-4 bg-white">{children}</div>
    </div>
  );
}

interface ExpandablePanelProps {
  title?: string;
  children: React.ReactNode;
  defaultExpanded: boolean;
}

function ExpandablePanel({
  title,
  children,
  defaultExpanded,
}: ExpandablePanelProps) {
  if (!title) {
    return (
      <Expandable defaultExpanded={defaultExpanded}>
        {(isExpanded, toggle) => (
          <div>
            <button
              onClick={toggle}
              className="flex items-center w-full text-lg font-bold text-gray-800 mb-3 hover:text-gray-600"
            >
              <span className="mr-2">{isExpanded ? "▼" : "▶"}</span>
              Panel
            </button>
            {isExpanded && (
              <div className="bg-white p-4 rounded shadow-md">{children}</div>
            )}
          </div>
        )}
      </Expandable>
    );
  }

  return (
    <Expandable defaultExpanded={defaultExpanded}>
      {(isExpanded, toggle) => (
        <div className="bg-gray-50 rounded shadow-md">
          {/* Cover section - always visible */}
          <div className="flex items-center p-4">
            <button
              onClick={toggle}
              className="flex items-center text-lg font-bold text-gray-800 hover:text-gray-600 mr-2"
              title={isExpanded ? "Piilota" : "Näytä"}
            >
              <span className="mr-2 text-gray-700">
                {isExpanded ? "▼" : "▶"}
              </span>
            </button>
            <div className="text-lg text-gray-800">{title}</div>
          </div>

          {/* Leaf section - toggleable */}
          {isExpanded && (
            <div className="border-t border-gray-200 p-4 bg-white">
              {children}
            </div>
          )}
        </div>
      )}
    </Expandable>
  );
}

export function Panel({
  title,
  children,
  defaultExpanded = false,
  expandable = true,
}: PanelProps) {
  if (!expandable) {
    return <StaticPanel title={title}>{children}</StaticPanel>;
  }

  return (
    <ExpandablePanel title={title} defaultExpanded={defaultExpanded}>
      {children}
    </ExpandablePanel>
  );
}
