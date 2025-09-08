import React, { useState, ReactNode } from "react";

interface Props {
  children: (isExpanded: boolean, toggle: () => void) => ReactNode;
  defaultExpanded?: boolean;
}

export function Expandable({ children, defaultExpanded = false }: Props) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const toggle = () => setIsExpanded(!isExpanded);

  return <>{children(isExpanded, toggle)}</>;
}
