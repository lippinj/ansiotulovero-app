import { TaxpayerCharacteristics } from './TaxpayerCharacteristics';
import { IncomeComponents } from './IncomeComponents';

export class CalculationContext {
  public totalEarnedIncome: number;
  public pureEarnedIncome: number = 0;
  public taxableEarnedIncome: number = 0;

  constructor(
    public person: TaxpayerCharacteristics,
    public income: IncomeComponents
  ) {
    this.totalEarnedIncome = income.total;
  }
}