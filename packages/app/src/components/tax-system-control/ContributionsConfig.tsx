import { TaxParameters } from "../../tax/TaxParameters";
import {
  InputTable,
  InputTableRow,
  InputTableContainer,
} from "base";
import { InlineInput } from "base";
import { FoldoutPane } from "base";

interface Props {
  parameters: TaxParameters;
  onParametersChange: (field: keyof TaxParameters, value: number) => void;
}

interface ContributionsSummaryProps {
  parameters: TaxParameters;
}

function ContributionsSummary({ parameters }: ContributionsSummaryProps) {
  let s = "";

  s += `TyEL ${parameters.pensionStandardRate}%`;
  if (parameters.pensionSeniorRate != parameters.pensionStandardRate) {
    s += ` (${parameters.pensionSeniorRate}%)`;
  }
  s += ".";

  s += ` TVM ${parameters.unemploymentRate}%.`;

  s += ` Sv. päivärahamaksu ${parameters.illnessRate}%`;
  if (parameters.illnessThreshold > 0) {
    s += ` jos työtulo ylittää ${parameters.illnessThreshold.toLocaleString("FI-fi")} €`;
  }
  s += ".";

  return <div className="text-sm text-gray-700">{s}</div>;
}

export function ContributionsConfig({ parameters, onParametersChange }: Props) {
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
      groupId="contributions"
      toggleText="muokkaa"
      toggleTitle="Muokkaa työeläke- ja vakuutusmaksuja"
    >
      <ContributionsSummary parameters={parameters} />
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
  );
}
