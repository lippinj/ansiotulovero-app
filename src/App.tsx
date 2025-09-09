import React, { useState } from "react";
import { TaxSystemControl } from "./components/tax-system-control/TaxSystemControl";
import { taxParameterPresets } from "./tax/TaxParameters";
import {
  UserInputs,
  defaultUserInputs,
} from "./components/DemographicsControl";
import { TaxRateChartPanel } from "./components/TaxRateChartPanel";
import { PageTitle } from "./base/components/PageTitle";

export default function App() {
  const [referenceSystemKey, setReferenceSystemKey] =
    useState<string>("2026_base");
  const [currentSystemKey, setCurrentSystemKey] = useState<string>("2026_he");

  const currentParameters = taxParameterPresets[currentSystemKey].parameters;
  const referenceParameters =
    taxParameterPresets[referenceSystemKey].parameters;
  const [inputs, setInputs] = useState<UserInputs>(defaultUserInputs);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <PageTitle>Ansiotuloveron asteikko</PageTitle>

        <div className="space-y-4">
          <TaxRateChartPanel
            demographics={inputs.demographics}
            currentSystemKey={currentSystemKey}
            referenceSystemKey={referenceSystemKey}
            onDemographicsChange={(field, value) => {
              setInputs({
                ...inputs,
                demographics: { ...inputs.demographics, [field]: value },
              });
            }}
            onCurrentSystemChange={setCurrentSystemKey}
            onReferenceSystemChange={setReferenceSystemKey}
          />

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 items-start">
            <TaxSystemControl
              title={`Parametrit, ${taxParameterPresets[referenceSystemKey].description}`}
              parameters={referenceParameters}
              onParametersChange={(params) => {
                taxParameterPresets[referenceSystemKey] = {
                  ...taxParameterPresets[referenceSystemKey],
                  parameters: params,
                };
              }}
            />

            <TaxSystemControl
              title={`Parametrit, ${taxParameterPresets[currentSystemKey].description}`}
              parameters={currentParameters}
              onParametersChange={(params) => {
                taxParameterPresets[currentSystemKey] = {
                  ...taxParameterPresets[currentSystemKey],
                  parameters: params,
                };
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
