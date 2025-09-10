import { useMemo } from "react";
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
  timeframe: "annual" | "monthly";
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
  timeframe,
}: Props) {
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

      data.push({
        income,
        currentEffectiveTaxRate: currentResult.effectiveTaxRate,
        currentMarginalTaxRate: currentResult.marginalTaxRate,
        referenceEffectiveTaxRate: referenceResult.effectiveTaxRate,
        referenceMarginalTaxRate: referenceResult.marginalTaxRate,
      });
    }

    return data;
  }, [
    demographics,
    currentTaxSystem,
    referenceTaxSystem,
    incomeType,
    timeframe,
    maxIncome,
    incomeStep,
  ]);

  const xAxisTicks = useMemo(() => {
    const ticks = [];
    const tickSpacing = timeframe === "monthly" ? 1000 : 10000;
    for (let i = 0; i <= maxIncome; i += tickSpacing) {
      ticks.push(i);
    }
    return ticks;
  }, [timeframe, maxIncome]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;

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
          <div className="space-y-1">
            <div className="flex items-center">
              <div className="w-3 h-0.5 bg-red-700 mr-2"></div>
              <span className="text-sm">
                Rajaveroaste: {data.referenceMarginalTaxRate.toFixed(1)}% →{" "}
                {data.currentMarginalTaxRate.toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-0.5 bg-blue-800 mr-2"></div>
              <span className="text-sm">
                Keskimääräinen veroaste:{" "}
                {data.referenceEffectiveTaxRate.toFixed(1)}% →{" "}
                {data.currentEffectiveTaxRate.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  const formatXAxisTick = (value: number) => {
    return `${(value / 1000).toFixed(0)}k`;
  };

  return (
    <div>
      <div className="h-84 sm:h-96 md:h-106 lg:h-128">
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
              domain={[0, maxIncome]}
              ticks={xAxisTicks}
              label={{
                value: `Ansiotulot yhteensä (eur/${timeframe === "monthly" ? "kk" : "v"})`,
                position: "insideBottom",
                offset: -10,
              }}
            />
            <YAxis
              domain={[0, 60]}
              ticks={[0, 10, 20, 30, 40, 50, 60]}
              label={{
                value: "Veroaste (%)",
                angle: -90,
                position: "insideLeft",
                style: { textAnchor: "middle" },
              }}
            />
            <Tooltip
              content={<CustomTooltip />}
              wrapperStyle={{ backgroundColor: "transparent", border: "none" }}
              contentStyle={{ backgroundColor: "transparent", border: "none" }}
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
    </div>
  );
}
