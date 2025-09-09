import React from "react";
import { taxParameterPresets } from "../tax/TaxParameters";
import { FoldoutPane } from "../base/components/FoldoutPane";
import { InputGroup, InputGroupItem } from "../base/components/InputGroup";

interface Props {
  currentSystemKey: string;
  referenceSystemKey: string;
  onCurrentSystemChange: (systemKey: string) => void;
  onReferenceSystemChange: (systemKey: string) => void;
  timeframe: "annual" | "monthly";
  onTimeframeChange: (timeframe: "annual" | "monthly") => void;
}

interface SelectorSummaryProps {
  currentSystemKey: string;
  referenceSystemKey: string;
  timeframe: "annual" | "monthly";
}

function SelectorSummary({
  currentSystemKey,
  referenceSystemKey,
  timeframe,
}: SelectorSummaryProps) {
  const currentDescription = taxParameterPresets[currentSystemKey].description;
  const referenceDescription =
    taxParameterPresets[referenceSystemKey].description;
  const timeText = timeframe === "annual" ? "vuosi" : "kuukausi";

  return (
    <div className="text-sm text-gray-700">
      Katkoviiva: <span className="font-bold">{referenceDescription}</span>.
      Kiinteä viiva: <span className="font-bold">{currentDescription}</span>.
      Aikayksikkö: {timeText}.
    </div>
  );
}

export function TaxSystemSelector({
  currentSystemKey,
  referenceSystemKey,
  onCurrentSystemChange,
  onReferenceSystemChange,
  timeframe,
  onTimeframeChange,
}: Props) {
  const systemKeys = Object.keys(taxParameterPresets);

  return (
    <FoldoutPane toggleTitle="Muokkaa verojärjestelmää ja aikaväliä">
      <SelectorSummary
        currentSystemKey={currentSystemKey}
        referenceSystemKey={referenceSystemKey}
        timeframe={timeframe}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InputGroup title="Katkoviiva">
          <InputGroupItem label="Vertailun pohjana oleva järjestelmä">
            <select
              value={referenceSystemKey}
              onChange={(e) => onReferenceSystemChange(e.target.value)}
              className="text-xs border border-gray-300 rounded px-2 py-1 w-full"
            >
              {systemKeys.map((key) => (
                <option key={key} value={key}>
                  {taxParameterPresets[key].description}
                </option>
              ))}
            </select>
          </InputGroupItem>
        </InputGroup>

        <InputGroup title="Kiinteä viiva">
          <InputGroupItem label="Vaihtoehtoinen (uusi) järjestelmä">
            <select
              value={currentSystemKey}
              onChange={(e) => onCurrentSystemChange(e.target.value)}
              className="text-xs border border-gray-300 rounded px-2 py-1 w-full"
            >
              {systemKeys.map((key) => (
                <option key={key} value={key}>
                  {taxParameterPresets[key].description}
                </option>
              ))}
            </select>
          </InputGroupItem>
        </InputGroup>

        <InputGroup title="Aikaväli">
          <InputGroupItem label="Esityksen aikayksikkö">
            <select
              value={timeframe}
              onChange={(e) =>
                onTimeframeChange(e.target.value as "annual" | "monthly")
              }
              className="text-xs border border-gray-300 rounded px-2 py-1 w-full"
            >
              <option value="annual">Vuosi</option>
              <option value="monthly">Kuukausi</option>
            </select>
          </InputGroupItem>
        </InputGroup>
      </div>
    </FoldoutPane>
  );
}
