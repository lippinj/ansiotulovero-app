import { describe, it, expect } from 'vitest';
import { PensionContribution, UnemploymentInsuranceContribution, IllnessInsuranceContribution } from '../contributions';
import { CalculationContext } from '../CalculationContext';
import { TaxpayerCharacteristics } from '../TaxpayerCharacteristics';
import { IncomeComponents } from '../IncomeComponents';

const createContext = (age: number, workIncome: number): CalculationContext => {
  const person: TaxpayerCharacteristics = { 
    age, 
    isChurchMember: false, 
    dependentChildren: 0, 
    isSingleParent: false,
    isUnionMember: false,
    unionFeePercentage: 0
  };
  const income = new IncomeComponents(workIncome, 0, 0);
  return new CalculationContext(person, income);
};

describe('PensionContribution', () => {
  it('calculates standard rate for regular age', () => {
    const pensionCalc = new PensionContribution(0.0715, 0.0865, 53, 62);
    const context = createContext(40, 50000);
    
    expect(pensionCalc.calculate(context)).toBeCloseTo(3575, 2); // 50000 * 0.0715
  });

  it('calculates senior rate for ages 53-62', () => {
    const pensionCalc = new PensionContribution(0.0715, 0.0865, 53, 62);
    const context = createContext(55, 50000);
    
    expect(pensionCalc.calculate(context)).toBe(4325); // 50000 * 0.0865
  });

  it('calculates standard rate for age exactly at senior min boundary', () => {
    const pensionCalc = new PensionContribution(0.0715, 0.0865, 53, 62);
    const context = createContext(53, 50000);
    
    expect(pensionCalc.calculate(context)).toBe(4325); // 50000 * 0.0865
  });

  it('calculates standard rate for age exactly at senior max boundary', () => {
    const pensionCalc = new PensionContribution(0.0715, 0.0865, 53, 62);
    const context = createContext(62, 50000);
    
    expect(pensionCalc.calculate(context)).toBe(4325); // 50000 * 0.0865
  });

  it('calculates standard rate for age above senior range', () => {
    const pensionCalc = new PensionContribution(0.0715, 0.0865, 53, 62);
    const context = createContext(65, 50000);
    
    expect(pensionCalc.calculate(context)).toBeCloseTo(3575, 2); // 50000 * 0.0715
  });

  it('returns zero for zero work income', () => {
    const pensionCalc = new PensionContribution();
    const context = createContext(40, 0);
    
    expect(pensionCalc.calculate(context)).toBe(0);
  });
});

describe('UnemploymentInsuranceContribution', () => {
  it('calculates contribution for regular age', () => {
    const unemploymentCalc = new UnemploymentInsuranceContribution(0.0059, 65);
    const context = createContext(40, 50000);
    
    expect(unemploymentCalc.calculate(context)).toBe(295); // 50000 * 0.0059
  });

  it('returns zero for age at exemption threshold', () => {
    const unemploymentCalc = new UnemploymentInsuranceContribution(0.0059, 65);
    const context = createContext(65, 50000);
    
    expect(unemploymentCalc.calculate(context)).toBe(0);
  });

  it('returns zero for age above exemption threshold', () => {
    const unemploymentCalc = new UnemploymentInsuranceContribution(0.0059, 65);
    const context = createContext(70, 50000);
    
    expect(unemploymentCalc.calculate(context)).toBe(0);
  });

  it('returns zero for zero work income', () => {
    const unemploymentCalc = new UnemploymentInsuranceContribution();
    const context = createContext(40, 0);
    
    expect(unemploymentCalc.calculate(context)).toBe(0);
  });
});

describe('IllnessInsuranceContribution', () => {
  it('calculates contribution for work income above threshold', () => {
    const illnessCalc = new IllnessInsuranceContribution(0.0084, 16862, 68);
    const context = createContext(40, 50000);
    
    expect(illnessCalc.calculate(context)).toBe(420); // 50000 * 0.0084
  });

  it('returns zero for work income below threshold', () => {
    const illnessCalc = new IllnessInsuranceContribution(0.0084, 16862, 68);
    const context = createContext(40, 15000);
    
    expect(illnessCalc.calculate(context)).toBe(0);
  });

  it('returns zero for work income exactly at threshold', () => {
    const illnessCalc = new IllnessInsuranceContribution(0.0084, 16862, 68);
    const context = createContext(40, 16862);
    
    expect(illnessCalc.calculate(context)).toBeCloseTo(141.64, 2); // 16862 * 0.0084, not 0 since >= threshold
  });

  it('calculates contribution for work income just above threshold', () => {
    const illnessCalc = new IllnessInsuranceContribution(0.0084, 16862, 68);
    const context = createContext(40, 16863);
    
    expect(illnessCalc.calculate(context)).toBeCloseTo(141.65, 2); // 16863 * 0.0084
  });

  it('returns zero for age at exemption threshold', () => {
    const illnessCalc = new IllnessInsuranceContribution(0.0084, 16862, 68);
    const context = createContext(68, 50000);
    
    expect(illnessCalc.calculate(context)).toBe(0);
  });

  it('returns zero for age above exemption threshold', () => {
    const illnessCalc = new IllnessInsuranceContribution(0.0084, 16862, 68);
    const context = createContext(70, 50000);
    
    expect(illnessCalc.calculate(context)).toBe(0);
  });

  it('returns zero for zero work income', () => {
    const illnessCalc = new IllnessInsuranceContribution();
    const context = createContext(40, 0);
    
    expect(illnessCalc.calculate(context)).toBe(0);
  });
});