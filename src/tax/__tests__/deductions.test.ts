import { describe, it, expect } from 'vitest';
import { NaturalDeduction, PensionIncomeDeduction, BasicDeduction, WorkIncomeDeduction } from '../deductions';
import { CalculationContext } from '../CalculationContext';
import { TaxpayerCharacteristics } from '../TaxpayerCharacteristics';
import { IncomeComponents } from '../IncomeComponents';

const createContext = (
  age: number = 40,
  workIncome: number = 50000,
  pensionIncome: number = 0,
  pureEarnedIncome: number = 45000,
  dependentChildren: number = 0
): CalculationContext => {
  const person: TaxpayerCharacteristics = { age, isChurchMember: false, dependentChildren, isSingleParent: false };
  const income = new IncomeComponents(workIncome, pensionIncome, 0);
  const context = new CalculationContext(person, income);
  context.pureEarnedIncome = pureEarnedIncome;
  return context;
};

describe('NaturalDeduction', () => {
  it('returns minimum amount with default parameters', () => {
    const naturalDeduction = new NaturalDeduction();
    const context = createContext();
    expect(naturalDeduction.calculate(context)).toBe(750);
  });

  it('uses custom minimum amount', () => {
    const naturalDeduction = new NaturalDeduction(1000);
    const context = createContext();
    expect(naturalDeduction.calculate(context)).toBe(1000);
  });
});

describe('PensionIncomeDeduction', () => {
  it('calculates full deduction when pension income is below base amount', () => {
    const pensionDeduction = new PensionIncomeDeduction();
    const context = createContext(65, 20000, 8000, 8000);
    expect(pensionDeduction.calculate(context)).toBe(8000); // min(8000, 11030) = 8000
  });

  it('calculates base amount when pension income exceeds base amount', () => {
    const pensionDeduction = new PensionIncomeDeduction();
    const context = createContext(65, 20000, 15000, 15000);
    expect(pensionDeduction.calculate(context)).toBeCloseTo(9005.3, 1); // Reduced due to pure earned income > base
  });

  it('applies reduction when pure earned income exceeds base amount', () => {
    const pensionDeduction = new PensionIncomeDeduction(11030, 0.51);
    const context = createContext(65, 20000, 8000, 15000); // pure earned income > 11030
    // Basic amount: min(8000, 11030) = 8000
    // Excess: 15000 - 11030 = 3970
    // Reduction: 3970 * 0.51 = 2024.7
    // Final: max(0, 8000 - 2024.7) = 5975.3
    expect(pensionDeduction.calculate(context)).toBeCloseTo(5975.3, 1);
  });

  it('returns zero when reduction exceeds basic amount', () => {
    const pensionDeduction = new PensionIncomeDeduction(11030, 0.51);
    const context = createContext(65, 20000, 5000, 25000);
    // Basic amount: min(5000, 11030) = 5000
    // Excess: 25000 - 11030 = 13970
    // Reduction: 13970 * 0.51 = 7124.7
    // Final: max(0, 5000 - 7124.7) = 0
    expect(pensionDeduction.calculate(context)).toBe(0);
  });

  it('no reduction when pure earned income equals base amount', () => {
    const pensionDeduction = new PensionIncomeDeduction();
    const context = createContext(65, 20000, 8000, 11030);
    expect(pensionDeduction.calculate(context)).toBe(8000); // No reduction applied
  });

  it('uses custom parameters', () => {
    const pensionDeduction = new PensionIncomeDeduction(10000, 0.4);
    const context = createContext(65, 20000, 8000, 12000);
    // Basic amount: min(8000, 10000) = 8000
    // Excess: 12000 - 10000 = 2000
    // Reduction: 2000 * 0.4 = 800
    // Final: max(0, 8000 - 800) = 7200
    expect(pensionDeduction.calculate(context)).toBe(7200);
  });
});

describe('BasicDeduction', () => {
  it('calculates full deduction when income is below base amount', () => {
    const basicDeduction = new BasicDeduction();
    expect(basicDeduction.calculate(3000)).toBe(4115); // Full base amount
  });

  it('calculates full deduction when income equals base amount', () => {
    const basicDeduction = new BasicDeduction();
    expect(basicDeduction.calculate(4115)).toBe(4115); // Full base amount
  });

  it('applies reduction when income exceeds base amount', () => {
    const basicDeduction = new BasicDeduction(4115, 0.18);
    const pureEarnedIncomeAfterOtherDeductions = 10000;
    // Excess: 10000 - 4115 = 5885
    // Reduction: 5885 * 0.18 = 1059.3
    // Final: max(0, 4115 - 1059.3) = 3055.7
    expect(basicDeduction.calculate(pureEarnedIncomeAfterOtherDeductions)).toBeCloseTo(3055.7, 1);
  });

  it('returns zero when reduction exceeds base amount', () => {
    const basicDeduction = new BasicDeduction(4115, 0.18);
    const pureEarnedIncomeAfterOtherDeductions = 50000;
    // Excess: 50000 - 4115 = 45885
    // Reduction: 45885 * 0.18 = 8259.3
    // Final: max(0, 4115 - 8259.3) = 0
    expect(basicDeduction.calculate(pureEarnedIncomeAfterOtherDeductions)).toBe(0);
  });

  it('uses custom parameters', () => {
    const basicDeduction = new BasicDeduction(5000, 0.2);
    const pureEarnedIncomeAfterOtherDeductions = 8000;
    // Excess: 8000 - 5000 = 3000
    // Reduction: 3000 * 0.2 = 600
    // Final: max(0, 5000 - 600) = 4400
    expect(basicDeduction.calculate(pureEarnedIncomeAfterOtherDeductions)).toBe(4400);
  });
});

describe('WorkIncomeDeduction', () => {
  it('calculates basic deduction for regular age and income', () => {
    const workDeduction = new WorkIncomeDeduction();
    const context = createContext(40, 30000, 0, 20000); // Pure earned income below thresholds
    const combinedTax = 5000;
    // Basic amount: min(30000 * 0.18, 3225) = min(5400, 3225) = 3225
    // No reduction as pure earned income (20000) < 24250
    expect(workDeduction.calculate(context, combinedTax)).toBe(3225);
  });

  it('calculates higher maximum for senior age', () => {
    const workDeduction = new WorkIncomeDeduction();
    const context = createContext(65, 30000, 0, 20000);
    const combinedTax = 5000;
    // Basic amount: min(30000 * 0.18, 4425) = min(5400, 4425) = 4425
    expect(workDeduction.calculate(context, combinedTax)).toBe(4425);
  });

  it('adds child bonus to maximum amount', () => {
    const workDeduction = new WorkIncomeDeduction();
    const context = createContext(40, 30000, 0, 20000, 2); // 2 children
    const combinedTax = 5000;
    // Max amount: 3225 + (2 * 50) = 3325
    // Basic amount: min(30000 * 0.18, 3325) = min(5400, 3325) = 3325
    expect(workDeduction.calculate(context, combinedTax)).toBe(3325);
  });

  it('applies first tier reduction for income between thresholds', () => {
    const workDeduction = new WorkIncomeDeduction(0.18, 3225, 4425, 65, 50, 0.0222, 24250, 42550, 0.0344);
    const context = createContext(40, 30000, 0, 30000); // Pure earned income between 24250 and 42550
    const combinedTax = 5000;
    // Basic amount: min(30000 * 0.18, 3225) = 3225
    // Excess above 24250: 30000 - 24250 = 5750
    // Reduction: 5750 * 0.0222 = 127.65
    // Final: max(0, 3225 - 127.65) = 3097.35
    expect(workDeduction.calculate(context, combinedTax)).toBeCloseTo(3097.35, 1);
  });

  it('applies both tier reductions for income above upper threshold', () => {
    const workDeduction = new WorkIncomeDeduction(0.18, 3225, 4425, 65, 50, 0.0222, 24250, 42550, 0.0344);
    const context = createContext(40, 30000, 0, 50000); // Pure earned income above 42550
    const combinedTax = 5000;
    // Basic amount: min(30000 * 0.18, 3225) = 3225
    // First tier: (42550 - 24250) * 0.0222 = 18300 * 0.0222 = 406.26
    // Second tier: (50000 - 42550) * 0.0344 = 7450 * 0.0344 = 256.28
    // Total reduction: 406.26 + 256.28 = 662.54
    // Final: max(0, 3225 - 662.54) = 2562.46
    expect(workDeduction.calculate(context, combinedTax)).toBeCloseTo(2562.46, 1);
  });

  it('caps deduction at combined tax amount', () => {
    const workDeduction = new WorkIncomeDeduction();
    const context = createContext(40, 50000, 0, 20000); // Low pure earned income, high work income
    const combinedTax = 1000; // Low tax amount
    // Basic amount would be min(50000 * 0.18, 3225) = 3225
    // But capped at combinedTax = 1000
    expect(workDeduction.calculate(context, combinedTax)).toBe(1000);
  });

  it('returns zero when reduction exceeds basic amount', () => {
    const workDeduction = new WorkIncomeDeduction(0.18, 3225, 4425, 65, 50, 0.0222, 24250, 42550, 0.0344);
    const context = createContext(40, 10000, 0, 100000); // Very high pure earned income, low work income
    const combinedTax = 5000;
    // Basic amount: min(10000 * 0.18, 3225) = 1800
    // Very high reduction due to pure earned income
    expect(workDeduction.calculate(context, combinedTax)).toBe(0);
  });

  it('handles zero work income', () => {
    const workDeduction = new WorkIncomeDeduction();
    const context = createContext(40, 0, 0, 20000);
    const combinedTax = 5000;
    // Basic amount: min(0 * 0.18, 3225) = 0
    expect(workDeduction.calculate(context, combinedTax)).toBe(0);
  });

  it('handles zero combined tax', () => {
    const workDeduction = new WorkIncomeDeduction();
    const context = createContext(40, 30000, 0, 20000);
    const combinedTax = 0;
    // Deduction cannot exceed zero tax
    expect(workDeduction.calculate(context, combinedTax)).toBe(0);
  });
});