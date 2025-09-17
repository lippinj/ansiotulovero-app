import React from "react";

interface Props {
  children: React.ReactNode;
}

export function PageTitle({ children }: Props) {
  return (
    <h1 className="text-3xl text-gray-800 mb-4 text-center">{children}</h1>
  );
}
