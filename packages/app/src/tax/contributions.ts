import { CalculationContext } from "./CalculationContext";

export class PensionContribution {
  constructor(
    private standardRate: number = 0.0715,
    private seniorRate: number = 0.0865,
    private seniorAgeMin: number = 53,
    private seniorAgeMax: number = 62
  ) {}

  calculate(context: CalculationContext): number {
    const { person, income } = context;
    const rate =
      person.age >= this.seniorAgeMin && person.age <= this.seniorAgeMax
        ? this.seniorRate
        : this.standardRate;

    return income.workIncome * rate;
  }
}

export class UnemploymentInsuranceContribution {
  constructor(
    private rate: number = 0.0059,
    private exemptionAge: number = 65
  ) {}

  calculate(context: CalculationContext): number {
    const { person, income } = context;

    if (person.age >= this.exemptionAge) {
      return 0;
    }

    return income.workIncome * this.rate;
  }
}

export class IllnessInsuranceContribution {
  constructor(
    private rate: number = 0.0084,
    private threshold: number = 16862,
    private exemptionAge: number = 68
  ) {}

  calculate(context: CalculationContext): number {
    const { person, income } = context;

    if (person.age >= this.exemptionAge) {
      return 0;
    }

    if (income.workIncome < this.threshold) {
      return 0;
    }

    return income.workIncome * this.rate;
  }
}
