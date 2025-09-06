import { describe, it, expect } from 'vitest';
import { 
  StateIncomeTax, 
  MunicipalIncomeTax, 
  ChurchTax, 
  PublicHealthInsuranceContribution,
  PublicRadioTax,
  AdditionalPensionTax 
} from '../taxes';
import { CalculationContext } from '../CalculationContext';
import { TaxpayerCharacteristics } from '../TaxpayerCharacteristics';
import { IncomeComponents } from '../IncomeComponents';

const createContext = (
  taxableIncome: number, 
  pureEarnedIncome: number = taxableIncome,
  isChurchMember: boolean = false,
  workIncome: number = taxableIncome,
  pensionIncome: number = 0
): CalculationContext => {
  const person: TaxpayerCharacteristics = { age: 40, isChurchMember, dependentChildren: 0, isSingleParent: false };
  const income = new IncomeComponents(workIncome, pensionIncome, 0);
  const context = new CalculationContext(person, income);
  context.pureEarnedIncome = pureEarnedIncome;
  context.taxableEarnedIncome = taxableIncome;
  return context;
};

describe('StateIncomeTax', () => {
  const stateIncomeTax = new StateIncomeTax();

  it('calculates no tax for zero income', () => {
    const context = createContext(0);
    expect(stateIncomeTax.calculate(context)).toBe(0);
  });

  it('calculates tax in first bracket', () => {
    const context = createContext(15000);
    expect(stateIncomeTax.calculate(context)).toBeCloseTo(1896, 0); // 15000 * 0.1264
  });

  it('calculates tax across multiple brackets', () => {
    const context = createContext(35000);
    // First bracket: 21200 * 0.1264 = 2679.68
    // Second bracket: 10300 * 0.19 = 1957
    // Third bracket: 3500 * 0.3025 = 1058.75
    // Total: 5695.43
    expect(stateIncomeTax.calculate(context)).toBeCloseTo(5695.43, 1);
  });

  it('calculates tax in highest bracket', () => {
    const context = createContext(200000);
    // Calculate expected tax across all brackets
    const expected = 
      21200 * 0.1264 +           // 2679.68
      (31500 - 21200) * 0.19 +   // 1957
      (52100 - 31500) * 0.3025 + // 6231.5  
      (88200 - 52100) * 0.34 +   // 12274
      (150000 - 88200) * 0.4175 + // 25801.5
      (200000 - 150000) * 0.4425; // 22125
    expect(stateIncomeTax.calculate(context)).toBeCloseTo(expected, 1);
  });
});

describe('MunicipalIncomeTax', () => {
  it('calculates municipal tax with default rate', () => {
    const municipalTax = new MunicipalIncomeTax();
    const context = createContext(50000);
    expect(municipalTax.calculate(context)).toBeCloseTo(3770, 0); // 50000 * 0.0754
  });

  it('calculates municipal tax with custom rate', () => {
    const municipalTax = new MunicipalIncomeTax(0.08);
    const context = createContext(50000);
    expect(municipalTax.calculate(context)).toBe(4000); // 50000 * 0.08
  });

  it('returns zero for zero income', () => {
    const municipalTax = new MunicipalIncomeTax();
    const context = createContext(0);
    expect(municipalTax.calculate(context)).toBe(0);
  });
});

describe('ChurchTax', () => {
  it('calculates church tax for church members', () => {
    const churchTax = new ChurchTax();
    const context = createContext(50000, 50000, true);
    expect(churchTax.calculate(context)).toBeCloseTo(690, 0); // 50000 * 0.0138
  });

  it('returns zero for non-church members', () => {
    const churchTax = new ChurchTax();
    const context = createContext(50000, 50000, false);
    expect(churchTax.calculate(context)).toBe(0);
  });

  it('calculates church tax with custom rate', () => {
    const churchTax = new ChurchTax(0.015);
    const context = createContext(50000, 50000, true);
    expect(churchTax.calculate(context)).toBe(750); // 50000 * 0.015
  });
});

describe('PublicHealthInsuranceContribution', () => {
  it('calculates contribution for work income only', () => {
    const healthCalc = new PublicHealthInsuranceContribution();
    const context = createContext(50000, 50000, false, 50000, 0);
    expect(healthCalc.calculate(context)).toBeCloseTo(530, 0); // 50000 * 0.0106
  });

  it('calculates contribution for other income only', () => {
    const healthCalc = new PublicHealthInsuranceContribution();
    const context = createContext(50000, 50000, false, 0, 0);
    context.income.otherEarnedIncome = 50000;
    expect(healthCalc.calculate(context)).toBeCloseTo(725, 0); // 50000 * 0.0145
  });

  it('calculates contribution for mixed income types', () => {
    const healthCalc = new PublicHealthInsuranceContribution();
    const context = createContext(60000, 60000, false, 40000, 0);
    context.income.otherEarnedIncome = 20000;
    // Work income: 40000 * 0.0106 = 424
    // Other income: 20000 * 0.0145 = 290
    // Total: 714
    expect(healthCalc.calculate(context)).toBeCloseTo(714, 0);
  });

  it('handles case where work income exceeds taxable income', () => {
    const healthCalc = new PublicHealthInsuranceContribution();
    const context = createContext(30000, 30000, false, 50000, 0);
    // Only 30000 is taxable, all treated as work income
    expect(healthCalc.calculate(context)).toBeCloseTo(318, 0); // 30000 * 0.0106
  });
});

describe('PublicRadioTax', () => {
  it('calculates no tax below threshold', () => {
    const radioTax = new PublicRadioTax();
    const context = createContext(10000, 10000);
    expect(radioTax.calculate(context)).toBe(0);
  });

  it('calculates tax above threshold', () => {
    const radioTax = new PublicRadioTax();
    const context = createContext(20000, 20000);
    // (20000 - 14000) * 0.025 = 150
    expect(radioTax.calculate(context)).toBe(150);
  });

  it('caps tax at maximum', () => {
    const radioTax = new PublicRadioTax();
    const context = createContext(100000, 100000);
    // (100000 - 14000) * 0.025 = 2150, but capped at 163
    expect(radioTax.calculate(context)).toBe(163);
  });

  it('calculates tax exactly at threshold', () => {
    const radioTax = new PublicRadioTax();
    const context = createContext(14000, 14000);
    expect(radioTax.calculate(context)).toBe(0);
  });

  it('uses custom parameters', () => {
    const radioTax = new PublicRadioTax(0.03, 15000, 200);
    const context = createContext(25000, 25000);
    // (25000 - 15000) * 0.03 = 300, but capped at 200
    expect(radioTax.calculate(context)).toBe(200);
  });
});

describe('AdditionalPensionTax', () => {
  it('calculates no tax below threshold', () => {
    const pensionTax = new AdditionalPensionTax();
    const context = createContext(40000, 40000, false, 20000, 30000);
    expect(pensionTax.calculate(context)).toBe(0);
  });

  it('calculates tax above threshold', () => {
    const pensionTax = new AdditionalPensionTax();
    const context = createContext(50000, 50000, false, 20000, 60000);
    // (60000 - 47000) * 0.0585 = 760.5
    expect(pensionTax.calculate(context)).toBeCloseTo(760.5, 1);
  });

  it('calculates tax exactly at threshold', () => {
    const pensionTax = new AdditionalPensionTax();
    const context = createContext(50000, 50000, false, 20000, 47000);
    expect(pensionTax.calculate(context)).toBe(0);
  });

  it('uses custom parameters', () => {
    const pensionTax = new AdditionalPensionTax(0.07, 40000);
    const context = createContext(50000, 50000, false, 20000, 50000);
    // (50000 - 40000) * 0.07 = 700
    expect(pensionTax.calculate(context)).toBeCloseTo(700, 2);
  });

  it('returns zero for zero pension income', () => {
    const pensionTax = new AdditionalPensionTax();
    const context = createContext(50000, 50000, false, 50000, 0);
    expect(pensionTax.calculate(context)).toBe(0);
  });
});