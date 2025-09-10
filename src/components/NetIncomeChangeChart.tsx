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

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const value = data.netIncomeChange;
      const sign = value >= 0 ? "+" : "";
      const color = value >= 0 ? "text-green-700" : "text-red-700";

      return (
        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.75)",
            backdropFilter: "blur(2px)",
            padding: "12px",
            border: "1px solid rgb(209, 213, 219)",
            borderRadius: "6px",
            boxShadow:
              "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          }}
          className="text-gray-900"
        >
          <p className="text-sm font-medium mb-2">
            {`Ansiotulo: ${Number(label).toLocaleString("fi-FI")} €/${timeframe === "monthly" ? "kk" : "v"}`}
          </p>
          <div className="flex items-center">
            <div
              className={`w-3 h-0.5 mr-2 ${value >= 0 ? "bg-green-600" : "bg-red-600"}`}
            ></div>
            <span className={`text-sm font-medium ${color}`}>
              Nettotulojen muutos: {sign}
              {value.toLocaleString("fi-FI")} €
            </span>
          </div>
        </div>
      );
    }

    return null;
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
              content={<CustomTooltip />}
              wrapperStyle={{ backgroundColor: "transparent", border: "none" }}
              contentStyle={{ backgroundColor: "transparent", border: "none" }}
              animationDuration={0}
              isAnimationActive={false}
              position={{ x: undefined, y: undefined }}
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
