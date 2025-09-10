import { useMemo } from "react";
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
import { calculateAxisTicks, generateTicks } from "../base/utils/gridAxisTicks";

interface Props {
  demographics: TaxpayerCharacteristics;
  currentTaxSystem: TaxSystem;
  referenceTaxSystem: TaxSystem;
  incomeType: "work" | "pension";
  timeframe: "annual" | "monthly";
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
  timeframe,
}: Props) {
  const divisor = timeframe === "monthly" ? 12 : 1;
  const maxIncome = timeframe === "monthly" ? 15000 : 180000;
  const incomeStep = timeframe === "monthly" ? 10 : 120;
  const chartData = useMemo(() => {
    const data: ChartDataPoint[] = [];

    for (let income = 0; income <= maxIncome; income += incomeStep) {
      const annualIncome = timeframe === "monthly" ? income * 12 : income;
      const incomeComponents =
        incomeType === "work"
          ? new IncomeComponents(annualIncome, 0, 0)
          : new IncomeComponents(0, annualIncome, 0);

      const currentResult = currentTaxSystem.calculate(
        demographics,
        incomeComponents
      );
      const referenceResult = referenceTaxSystem.calculate(
        demographics,
        incomeComponents
      );

      const netIncomeChange = Math.round(
        (currentResult.netIncome - referenceResult.netIncome) / divisor
      );

      data.push({
        income,
        netIncomeChange,
      });
    }

    return data;
  }, [
    demographics,
    currentTaxSystem,
    referenceTaxSystem,
    incomeType,
    timeframe,
    divisor,
    maxIncome,
    incomeStep,
  ]);

  const formatXAxisTick = (value: number) => {
    if (timeframe === "monthly") {
      return `${(value / 1000).toFixed(0)}k`;
    }
    return `${(value / 1000).toFixed(0)}k`;
  };

  const formatTooltip = (value: number) => {
    const sign = value >= 0 ? "+" : "";
    return [`${sign}${value.toLocaleString("fi-FI")} €`, "Nettotulojen muutos"];
  };

  const xAxisTicks = useMemo(() => {
    const tickSpacing = timeframe === "monthly" ? 1000 : 10000;
    return generateTicks({ min: 0, max: maxIncome }, tickSpacing);
  }, [timeframe, maxIncome]);

  const yAxisTicks = useMemo(() => {
    if (chartData.length === 0) {
      return [0];
    }

    const values = chartData.map((point) => point.netIncomeChange);
    const expandedValues = [
      Math.min(-100, ...values),
      Math.max(+100, ...values),
    ];
    return calculateAxisTicks(expandedValues);
  }, [chartData]);

  return (
    <div>
      <div className="h-48 sm:h-56 md:h-64 lg:h-72">
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
              domain={[0, maxIncome]}
              ticks={xAxisTicks}
              label={{
                value: `Ansiotulot yhteensä (eur/${timeframe === "monthly" ? "kk" : "v"})`,
                position: "insideBottom",
                offset: -10,
              }}
            />
            <YAxis
              tickFormatter={(value) => value.toLocaleString("fi-FI")}
              width={70}
              ticks={yAxisTicks}
              label={{
                value: `Δ nettotulot (eur/${timeframe === "monthly" ? "kk" : "v"})`,
                angle: -90,
                position: "insideLeft",
                offset: -5,
                style: { textAnchor: "middle" },
              }}
            />
            <Tooltip
              formatter={formatTooltip}
              labelFormatter={(value) =>
                `Ansiotulot: ${Number(value).toLocaleString("fi-FI")} €/${timeframe === "monthly" ? "kk" : "v"}`
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
    </div>
  );
}
