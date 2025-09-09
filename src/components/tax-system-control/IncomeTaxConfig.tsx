import React from "react";
import { TaxParameters, TaxBracket, taxParameterPresets } from "../../tax/TaxParameters";
import { InputTable, InputTableRow, InputTableContainer } from "../../base/components/InputTable";
import { TaxBracketEditor } from "../TaxBracketEditor";
import { InlineInput } from "../../base/components/InlineInput";
import { FoldoutPane } from "../../base/components/FoldoutPane";

interface Props {
  parameters: TaxParameters;
  onParametersChange: (field: keyof TaxParameters, value: number) => void;
  onBracketsChange: (brackets: TaxBracket[]) => void;
}

interface IncomeTaxSummaryProps {
  parameters: TaxParameters;
}

function IncomeTaxSummary({ parameters }: IncomeTaxSummaryProps) {
  let s = "";
  
  const brackets = parameters.stateIncomeTaxBrackets;
  const rateList = brackets.map(bracket => `${bracket.rate}%`).join(", ");
  
  s += `Valtion tulovero ${rateList}.`;
  
  s += ` Kunnallisvero ${parameters.municipalRate}%.`;
  
  s += ` Kirkollisvero ${parameters.churchRate}%.`;
  
  return <div className="text-sm text-gray-700">{s}</div>;
}

export function IncomeTaxConfig({ parameters, onParametersChange, onBracketsChange }: Props) {
  const FieldInlineInput = ({
    field,
    unit = "%",
    step = 0.01,
    width = "w-16",
  }: {
    field: keyof TaxParameters;
    unit?: string;
    step?: number;
    width?: string;
  }) => (
    <InlineInput
      value={parameters[field] as number}
      onChange={(value) => onParametersChange(field, value)}
      unit={unit}
      step={step}
      width={width}
    />
  );

  const resetStateIncomeTaxTo2025 = () => {
    onBracketsChange(taxParameterPresets["2025"].parameters.stateIncomeTaxBrackets);
  };

  const resetStateIncomeTaxTo2026 = () => {
    onBracketsChange(taxParameterPresets["2026_he"].parameters.stateIncomeTaxBrackets);
  };

  return (
    <FoldoutPane groupId="income-taxes" toggleText="muokkaa" toggleTitle="Muokkaa tuloveroja">
      <IncomeTaxSummary parameters={parameters} />
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-semibold text-gray-700">
              Valtion tulovero
            </h3>
            <div className="space-x-1">
              <button
                onClick={resetStateIncomeTaxTo2025}
                className="text-xs bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
              >
                2025
              </button>
              <button
                onClick={resetStateIncomeTaxTo2026}
                className="text-xs bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
              >
                2026
              </button>
            </div>
          </div>
          <TaxBracketEditor
            brackets={parameters.stateIncomeTaxBrackets}
            onBracketsChange={onBracketsChange}
          />
        </div>

        <InputTableContainer className="space-y-4">
          <InputTable title="Kunnallisvero">
            <InputTableRow label="Veroaste">
              <FieldInlineInput field="municipalRate" />
            </InputTableRow>
          </InputTable>

          <InputTable title="Kirkollisvero">
            <InputTableRow label="Veroaste">
              <FieldInlineInput field="churchRate" />
            </InputTableRow>
          </InputTable>
        </InputTableContainer>
      </div>
    </FoldoutPane>
  );
}