import { TaxpayerCharacteristics } from "./TaxpayerCharacteristics";
import { IncomeComponents } from "./IncomeComponents";
import { CalculationContext } from "./CalculationContext";
import { TaxParameters } from "./TaxParameters";
import {
  PensionContribution,
  UnemploymentInsuranceContribution,
  IllnessInsuranceContribution,
} from "./contributions";
import {
  StateIncomeTax,
  MunicipalIncomeTax,
  ChurchTax,
  PublicHealthInsuranceContribution,
  PublicRadioTax,
  AdditionalPensionTax,
} from "./taxes";
import {
  NaturalDeduction,
  PensionIncomeDeduction,
  BasicDeduction,
  WorkIncomeDeduction,
} from "./deductions";

function applyDeduction(amount: number, deduction: number): number {
  return Math.max(0, amount - deduction);
}

export interface TaxBurdenResult {
  totalEarnedIncome: number;
  totalTaxBurden: number;
  taxlikeContributions: {
    pension: number;
    unemployment: number;
    illness: number;
    total: number;
  };
  pureEarnedIncome: number;
  deductions: {
    natural: number;
    pensionIncome: number;
    basic: number;
    unionFee: number;
    total: number;
  };
  taxableEarnedIncome: number;
  taxes: {
    stateIncome: number;
    municipal: number;
    church: number;
    healthInsurance: number;
    radio: number;
    additionalPension: number;
    total: number;
  };
  workIncomeDeduction: number;
  netIncome: number;
}

export interface TaxCalculationResult extends TaxBurdenResult {
  effectiveTaxRate: number;
  marginalTaxRate: number;
}

export class TaxSystem {
  private parameters: TaxParameters;
  private pensionContribution: PensionContribution;
  private unemploymentInsuranceContribution: UnemploymentInsuranceContribution;
  private illnessInsuranceContribution: IllnessInsuranceContribution;
  private naturalDeduction: NaturalDeduction;
  private pensionIncomeDeduction: PensionIncomeDeduction;
  private basicDeduction: BasicDeduction;
  private stateIncomeTax: StateIncomeTax;
  private municipalIncomeTax: MunicipalIncomeTax;
  private churchTax: ChurchTax;
  private publicHealthInsuranceContribution: PublicHealthInsuranceContribution;
  private publicRadioTax: PublicRadioTax;
  private additionalPensionTax: AdditionalPensionTax;
  private workIncomeDeduction: WorkIncomeDeduction | null;
  private unionFeeDeductible: boolean;

  constructor(params: TaxParameters) {
    this.unionFeeDeductible = params.unionFeeDeductible;

    // Convert UI tax brackets (percentages) to calculation brackets (decimals)
    const stateIncomeTaxBrackets = params.stateIncomeTaxBrackets.map(
      (bracket) => ({
        ...bracket,
        rate: bracket.rate / 100,
      })
    );

    this.pensionContribution = new PensionContribution(
      params.pensionStandardRate / 100,
      params.pensionSeniorRate / 100,
      53,
      62
    );
    this.unemploymentInsuranceContribution =
      new UnemploymentInsuranceContribution(params.unemploymentRate / 100, 65);
    this.illnessInsuranceContribution = new IllnessInsuranceContribution(
      params.illnessRate / 100,
      params.illnessThreshold,
      68
    );
    this.naturalDeduction = new NaturalDeduction(params.naturalDeductionMin);
    this.pensionIncomeDeduction = new PensionIncomeDeduction(
      params.pensionDeductionBase,
      params.pensionDeductionReductionRate / 100
    );
    this.basicDeduction = new BasicDeduction(
      params.basicDeductionBase,
      params.basicDeductionReductionRate / 100
    );
    this.stateIncomeTax = new StateIncomeTax(stateIncomeTaxBrackets);
    this.municipalIncomeTax = new MunicipalIncomeTax(
      params.municipalRate / 100
    );
    this.churchTax = new ChurchTax(params.churchRate / 100);
    this.publicHealthInsuranceContribution =
      new PublicHealthInsuranceContribution(
        params.healthWorkRate / 100,
        params.healthOtherRate / 100
      );
    this.publicRadioTax = new PublicRadioTax(
      params.radioRate / 100,
      params.radioThreshold,
      params.radioMaxTax
    );
    this.additionalPensionTax = new AdditionalPensionTax(
      params.pensionAdditionalRate / 100,
      params.pensionAdditionalThreshold
    );
    this.workIncomeDeduction = params.workDeductionEnabled
      ? new WorkIncomeDeduction(
          params.workDeductionRate / 100,
          params.workDeductionStandardMax,
          params.workDeductionSeniorMax,
          65,
          params.workDeductionChildBonus,
          params.workDeductionReductionRate1 / 100,
          params.workDeductionReductionThreshold1,
          params.workDeductionReductionThreshold2,
          params.workDeductionReductionRate2 / 100
        )
      : null;
  }

  private calculateTaxBurden(
    demographics: TaxpayerCharacteristics,
    income: IncomeComponents
  ): TaxBurdenResult {
    // Step 1: Calculate taxlike contributions
    const context = new CalculationContext(demographics, income);

    const pensionContrib = this.pensionContribution.calculate(context);
    const unemploymentContrib =
      this.unemploymentInsuranceContribution.calculate(context);
    const illnessContrib = this.illnessInsuranceContribution.calculate(context);
    const totalContributions =
      pensionContrib + unemploymentContrib + illnessContrib;

    // Step 2: Calculate pure earned income
    const naturalDeduction = this.naturalDeduction.calculate(context);
    let pureEarnedIncome = context.totalEarnedIncome - naturalDeduction;

    // Step 2.1: Deduct union fees if deductible
    let unionFeeDeduction = 0;
    if (this.unionFeeDeductible && demographics.isUnionMember) {
      unionFeeDeduction = Math.round(
        (income.workIncome * demographics.unionFeePercentage) / 100
      );
      pureEarnedIncome = Math.max(0, pureEarnedIncome - unionFeeDeduction);
    }

    context.pureEarnedIncome = pureEarnedIncome;

    // Step 3: Calculate deductions from pure earned income
    let taxableEarnedIncome = pureEarnedIncome - totalContributions;
    const pensionIncomeDeduction =
      this.pensionIncomeDeduction.calculate(context);
    taxableEarnedIncome = applyDeduction(
      taxableEarnedIncome,
      pensionIncomeDeduction
    );
    const basicDeduction = this.basicDeduction.calculate(taxableEarnedIncome);
    taxableEarnedIncome = applyDeduction(taxableEarnedIncome, basicDeduction);
    context.taxableEarnedIncome = taxableEarnedIncome;

    // Step 4: Calculate taxes
    const stateIncome = this.stateIncomeTax.calculate(context);
    const municipal = this.municipalIncomeTax.calculate(context);
    const church = this.churchTax.calculate(context);
    const healthInsurance =
      this.publicHealthInsuranceContribution.calculate(context);
    const radio = this.publicRadioTax.calculate(context);
    const additionalPension = this.additionalPensionTax.calculate(context);

    const combinedTaxBeforeWorkDeduction =
      stateIncome + municipal + church + healthInsurance;
    const workIncomeDeduction =
      this.workIncomeDeduction?.calculate(
        context,
        combinedTaxBeforeWorkDeduction
      ) ?? 0;

    const totalTaxes =
      applyDeduction(combinedTaxBeforeWorkDeduction, workIncomeDeduction) +
      radio +
      additionalPension;
    const totalTaxBurden = totalContributions + totalTaxes;
    const netIncome = context.totalEarnedIncome - totalTaxBurden;

    return {
      totalEarnedIncome: context.totalEarnedIncome,
      totalTaxBurden,
      taxlikeContributions: {
        pension: pensionContrib,
        unemployment: unemploymentContrib,
        illness: illnessContrib,
        total: totalContributions,
      },
      pureEarnedIncome,
      deductions: {
        natural: naturalDeduction,
        pensionIncome: pensionIncomeDeduction,
        basic: basicDeduction,
        unionFee: unionFeeDeduction,
        total:
          naturalDeduction +
          pensionIncomeDeduction +
          basicDeduction +
          unionFeeDeduction,
      },
      taxableEarnedIncome,
      taxes: {
        stateIncome,
        municipal,
        church,
        healthInsurance,
        radio,
        additionalPension,
        total: totalTaxes,
      },
      workIncomeDeduction,
      netIncome,
    };
  }

  calculate(
    demographics: TaxpayerCharacteristics,
    income: IncomeComponents
  ): TaxCalculationResult {
    const h = 1.0;
    const result = this.calculateTaxBurden(demographics, income);
    const result2 = this.calculateTaxBurden(demographics, income.inflate(h));

    const marginalTaxRate =
      ((result2.totalTaxBurden - result.totalTaxBurden) / h) * 100;
    const effectiveTaxRate =
      result.totalEarnedIncome > 0
        ? (result.totalTaxBurden / result.totalEarnedIncome) * 100
        : 0;

    return {
      ...result,
      effectiveTaxRate,
      marginalTaxRate,
    };
  }
}
