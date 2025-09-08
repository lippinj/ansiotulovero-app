import React, { useState } from "react";
import { TaxSystemControl } from "./components/TaxSystemControl";
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

        <div className="space-y-8">
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
        </div>
      </div>
    </div>
  );
}
