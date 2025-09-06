import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TaxpayerCharacteristics } from "../tax/TaxpayerCharacteristics";
import { IncomeComponents } from "../tax/IncomeComponents";
import { TaxSystem } from "../tax/TaxSystem";

interface Props {
  demographics: TaxpayerCharacteristics;
  currentTaxSystem: TaxSystem;
  referenceTaxSystem: TaxSystem;
  incomeType: "work" | "pension";
}

interface ChartDataPoint {
  income: number;
  currentEffectiveTaxRate: number;
  currentMarginalTaxRate: number;
  referenceEffectiveTaxRate: number;
  referenceMarginalTaxRate: number;
}

export function TaxRateChart({
  demographics,
  currentTaxSystem,
  referenceTaxSystem,
  incomeType,
}: Props) {
  const chartData = useMemo(() => {
    const data: ChartDataPoint[] = [];

    // Generate data points from 0 to 180,000 in steps of 120
    for (let income = 0; income <= 180000; income += 120) {
      const incomeComponents =
        incomeType === "work"
          ? new IncomeComponents(income, 0, 0)
          : new IncomeComponents(0, income, 0);
      const currentResult = currentTaxSystem.calculate(
        demographics,
        incomeComponents
      );
      const referenceResult = referenceTaxSystem.calculate(
        demographics,
        incomeComponents
      );

      data.push({
        income,
        currentEffectiveTaxRate: currentResult.effectiveTaxRate,
        currentMarginalTaxRate: currentResult.marginalTaxRate,
        referenceEffectiveTaxRate: referenceResult.effectiveTaxRate,
        referenceMarginalTaxRate: referenceResult.marginalTaxRate,
      });
    }

    return data;
  }, [demographics, currentTaxSystem, referenceTaxSystem, incomeType]);

  const xAxisTicks = useMemo(() => {
    const ticks = [];
    for (let i = 0; i <= 180000; i += 10000) {
      ticks.push(i);
    }
    return ticks;
  }, []);

  const formatTooltip = (value: number, name: string) => {
    if (name === "income") {
      return [`${value.toLocaleString("fi-FI")} €`, "Ansiotulo"];
    }
    const nameMap: Record<string, string> = {
      currentEffectiveTaxRate: "Uusi kokonaisveroaste",
      currentMarginalTaxRate: "Uusi marginaaliveroaste",
      referenceEffectiveTaxRate: "Vertailu kokonaisveroaste",
      referenceMarginalTaxRate: "Vertailu marginaaliveroaste",
    };
    return [`${value.toFixed(2)} %`, nameMap[name] || name];
  };

  const formatXAxisTick = (value: number) => {
    return `${(value / 1000).toFixed(0)}k`;
  };

  return (
    <div className="h-128">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 30,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="income"
            tickFormatter={formatXAxisTick}
            domain={[0, 180000]}
            ticks={xAxisTicks}
            label={{
              value: "Ansiotulot yhteensä",
              position: "insideBottom",
              offset: -10,
            }}
          />
          <YAxis
            domain={[0, 60]}
            tickFormatter={(value) => `${value}%`}
            ticks={[0, 10, 20, 30, 40, 50, 60]}
          />
          <Tooltip
            formatter={formatTooltip}
            labelFormatter={(value) =>
              `Ansiotulo: ${Number(value).toLocaleString("fi-FI")} €`
            }
          />
          <Legend verticalAlign="top" height={36} />
          <Line
            type="monotone"
            dataKey="currentMarginalTaxRate"
            stroke="firebrick"
            strokeWidth={2}
            dot={false}
            legendType="plainline"
            name="Rajaveroaste"
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="referenceMarginalTaxRate"
            stroke="firebrick"
            strokeWidth={2}
            strokeOpacity={0.5}
            strokeDasharray="3 3"
            dot={false}
            legendType="none"
            name="Rajaveroaste"
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="currentEffectiveTaxRate"
            stroke="navy"
            strokeWidth={2}
            dot={false}
            legendType="plainline"
            name="Keskimääräinen veroaste"
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="referenceEffectiveTaxRate"
            stroke="navy"
            strokeWidth={2}
            strokeOpacity={0.5}
            strokeDasharray="3 3"
            dot={false}
            legendType="none"
            name="Kokonaisveroaste"
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
