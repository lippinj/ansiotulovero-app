export interface TaxBracket {
  min: number;
  max: number;
  rate: number;
}

export interface TaxParameters {
  // Pension contribution rates
  pensionStandardRate: number;
  pensionSeniorRate: number;

  // Unemployment insurance
  unemploymentRate: number;

  // Illness insurance
  illnessRate: number;
  illnessThreshold: number;

  // State income tax
  stateIncomeTaxBrackets: TaxBracket[];

  // Municipal tax
  municipalRate: number;

  // Church tax
  churchRate: number;

  // Health insurance
  healthWorkRate: number;
  healthOtherRate: number;

  // Radio tax
  radioRate: number;
  radioThreshold: number;
  radioMaxTax: number;

  // Additional pension tax
  pensionAdditionalRate: number;
  pensionAdditionalThreshold: number;

  // Deductions
  naturalDeductionMin: number;
  pensionDeductionBase: number;
  pensionDeductionReductionRate: number;
  basicDeductionBase: number;
  basicDeductionReductionRate: number;
  workDeductionRate: number;
  workDeductionStandardMax: number;
  workDeductionSeniorMax: number;
  workDeductionChildBonus: number;
  workDeductionReductionRate1: number;
  workDeductionReductionThreshold1: number;
  workDeductionReductionThreshold2: number;
  workDeductionReductionRate2: number;
  workDeductionEnabled: boolean;
  unionFeeDeductible: boolean;
  earnedIncomeDeduction: number;
}

export interface TaxParameterPreset {
  name: string;
  description: string;
  parameters: TaxParameters;
}

export interface TaxParameterPresets {
  [key: string]: TaxParameterPreset;
}

const kParams2025 = {
  pensionStandardRate: 7.15,
  pensionSeniorRate: 8.65,

  unemploymentRate: 0.59,

  illnessRate: 0.84,
  illnessThreshold: 16862,
  healthWorkRate: 1.06,
  healthOtherRate: 1.45,

  stateIncomeTaxBrackets: [
    { min: 0, max: 21200, rate: 12.64 },
    { min: 21200, max: 31500, rate: 19 },
    { min: 31500, max: 52100, rate: 30.25 },
    { min: 52100, max: 88200, rate: 34 },
    { min: 88200, max: 150000, rate: 41.75 },
    { min: 150000, max: Infinity, rate: 44.25 },
  ],

  municipalRate: 7.54,
  churchRate: 1.38,

  radioRate: 2.5,
  radioThreshold: 14000,
  radioMaxTax: 163,

  pensionAdditionalRate: 5.85,
  pensionAdditionalThreshold: 47000,

  naturalDeductionMin: 750,

  pensionDeductionBase: 11030,
  pensionDeductionReductionRate: 51,

  basicDeductionBase: 4115,
  basicDeductionReductionRate: 18,

  earnedIncomeDeduction: 0,

  workDeductionEnabled: true,
  workDeductionRate: 18,
  workDeductionStandardMax: 3225,
  workDeductionSeniorMax: 4425,
  workDeductionChildBonus: 50,
  workDeductionReductionRate1: 2.22,
  workDeductionReductionThreshold1: 24250,
  workDeductionReductionThreshold2: 42550,
  workDeductionReductionRate2: 3.44,

  unionFeeDeductible: true,
};

const kParams2026Base = {
  ...kParams2025,
  pensionStandardRate: 7.3,
  pensionSeniorRate: 7.3,
  unemploymentRate: 0.89,
};

export const taxParameterPresets: TaxParameterPresets = {
  "2025": {
    name: "2025",
    description: "2025",
    parameters: kParams2025,
  },
  "2026_base": {
    name: "2026 pohja",
    description: "2026 pohja",
    parameters: kParams2026Base,
  },
  "2026_he": {
    name: "2026 hallituksen esitys",
    description: "2026 hallituksen esitys",
    parameters: {
      ...kParams2026Base,

      stateIncomeTaxBrackets: [
        { min: 0, max: 22000, rate: 12.64 },
        { min: 22000, max: 32700, rate: 19 },
        { min: 32700, max: 40200, rate: 30.25 },
        { min: 40200, max: 52100, rate: 33.25 },
        { min: 52100, max: Infinity, rate: 37.5 },
      ],

      radioMaxTax: 160,

      pensionAdditionalRate: 4.0,
      pensionAdditionalThreshold: 57000,

      pensionDeductionBase: 11030,
      pensionDeductionReductionRate: 51,

      basicDeductionBase: 4270,
      basicDeductionReductionRate: 18,

      workDeductionRate: 18,
      workDeductionStandardMax: 3435,
      workDeductionSeniorMax: 3435,
      workDeductionChildBonus: 105,
      workDeductionReductionRate1: 2.0,
      workDeductionReductionThreshold1: 35000,
      workDeductionReductionThreshold2: 50450,
      workDeductionReductionRate2: 0,

      unionFeeDeductible: false,
    },
  },
  "2026_a": {
    name: "2026 a",
    description: "2026 vaihtoehto A",
    parameters: {
      ...kParams2026Base,

      stateIncomeTaxBrackets: [
        { min: 0, max: 36000, rate: 35 },
        { min: 36000, max: Infinity, rate: 42 },
      ],

      radioMaxTax: 0,

      pensionDeductionBase: 0,

      basicDeductionBase: 21000,
      basicDeductionReductionRate: 0,

      workDeductionEnabled: false,
    },
  },
};

export const defaultTaxParameters = taxParameterPresets["2025"].parameters;
