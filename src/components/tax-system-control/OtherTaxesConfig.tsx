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
  onParametersChange: (field: keyof TaxParameters, value: number) => void;
}

interface OtherTaxesSummaryProps {
  parameters: TaxParameters;
}

function OtherTaxesSummary({ parameters }: OtherTaxesSummaryProps) {
  const radioText =
    parameters.radioMaxTax > 0
      ? `${parameters.radioRate}% (max ${parameters.radioMaxTax}€)`
      : "ei käytössä";

  return (
    <div className="text-sm text-gray-700">
      Sairaanhoito:{" "}
      <span className="font-bold">{parameters.healthWorkRate}%</span> /
      <span className="font-bold">{parameters.healthOtherRate}%</span>.
      Yleisradio: <span className="font-bold">{radioText}</span>. Eläkelisävero:{" "}
      <span className="font-bold">{parameters.pensionAdditionalRate}%</span>.
    </div>
  );
}

export function OtherTaxesConfig({ parameters, onParametersChange }: Props) {
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
      groupId="other-taxes"
      toggleText="muokkaa"
      toggleTitle="Muokkaa muita veroja ja maksuja"
    >
      <OtherTaxesSummary parameters={parameters} />
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
  );
}
