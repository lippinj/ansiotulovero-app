import { TaxBracket } from "./TaxParameters";
import { CalculationContext } from "./CalculationContext";

export class StateIncomeTax {
  constructor(
    private brackets: TaxBracket[] = [
      { min: 0, max: 21200, rate: 0.1264 },
      { min: 21200, max: 31500, rate: 0.19 },
      { min: 31500, max: 52100, rate: 0.3025 },
      { min: 52100, max: 88200, rate: 0.34 },
      { min: 88200, max: 150000, rate: 0.4175 },
      { min: 150000, max: Infinity, rate: 0.4425 },
    ]
  ) {}

  calculate(context: CalculationContext): number {
    const taxableIncome = context.taxableEarnedIncome;
    let tax = 0;

    for (const bracket of this.brackets) {
      if (taxableIncome <= bracket.min) {
        break;
      }

      const taxableInBracket =
        Math.min(taxableIncome, bracket.max) - bracket.min;
      tax += taxableInBracket * bracket.rate;
    }

    return tax;
  }
}

export class MunicipalIncomeTax {
  constructor(private rate: number = 0.0754) {}

  calculate(context: CalculationContext): number {
    return context.taxableEarnedIncome * this.rate;
  }
}

export class ChurchTax {
  constructor(private rate: number = 0.0138) {}

  calculate(context: CalculationContext): number {
    if (!context.person.isChurchMember) {
      return 0;
    }

    return context.taxableEarnedIncome * this.rate;
  }
}

export class PublicHealthInsuranceContribution {
  constructor(
    private workIncomeRate: number = 0.0106,
    private otherIncomeRate: number = 0.0145
  ) {}

  calculate(context: CalculationContext): number {
    const { income, taxableEarnedIncome } = context;

    // Calculate taxable work income portion of total taxable earned income
    const taxableWorkIncome = Math.min(income.workIncome, taxableEarnedIncome);
    const taxableOtherIncome = taxableEarnedIncome - taxableWorkIncome;

    return (
      taxableWorkIncome * this.workIncomeRate +
      taxableOtherIncome * this.otherIncomeRate
    );
  }
}

export class PublicRadioTax {
  constructor(
    private rate: number = 0.025,
    private threshold: number = 14000,
    private maxTax: number = 163
  ) {}

  calculate(context: CalculationContext): number {
    const taxableAmount = Math.max(
      0,
      context.pureEarnedIncome - this.threshold
    );
    const calculatedTax = taxableAmount * this.rate;

    return Math.min(calculatedTax, this.maxTax);
  }
}

export class AdditionalPensionTax {
  constructor(
    private rate: number = 0.0585,
    private threshold: number = 47000
  ) {}

  calculate(context: CalculationContext): number {
    const taxableAmount = Math.max(
      0,
      context.income.pensionIncome - this.threshold
    );
    return taxableAmount * this.rate;
  }
}
