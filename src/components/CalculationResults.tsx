import React, { useState } from "react";
import { TaxpayerCharacteristics } from "../tax/TaxpayerCharacteristics";
import { IncomeComponents } from "../tax/IncomeComponents";
import { TaxParameters } from "../tax/TaxParameters";
import { TaxSystem } from "../tax/TaxSystem";
import { Panel } from "./Panel";

interface Props {
  title?: string;
  demographics: TaxpayerCharacteristics;
  income: IncomeComponents;
  parameters: TaxParameters;
}

export function CalculationResults({
  title = "Laskelman tulokset",
  demographics,
  income,
  parameters,
}: Props) {
  
  const taxSystem = new TaxSystem(parameters);
  const result = taxSystem.calculate(demographics, income);

  const formatCurrency = (amount: number) =>
    amount.toLocaleString("fi-FI", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

  const formatPercentage = (rate: number) => rate.toFixed(2) + " %";

  const negativeOrZero = (amount: number) => (amount > 0 ? -amount : 0);

  const ResultRow = ({
    label,
    amount,
    isTotal = false,
  }: {
    label: string;
    amount: number;
    isTotal?: boolean;
  }) => (
    <div
      className={`flex justify-between py-2 ${isTotal ? "font-bold border-t border-gray-200" : ""}`}
    >
      <span>{label}</span>
      <span>{formatCurrency(amount)}</span>
    </div>
  );

  return (
    <Panel 
      title={title}
      defaultExpanded={false}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Tulot ja vähennykset
            </h3>
            <ResultRow
              label="Ansiotulo yhteensä"
              amount={result.totalEarnedIncome}
            />
            <ResultRow
              label="Tulonhankkimisvähennys"
              amount={negativeOrZero(result.deductions.natural)}
            />
            <ResultRow
              label="Työeläkemaksu"
              amount={negativeOrZero(result.taxlikeContributions.pension)}
            />
            <ResultRow
              label="Työttömyysvakuutusmaksu"
              amount={negativeOrZero(result.taxlikeContributions.unemployment)}
            />
            <ResultRow
              label="Sairausvakuutusmaksu"
              amount={negativeOrZero(result.taxlikeContributions.illness)}
            />
            <ResultRow
              label="Eläketulovähennys"
              amount={negativeOrZero(result.deductions.pensionIncome)}
            />
            <ResultRow
              label="Perusvähennys"
              amount={negativeOrZero(result.deductions.basic)}
            />
            <ResultRow
              label="Veronalainen ansiotulo"
              amount={result.taxableEarnedIncome}
              isTotal
            />
          </div>

          <div className="bg-gray-50 p-4 rounded">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Verot</h3>
            <ResultRow
              label="Valtion tulovero"
              amount={result.taxes.stateIncome}
            />
            <ResultRow label="Kunnallisvero" amount={result.taxes.municipal} />
            {result.taxes.church > 0 && (
              <ResultRow label="Kirkollisvero" amount={result.taxes.church} />
            )}
            <ResultRow
              label="Sairaanhoitomaksu"
              amount={result.taxes.healthInsurance}
            />
            <ResultRow
              label="Työtulovähennys"
              amount={negativeOrZero(result.workIncomeDeduction)}
            />
            {result.taxes.radio > 0 && (
              <ResultRow label="Yle-maksu" amount={result.taxes.radio} />
            )}
            {result.taxes.additionalPension > 0 && (
              <ResultRow
                label="Eläketulon lisävero"
                amount={result.taxes.additionalPension}
              />
            )}
            <ResultRow
              label="Verot yhteensä"
              amount={result.taxes.total}
              isTotal
            />
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            Yhteenveto
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <ResultRow
              label="Verot ja maksut yhteensä"
              amount={result.totalTaxBurden}
            />
            <ResultRow label="Nettotulo" amount={result.netIncome} />
            <div className="flex justify-between py-2">
              <span>Kokonaisveroaste</span>
              <span className="font-semibold">
                {formatPercentage(result.effectiveTaxRate)}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span>Marginaaliveroaste</span>
              <span className="font-semibold">
                {formatPercentage(result.marginalTaxRate)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Panel>
  );
}
