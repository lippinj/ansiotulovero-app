import React, { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
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
  netIncomeChange: number;
}

export function NetIncomeChangeChart({
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

      const netIncomeChange = Math.round(
        currentResult.netIncome - referenceResult.netIncome
      );

      data.push({
        income,
        netIncomeChange,
      });
    }

    return data;
  }, [demographics, currentTaxSystem, referenceTaxSystem, incomeType]);

  const formatXAxisTick = (value: number) => {
    return `${(value / 1000).toFixed(0)}k`;
  };

  const formatTooltip = (value: number) => {
    const sign = value >= 0 ? "+" : "";
    return [`${sign}${value.toLocaleString("fi-FI")} €`, "Nettotulot"];
  };

  const xAxisTicks = useMemo(() => {
    const ticks = [];
    for (let i = 0; i <= 180000; i += 10000) {
      ticks.push(i);
    }
    return ticks;
  }, []);

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 40,
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
            tickFormatter={(value) => `${value.toLocaleString("fi-FI")} €`}
            width={70}
          />
          <Tooltip
            formatter={formatTooltip}
            labelFormatter={(value) =>
              `Ansiotulot: ${Number(value).toLocaleString("fi-FI")} €`
            }
          />
          <ReferenceLine
            y={0}
            stroke="#666"
            strokeWidth={2}
            strokeDasharray="5 5"
          />

          {/* Positive changes (gains) - green */}
          <Area
            dataKey={(entry: ChartDataPoint) =>
              entry.netIncomeChange > 0 ? entry.netIncomeChange : null
            }
            stroke="green"
            strokeWidth={2}
            fill="green"
            fillOpacity={0.3}
            isAnimationActive={false}
            connectNulls={false}
            baseLine={0}
            type="monotone"
            dot={false}
            activeDot={false}
          />

          {/* Create a dataset for negative values to color them red */}
          <Area
            dataKey={(entry: ChartDataPoint) =>
              entry.netIncomeChange < 0 ? entry.netIncomeChange : null
            }
            stroke="darkred"
            strokeWidth={2}
            fill="darkred"
            fillOpacity={0.3}
            isAnimationActive={false}
            connectNulls={false}
            baseLine={0}
            type="monotone"
            dot={false}
            activeDot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
