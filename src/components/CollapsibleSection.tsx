
export interface CollapsibleSectionProps {
  title: string;
  sectionKey: string;
  isExpanded: boolean;
  onToggle: (sectionKey: string) => void;
  children: React.ReactNode;
}

export function CollapsibleSection({ 
  title, 
  sectionKey, 
  isExpanded, 
  onToggle, 
  children 
}: CollapsibleSectionProps) {
  return (
    <div>
      <button
        onClick={() => onToggle(sectionKey)}
        className="flex items-center w-full text-base font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-1 hover:text-gray-600"
      >
        <span className="mr-2">
          {isExpanded ? '▼' : '▶'}
        </span>
        {title}
      </button>
      {isExpanded && (
        <div className="space-y-3 mb-6">
          {children}
        </div>
      )}
    </div>
  );
}