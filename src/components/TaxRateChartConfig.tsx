import React from "react";
import { TaxpayerCharacteristics } from "../tax/TaxpayerCharacteristics";
import { InlineInput } from "../base/components/InlineInput";
import { InputGroup, InputGroupItem } from "../base/components/InputGroup";
import { FoldoutPane } from "../base/components/FoldoutPane";

interface Props {
  demographics: TaxpayerCharacteristics;
  incomeType: "work" | "pension";
  onDemographicsChange: (
    field: keyof TaxpayerCharacteristics,
    value: any
  ) => void;
  onIncomeTypeChange: (incomeType: "work" | "pension") => void;
}

interface ConfigSummaryProps {
  demographics: TaxpayerCharacteristics;
  incomeType: "work" | "pension";
}

function ConfigSummary({ demographics, incomeType }: ConfigSummaryProps) {
  const getSummaryText = () => {
    let text = "";
    text += `${demographics.age}v `;
    text += incomeType === "work" ? "palkansaaja" : "eläkkeensaaja";
    text += demographics.isChurchMember
      ? ", kuuluu kirkkoon"
      : ", ei kuulu kirkkoon";

    if (demographics.dependentChildren > 0) {
      text += `, ${demographics.dependentChildren} lapsen`;
      if (demographics.isSingleParent) {
        text += " yksinhuoltaja";
      } else {
        text += " huoltaja";
      }
    } else {
      text += ", ei huollettavia";
    }

    if (demographics.isUnionMember) {
      text += `, ammattiliiton jäsenmaksu ${demographics.unionFeePercentage}%`;
    } else {
      text += ", ei kuulu liittoon";
    }

    return text;
  };

  return <div className="text-sm text-gray-700">{getSummaryText()}</div>;
}

export function TaxRateChartConfig({
  demographics,
  incomeType,
  onDemographicsChange,
  onIncomeTypeChange,
}: Props) {
  return (
    <FoldoutPane toggleTitle="Muokkaa asetuksia">
      <ConfigSummary demographics={demographics} incomeType={incomeType} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <InputGroup title="Perustiedot">
          <InputGroupItem label="Verovelvollinen">
            <select
              value={incomeType}
              onChange={(e) =>
                onIncomeTypeChange(e.target.value as "work" | "pension")
              }
              className="text-xs border border-gray-300 rounded px-2 py-1 w-48"
            >
              <option value="work">Palkansaaja</option>
              <option value="pension">Eläkkeensaaja</option>
            </select>
          </InputGroupItem>
          <InputGroupItem label="Ikä">
            <InlineInput
              value={demographics.age}
              onChange={(value) =>
                onDemographicsChange("age", Math.max(0, Math.floor(value)))
              }
              unit="v"
              step={1}
              width="w-16"
            />
          </InputGroupItem>
          <InputGroupItem label="Kuuluuko kirkkoon?">
            <label className="inline-flex items-center text-xs">
              <input
                type="checkbox"
                checked={demographics.isChurchMember}
                onChange={(e) =>
                  onDemographicsChange("isChurchMember", e.target.checked)
                }
                className="mr-1 scale-75"
              />
              Kyllä
            </label>
          </InputGroupItem>
        </InputGroup>

        <InputGroup title="Perhe">
          <InputGroupItem label="Alaikäisiä huollettavia">
            <InlineInput
              value={demographics.dependentChildren}
              onChange={(value) =>
                onDemographicsChange(
                  "dependentChildren",
                  Math.max(0, Math.floor(value))
                )
              }
              unit="kpl"
              step={1}
              width="w-16"
            />
          </InputGroupItem>
          <InputGroupItem label="Yksinhuoltaja?">
            <label className="inline-flex items-center text-xs">
              <input
                type="checkbox"
                checked={demographics.isSingleParent}
                onChange={(e) =>
                  onDemographicsChange("isSingleParent", e.target.checked)
                }
                className="mr-1 scale-75"
              />
              Kyllä
            </label>
          </InputGroupItem>
        </InputGroup>

        <InputGroup title="Ammattiliitto">
          <InputGroupItem label="Onko ammattiliiton jäsen?">
            <label className="inline-flex items-center text-xs">
              <input
                type="checkbox"
                checked={demographics.isUnionMember}
                onChange={(e) =>
                  onDemographicsChange("isUnionMember", e.target.checked)
                }
                className="mr-1 scale-75"
              />
              Kyllä
            </label>
          </InputGroupItem>
          {demographics.isUnionMember && (
            <InputGroupItem label="Jäsenmaksu työtulosta">
              <InlineInput
                value={demographics.unionFeePercentage}
                onChange={(value) =>
                  onDemographicsChange(
                    "unionFeePercentage",
                    Math.max(0, value)
                  )
                }
                unit="%"
                step={0.1}
                width="w-16"
              />
            </InputGroupItem>
          )}
        </InputGroup>
      </div>
    </FoldoutPane>
  );
}
