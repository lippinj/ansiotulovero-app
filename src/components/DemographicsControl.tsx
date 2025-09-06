import React, { useState } from "react";
import { TaxpayerCharacteristics } from "../tax/TaxpayerCharacteristics";
import { IncomeComponents } from "../tax/IncomeComponents";
import { InputTable, InputTableRow, InputTableContainer } from "./InputTable";
import { InlineInput } from "./InlineInput";
import { Panel } from "./Panel";

export interface UserInputs {
  demographics: TaxpayerCharacteristics;
  income: IncomeComponents;
}

export const defaultUserInputs: UserInputs = {
  demographics: {
    age: 35,
    isChurchMember: true,
    dependentChildren: 0,
    isSingleParent: false,
    isUnionMember: true,
    unionFeePercentage: 1.0,
  },
  income: new IncomeComponents(45000, 0, 0),
};

interface Props {
  inputs: UserInputs;
  onInputsChange: (inputs: UserInputs) => void;
}

export function DemographicsControl({ inputs, onInputsChange }: Props) {

  const handleDemographicsChange = (
    field: keyof TaxpayerCharacteristics,
    value: any
  ) => {
    onInputsChange({
      ...inputs,
      demographics: { ...inputs.demographics, [field]: value },
    });
  };

  const handleIncomeChange = (field: keyof IncomeComponents, value: number) => {
    const newIncome = new IncomeComponents(
      field === "workIncome" ? value : inputs.income.workIncome,
      field === "pensionIncome" ? value : inputs.income.pensionIncome,
      field === "otherEarnedIncome" ? value : inputs.income.otherEarnedIncome
    );
    onInputsChange({
      ...inputs,
      income: newIncome,
    });
  };

  return (
    <Panel 
      title="Henkilötiedot ja tulot"
      defaultExpanded={false}
    >
      <div className="space-y-4">
        <InputTableContainer>
          <InputTable title="Henkilötiedot">
            <InputTableRow label="Kuuluuko kirkkoon?">
              <label className="inline-flex items-center text-xs">
                <input
                  type="checkbox"
                  checked={inputs.demographics.isChurchMember}
                  onChange={(e) =>
                    handleDemographicsChange("isChurchMember", e.target.checked)
                  }
                  className="mr-1 scale-75"
                />
                Kyllä
              </label>
            </InputTableRow>
            <InputTableRow label="Ikä">
              <InlineInput
                value={inputs.demographics.age}
                onChange={(value) =>
                  handleDemographicsChange(
                    "age",
                    Math.max(0, Math.floor(value))
                  )
                }
                unit="v"
                step={1}
                width="w-16"
              />
            </InputTableRow>
            <InputTableRow label="Alaikäisiä huollettavia">
              <InlineInput
                value={inputs.demographics.dependentChildren}
                onChange={(value) =>
                  handleDemographicsChange(
                    "dependentChildren",
                    Math.max(0, Math.floor(value))
                  )
                }
                unit="kpl"
                step={1}
                width="w-16"
              />
            </InputTableRow>
            <InputTableRow label="Yksinhuoltaja">
              <label className="inline-flex items-center text-xs">
                <input
                  type="checkbox"
                  checked={inputs.demographics.isSingleParent}
                  onChange={(e) =>
                    handleDemographicsChange("isSingleParent", e.target.checked)
                  }
                  className="mr-1 scale-75"
                />
                Kyllä
              </label>
            </InputTableRow>
            <InputTableRow label="Kuuluuko ammattiliittoon?">
              <label className="inline-flex items-center text-xs">
                <input
                  type="checkbox"
                  checked={inputs.demographics.isUnionMember}
                  onChange={(e) =>
                    handleDemographicsChange("isUnionMember", e.target.checked)
                  }
                  className="mr-1 scale-75"
                />
                Kyllä
              </label>
            </InputTableRow>
            {inputs.demographics.isUnionMember && (
              <InputTableRow label="Liittomaksu">
                <InlineInput
                  value={inputs.demographics.unionFeePercentage}
                  onChange={(value) =>
                    handleDemographicsChange(
                      "unionFeePercentage",
                      Math.max(0, value)
                    )
                  }
                  unit="%"
                  step={0.1}
                  width="w-16"
                />
              </InputTableRow>
            )}
          </InputTable>

          <InputTable title="Vuositulot">
            <InputTableRow label="Ansiotulo">
              <InlineInput
                value={inputs.income.workIncome}
                onChange={(value) =>
                  handleIncomeChange("workIncome", Math.max(0, value))
                }
                unit="€"
                step={100}
                width="w-24"
              />
            </InputTableRow>
            <InputTableRow label="Eläketulo">
              <InlineInput
                value={inputs.income.pensionIncome}
                onChange={(value) =>
                  handleIncomeChange("pensionIncome", Math.max(0, value))
                }
                unit="€"
                step={100}
                width="w-24"
              />
            </InputTableRow>
            <InputTableRow label="Muu ansiotulo">
              <InlineInput
                value={inputs.income.otherEarnedIncome}
                onChange={(value) =>
                  handleIncomeChange("otherEarnedIncome", Math.max(0, value))
                }
                unit="€"
                step={100}
                width="w-24"
              />
            </InputTableRow>
          </InputTable>
        </InputTableContainer>

        <div className="p-2 bg-gray-50 rounded">
          <div className="text-xs text-gray-600">
            <strong>Ansiotulot yhteensä:</strong>{" "}
            {inputs.income.total.toLocaleString("fi-FI")} €
          </div>
        </div>
      </div>
    </Panel>
  );
}
