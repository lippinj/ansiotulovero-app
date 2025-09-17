import { TaxParameters, TaxBracket } from "../../tax/TaxParameters";
import { Panel } from "base";
import { FoldoutPaneGroup } from "base";
import { ContributionsConfig } from "./ContributionsConfig";
import { IncomeTaxConfig } from "./IncomeTaxConfig";
import { OtherTaxesConfig } from "./OtherTaxesConfig";
import { DeductionsConfig } from "./DeductionsConfig";

interface Props {
  title?: string;
  parameters: TaxParameters;
  onParametersChange: (parameters: TaxParameters) => void;
}

export function TaxSystemControl({
  title = "Verojärjestelmän parametrit",
  parameters,
  onParametersChange,
}: Props) {
  const handleChange = (
    field: keyof TaxParameters,
    value: number | boolean
  ) => {
    onParametersChange({ ...parameters, [field]: value });
  };

  const handleBracketsChange = (brackets: TaxBracket[]) => {
    onParametersChange({ ...parameters, stateIncomeTaxBrackets: brackets });
  };

  return (
    <Panel title={title} defaultExpanded={false}>
      <div className="space-y-2">
        <FoldoutPaneGroup>
          <ContributionsConfig
            parameters={parameters}
            onParametersChange={handleChange}
          />

          <IncomeTaxConfig
            parameters={parameters}
            onParametersChange={handleChange}
            onBracketsChange={handleBracketsChange}
          />

          <OtherTaxesConfig
            parameters={parameters}
            onParametersChange={handleChange}
          />

          <DeductionsConfig
            parameters={parameters}
            onParametersChange={handleChange}
          />
        </FoldoutPaneGroup>
      </div>
    </Panel>
  );
}
