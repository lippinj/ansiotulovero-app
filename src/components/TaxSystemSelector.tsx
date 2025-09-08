import React from "react";
import { taxParameterPresets } from "../tax/TaxParameters";

interface Props {
  currentSystemKey: string;
  referenceSystemKey: string;
  onCurrentSystemChange: (systemKey: string) => void;
  onReferenceSystemChange: (systemKey: string) => void;
}

export function TaxSystemSelector({
  currentSystemKey,
  referenceSystemKey,
  onCurrentSystemChange,
  onReferenceSystemChange,
}: Props) {
  const systemKeys = Object.keys(taxParameterPresets);

  return (
    <div className="flex items-center justify-center gap-4 p-4 rounded">
      <select
        value={referenceSystemKey}
        onChange={(e) => onReferenceSystemChange(e.target.value)}
        className="border border-gray-300 rounded px-3 py-2 w-72"
      >
        {systemKeys.map((key) => (
          <option key={key} value={key}>
            {taxParameterPresets[key].description}
          </option>
        ))}
      </select>

      <span className="text-lg font-bold text-gray-600">→</span>

      <select
        value={currentSystemKey}
        onChange={(e) => onCurrentSystemChange(e.target.value)}
        className="border border-gray-300 rounded px-3 py-2 w-72"
      >
        {systemKeys.map((key) => (
          <option key={key} value={key}>
            {taxParameterPresets[key].description}
          </option>
        ))}
      </select>
    </div>
  );
}
