import { TaxParameters } from "../../tax/TaxParameters";
import {
  InputTable,
  InputTableRow,
  InputTableContainer,
} from "../../base/components/InputTable";
import { InlineInput } from "../../base/components/InlineInput";
import { FoldoutPane } from "../../base/components/FoldoutPane";

interface Props {
  parameters: TaxParameters;
  onParametersChange: (
    field: keyof TaxParameters,
    value: number | boolean
  ) => void;
}

interface DeductionsSummaryProps {
  parameters: TaxParameters;
}

function DeductionsSummary({ parameters }: DeductionsSummaryProps) {
  let s = "";

  s += `Tulonhankkimisvähennys ${parameters.naturalDeductionMin} €.`;

  if (parameters.pensionDeductionBase > 0) {
    s += ` Eläketulovähennys ${parameters.pensionDeductionBase} € (vähenee ${parameters.pensionDeductionReductionRate}%).`;
  }

  s += ` Perusvähennys ${parameters.basicDeductionBase} € (vähenee ${parameters.basicDeductionReductionRate}%).`;

  if (parameters.earnedIncomeDeduction > 0) {
    s += ` Ansiotulovähennys ${parameters.earnedIncomeDeduction} €.`;
  }

  if (parameters.workDeductionEnabled) {
    s += ` Työtulovähennys ${parameters.workDeductionRate}% (max ${parameters.workDeductionStandardMax} €).`;
  } else {
    s += " Työtulovähennys ei käytössä.";
  }

  if (parameters.unionFeeDeductible) {
    s += " Liittomaksu vähennetään.";
  } else {
    s += " Liittomaksu ei vähennetä.";
  }

  return <div className="text-sm text-gray-700">{s}</div>;
}

export function DeductionsConfig({ parameters, onParametersChange }: Props) {
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

  return (
    <FoldoutPane
      groupId="deductions"
      toggleText="muokkaa"
      toggleTitle="Muokkaa vähennyksiä"
    >
      <DeductionsSummary parameters={parameters} />
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
                  onParametersChange("workDeductionEnabled", e.target.checked)
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
                  onParametersChange("unionFeeDeductible", e.target.checked)
                }
                className="mr-1 scale-75"
              />
              Kyllä
            </label>
          </InputTableRow>
        </InputTable>
      </InputTableContainer>
    </FoldoutPane>
  );
}
