import React, { createContext, useContext, useState, useCallback } from 'react';

interface FoldoutPaneGroupContextType {
  openPane: string | null;
  setOpenPane: (paneId: string | null) => void;
}

const FoldoutPaneGroupContext = createContext<FoldoutPaneGroupContextType | null>(null);

export interface FoldoutPaneGroupProps {
  children: React.ReactNode;
}

export function FoldoutPaneGroup({ children }: FoldoutPaneGroupProps) {
  const [openPane, setOpenPane] = useState<string | null>(null);

  const handleSetOpenPane = useCallback((paneId: string | null) => {
    setOpenPane(paneId);
  }, []);

  return (
    <FoldoutPaneGroupContext.Provider value={{ openPane, setOpenPane: handleSetOpenPane }}>
      {children}
    </FoldoutPaneGroupContext.Provider>
  );
}

export function useFoldoutPaneGroup() {
  return useContext(FoldoutPaneGroupContext);
}