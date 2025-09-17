import { CalculationContext } from "./CalculationContext";

export class NaturalDeduction {
  constructor(private minimumAmount: number = 750) {}

  calculate(): number {
    return this.minimumAmount;
  }
}

export class PensionIncomeDeduction {
  constructor(
    private baseAmount: number = 11030,
    private reductionRate: number = 0.51
  ) {}

  calculate(context: CalculationContext): number {
    const { income, pureEarnedIncome } = context;

    const basicAmount = Math.min(income.pensionIncome, this.baseAmount);
    const excessIncome = Math.max(0, pureEarnedIncome - this.baseAmount);
    const reduction = excessIncome * this.reductionRate;

    return Math.max(0, basicAmount - reduction);
  }
}

export class BasicDeduction {
  constructor(
    private baseAmount: number = 4115,
    private reductionRate: number = 0.18
  ) {}

  calculate(pureEarnedIncomeAfterOtherDeductions: number): number {
    const excessIncome = Math.max(
      0,
      pureEarnedIncomeAfterOtherDeductions - this.baseAmount
    );
    const reduction = excessIncome * this.reductionRate;

    return Math.max(0, this.baseAmount - reduction);
  }
}

export class EarnedIncomeDeduction {
  constructor(private fixedAmount: number = 0) {}

  calculate(context: CalculationContext): number {
    const { income } = context;
    
    // Fixed sum subtracted from pure earned income, but never more than work income
    return Math.min(this.fixedAmount, income.workIncome);
  }
}

export class WorkIncomeDeduction {
  constructor(
    private baseRate: number = 0.18,
    private standardMaxAmount: number = 3225,
    private seniorMaxAmount: number = 4425,
    private seniorAge: number = 65,
    private childBonus: number = 50,
    private reductionRate1: number = 0.0222,
    private reductionThreshold1: number = 24250,
    private reductionThreshold2: number = 42550,
    private reductionRate2: number = 0.0344
  ) {}

  calculate(
    context: CalculationContext,
    combinedTaxBeforeDeduction: number
  ): number {
    const { person, income, pureEarnedIncome } = context;

    // Calculate maximum amount
    const baseMaxAmount =
      person.age >= this.seniorAge
        ? this.seniorMaxAmount
        : this.standardMaxAmount;
    const childBonus = person.isSingleParent
      ? person.dependentChildren * this.childBonus * 2
      : person.dependentChildren * this.childBonus;
    const maxAmount = baseMaxAmount + childBonus;

    // Calculate basic amount (18% of work income or max amount, whichever is smaller)
    const basicAmount = Math.min(income.workIncome * this.baseRate, maxAmount);

    // Calculate reductions based on pure earned income
    let reduction = 0;

    if (pureEarnedIncome > this.reductionThreshold2) {
      // Above upper threshold: reduce by rate1 for income between thresholds, and rate2 for income above upper threshold
      const excessBetweenThresholds =
        this.reductionThreshold2 - this.reductionThreshold1;
      const excessAboveUpperThreshold =
        pureEarnedIncome - this.reductionThreshold2;
      reduction =
        excessBetweenThresholds * this.reductionRate1 +
        excessAboveUpperThreshold * this.reductionRate2;
    } else if (pureEarnedIncome > this.reductionThreshold1) {
      // Between thresholds: reduce by rate1
      const excessAboveLowerThreshold =
        pureEarnedIncome - this.reductionThreshold1;
      reduction = excessAboveLowerThreshold * this.reductionRate1;
    }

    const deductionAmount = Math.max(0, basicAmount - reduction);

    // Deduction cannot exceed the combined tax amount
    return Math.min(deductionAmount, combinedTaxBeforeDeduction);
  }
}
