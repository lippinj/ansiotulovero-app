import React, { useState } from "react";
import { TaxpayerCharacteristics } from "../tax/TaxpayerCharacteristics";
import { taxParameterPresets } from "../tax/TaxParameters";
import { TaxSystem } from "../tax/TaxSystem";
import { Panel } from "../base/components/Panel";
import { TaxRateChartConfig } from "./TaxRateChartConfig";
import { TaxSystemSelector } from "./TaxSystemSelector";
import { TaxRateChart } from "./TaxRateChart";
import { NetIncomeChangeChart } from "./NetIncomeChangeChart";

interface Props {
  demographics: TaxpayerCharacteristics;
  currentSystemKey: string;
  referenceSystemKey: string;
  onDemographicsChange: (
    field: keyof TaxpayerCharacteristics,
    value: any
  ) => void;
  onCurrentSystemChange: (systemKey: string) => void;
  onReferenceSystemChange: (systemKey: string) => void;
}

export function TaxRateChartPanel({
  demographics,
  currentSystemKey,
  referenceSystemKey,
  onDemographicsChange,
  onCurrentSystemChange,
  onReferenceSystemChange,
}: Props) {
  const [incomeType, setIncomeType] = useState<"work" | "pension">("work");
  const [timeframe, setTimeframe] = useState<"annual" | "monthly">("annual");

  const currentTaxSystem = new TaxSystem(
    taxParameterPresets[currentSystemKey].parameters
  );
  const referenceTaxSystem = new TaxSystem(
    taxParameterPresets[referenceSystemKey].parameters
  );

  return (
    <Panel expandable={false}>
      <div className="space-y-2">
        <TaxRateChartConfig
          demographics={demographics}
          incomeType={incomeType}
          onDemographicsChange={onDemographicsChange}
          onIncomeTypeChange={setIncomeType}
        />
        <TaxSystemSelector
          currentSystemKey={currentSystemKey}
          referenceSystemKey={referenceSystemKey}
          onCurrentSystemChange={onCurrentSystemChange}
          onReferenceSystemChange={onReferenceSystemChange}
          timeframe={timeframe}
          onTimeframeChange={setTimeframe}
        />

        <TaxRateChart
          demographics={demographics}
          currentTaxSystem={currentTaxSystem}
          referenceTaxSystem={referenceTaxSystem}
          incomeType={incomeType}
          timeframe={timeframe}
        />

        <NetIncomeChangeChart
          demographics={demographics}
          currentTaxSystem={currentTaxSystem}
          referenceTaxSystem={referenceTaxSystem}
          incomeType={incomeType}
          timeframe={timeframe}
        />
      </div>
    </Panel>
  );
}
