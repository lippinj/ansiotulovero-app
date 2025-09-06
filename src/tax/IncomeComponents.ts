export class IncomeComponents {
  constructor(
    public workIncome: number,
    public pensionIncome: number,
    public otherEarnedIncome: number
  ) {}

  get total(): number {
    return this.workIncome + this.pensionIncome + this.otherEarnedIncome;
  }

  get workProportion(): number {
    return this.total === 0 ? 0 : this.workIncome / this.total;
  }

  get pensionProportion(): number {
    return this.total === 0 ? 0 : this.pensionIncome / this.total;
  }

  get otherProportion(): number {
    return this.total === 0 ? 0 : this.otherEarnedIncome / this.total;
  }

  inflate(amount: number = 1): IncomeComponents {
    if (this.total === 0) {
      return new IncomeComponents(amount / 3, amount / 3, amount / 3);
    }

    return new IncomeComponents(
      this.workIncome + amount * this.workProportion,
      this.pensionIncome + amount * this.pensionProportion,
      this.otherEarnedIncome + amount * this.otherProportion
    );
  }
}
