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
  const timeText = timeframe === "annual" ? "eur/v" : "eur/kk";

  return (
    <div className="text-sm text-gray-700">
      Veroasteikon vertailu:{" "}
      <span className="font-bold">{referenceDescription}</span> vs.{" "}
      <span className="font-bold">{currentDescription}</span>. Kuvaaja{" "}
      {timeText}.
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
        <InputGroup title="Vertailujärjestelmä">
          <InputGroupItem label="Lähtötilanne">
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

        <InputGroup title="Nykyinen järjestelmä">
          <InputGroupItem label="Muutos">
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
          <InputGroupItem label="Tulot esitetään">
            <select
              value={timeframe}
              onChange={(e) =>
                onTimeframeChange(e.target.value as "annual" | "monthly")
              }
              className="text-xs border border-gray-300 rounded px-2 py-1 w-full"
            >
              <option value="annual">Vuosittain</option>
              <option value="monthly">Kuukausittain</option>
            </select>
          </InputGroupItem>
        </InputGroup>
      </div>
    </FoldoutPane>
  );
}
