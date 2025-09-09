import React from "react";
import { TaxParameters, taxParameterPresets } from "../tax/TaxParameters";
import { TaxBracket } from "../tax/TaxParameters";
import { InputTable, InputTableRow, InputTableContainer } from "../base/components/InputTable";
import { TaxBracketEditor } from "./TaxBracketEditor";
import { InlineInput } from "../base/components/InlineInput";
import { Panel } from "../base/components/Panel";
import { FoldoutPane } from "../base/components/FoldoutPane";
import { FoldoutPaneGroup } from "../base/components/FoldoutPaneGroup";

interface Props {
  title?: string;
  parameters: TaxParameters;
  onParametersChange: (parameters: TaxParameters) => void;
}

export function TaxSystemControl({ 
  title = "Verojärjestelmän parametrit", 
  parameters, 
  onParametersChange 
}: Props) {
  const handleChange = (field: keyof TaxParameters, value: number | boolean) => {
    onParametersChange({ ...parameters, [field]: value });
  };

  const handleBracketsChange = (brackets: TaxBracket[]) => {
    onParametersChange({ ...parameters, stateIncomeTaxBrackets: brackets });
  };

  const resetStateIncomeTaxTo2025 = () => {
    handleBracketsChange(taxParameterPresets["2025"].parameters.stateIncomeTaxBrackets);
  };

  const resetStateIncomeTaxTo2026 = () => {
    handleBracketsChange(taxParameterPresets["2026_he"].parameters.stateIncomeTaxBrackets);
  };

  // Wrapper for InlineInput to work with field-based parameters
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
      onChange={(value) => handleChange(field, value)}
      unit={unit}
      step={step}
      width={width}
    />
  );

  return (
    <Panel title={title} defaultExpanded={false}>
      <div className="space-y-2">
        <FoldoutPaneGroup>
        {/* Pension and Insurance Contributions */}
        <FoldoutPane groupId="contributions" toggleText="näytä" toggleTitle="Näytä työeläke- ja vakuutusmaksut">
          <div className="text-sm font-medium text-gray-900 mb-4">
            Työeläke- ja vakuutusmaksut
          </div>
          <InputTableContainer className="space-y-4">
            <InputTable title="Työeläkemaksu">
              <InputTableRow label="Normaali (alle 53v)">
                <FieldInlineInput field="pensionStandardRate" />
              </InputTableRow>
              <InputTableRow label="53–62 -vuotiaat">
                <FieldInlineInput field="pensionSeniorRate" />
              </InputTableRow>
            </InputTable>

            <InputTable title="Työttömyysvakuutusmaksu">
              <InputTableRow label="18–63 -vuotiaat">
                <FieldInlineInput field="unemploymentRate" />
              </InputTableRow>
            </InputTable>

            <InputTable title="Sairausvakuutuksen päivärahamaksu">
              <InputTableRow label="16–68 -vuotiaat">
                <FieldInlineInput field="illnessRate" />
              </InputTableRow>
              <InputTableRow label="Alaraja">
                <FieldInlineInput
                  field="illnessThreshold"
                  unit="€"
                  step={100}
                  width="w-20"
                />
              </InputTableRow>
            </InputTable>
          </InputTableContainer>
        </FoldoutPane>

        {/* Income Taxes */}
        <FoldoutPane groupId="income-taxes" toggleText="näytä" toggleTitle="Näytä tuloverot">
          <div className="text-sm font-medium text-gray-900 mb-4">
            Tuloverot
          </div>
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
                onBracketsChange={handleBracketsChange}
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

        {/* Other Taxes */}
        <FoldoutPane groupId="other-taxes" toggleText="näytä" toggleTitle="Näytä muut verot ja maksut">
          <div className="text-sm font-medium text-gray-900 mb-4">
            Muut verot ja maksut
          </div>
          <InputTableContainer className="space-y-4">
            <InputTable title="Sairausvakuutuksen sairaanhoitomaksu">
              <InputTableRow label="Ansiotulot">
                <FieldInlineInput field="healthWorkRate" />
              </InputTableRow>
              <InputTableRow label="Eläke- ja etuustulot">
                <FieldInlineInput field="healthOtherRate" />
              </InputTableRow>
            </InputTable>

            <InputTable title="Yleisradiovero">
              <InputTableRow label="Veroaste">
                <FieldInlineInput field="radioRate" />
              </InputTableRow>
              <InputTableRow label="Alaraja">
                <FieldInlineInput
                  field="radioThreshold"
                  unit="€"
                  step={100}
                  width="w-20"
                />
              </InputTableRow>
              <InputTableRow label="Enimmäismäärä">
                <FieldInlineInput
                  field="radioMaxTax"
                  unit="€"
                  step={1}
                  width="w-16"
                />
              </InputTableRow>
            </InputTable>

            <InputTable title="Eläketulon lisävero">
              <InputTableRow label="Veroaste">
                <FieldInlineInput field="pensionAdditionalRate" />
              </InputTableRow>
              <InputTableRow label="Alaraja">
                <FieldInlineInput
                  field="pensionAdditionalThreshold"
                  unit="€"
                  step={1000}
                  width="w-20"
                />
              </InputTableRow>
            </InputTable>
          </InputTableContainer>
        </FoldoutPane>

        {/* Deductions */}
        <FoldoutPane groupId="deductions" toggleText="näytä" toggleTitle="Näytä vähennykset">
          <div className="text-sm font-medium text-gray-900 mb-4">
            Vähennykset
          </div>
          <InputTableContainer className="space-y-4">
            <InputTable title="Tulonhankkimisvähennys">
              <InputTableRow label="Vähimmäismäärä">
                <FieldInlineInput
                  field="naturalDeductionMin"
                  unit="€"
                  step={10}
                  width="w-16"
                />
              </InputTableRow>
            </InputTable>

            <InputTable title="Eläketulovähennys">
              <InputTableRow label="Perusmäärä">
                <FieldInlineInput
                  field="pensionDeductionBase"
                  unit="€"
                  step={100}
                  width="w-20"
                />
              </InputTableRow>
              <InputTableRow label="Vähenemisprosentti">
                <FieldInlineInput
                  field="pensionDeductionReductionRate"
                  width="w-16"
                />
              </InputTableRow>
            </InputTable>

            <InputTable title="Perusvähennys">
              <InputTableRow label="Perusmäärä">
                <FieldInlineInput
                  field="basicDeductionBase"
                  unit="€"
                  step={100}
                  width="w-20"
                />
              </InputTableRow>
              <InputTableRow label="Vähenemisprosentti">
                <FieldInlineInput
                  field="basicDeductionReductionRate"
                  width="w-16"
                />
              </InputTableRow>
            </InputTable>

            <InputTable title="Ansiotulovähennys">
              <InputTableRow label="Kiinteä määrä">
                <FieldInlineInput
                  field="earnedIncomeDeduction"
                  unit="€"
                  step={100}
                  width="w-20"
                />
              </InputTableRow>
            </InputTable>

            <InputTable title="Työtulovähennys">
              <InputTableRow label="Käytössä">
                <label className="inline-flex items-center text-xs">
                  <input
                    type="checkbox"
                    checked={parameters.workDeductionEnabled}
                    onChange={(e) =>
                      handleChange("workDeductionEnabled", e.target.checked)
                    }
                    className="mr-1 scale-75"
                  />
                  Kyllä
                </label>
              </InputTableRow>
              {parameters.workDeductionEnabled && (
                <>
                  <InputTableRow label="Perusprosentti">
                    <FieldInlineInput field="workDeductionRate" width="w-16" />
                  </InputTableRow>
                  <InputTableRow label="Enimmäismäärä (alle 65v)">
                    <FieldInlineInput
                      field="workDeductionStandardMax"
                      unit="€"
                      step={100}
                      width="w-20"
                    />
                  </InputTableRow>
                  <InputTableRow label="Enimmäismäärä (65v täyttäneet)">
                    <FieldInlineInput
                      field="workDeductionSeniorMax"
                      unit="€"
                      step={100}
                      width="w-20"
                    />
                  </InputTableRow>
                  <InputTableRow label="Lapsikorotus">
                    <FieldInlineInput
                      field="workDeductionChildBonus"
                      unit="€"
                      step={10}
                      width="w-16"
                    />
                  </InputTableRow>
                  <InputTableRow label="Leikkuri 1 (%)">
                    <FieldInlineInput
                      field="workDeductionReductionRate1"
                      width="w-14"
                      step={0.01}
                    />
                    &nbsp;&nbsp;&nbsp;&nbsp; yli &nbsp;&nbsp;&nbsp;&nbsp;
                    <FieldInlineInput
                      field="workDeductionReductionThreshold1"
                      unit="€"
                      step={100}
                      width="w-20"
                    />
                  </InputTableRow>
                  <InputTableRow label="Leikkuri 2 (%)">
                    <FieldInlineInput
                      field="workDeductionReductionRate2"
                      width="w-14"
                      step={0.01}
                    />
                    &nbsp;&nbsp;&nbsp;&nbsp; yli &nbsp;&nbsp;&nbsp;&nbsp;
                    <FieldInlineInput
                      field="workDeductionReductionThreshold2"
                      unit="€"
                      step={100}
                      width="w-20"
                    />
                  </InputTableRow>
                </>
              )}
            </InputTable>

            <InputTable title="Ammattiliiton jäsenmaksu">
              <InputTableRow label="Vähennyskelpoinen">
                <label className="inline-flex items-center text-xs">
                  <input
                    type="checkbox"
                    checked={parameters.unionFeeDeductible}
                    onChange={(e) =>
                      handleChange("unionFeeDeductible", e.target.checked)
                    }
                    className="mr-1 scale-75"
                  />
                  Kyllä
                </label>
              </InputTableRow>
            </InputTable>
          </InputTableContainer>
        </FoldoutPane>
        </FoldoutPaneGroup>
      </div>
    </Panel>
  );
}