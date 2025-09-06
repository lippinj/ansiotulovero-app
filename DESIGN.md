# Design

This web app helps the user to understand what the income tax rate schedule in
Finland looks like, both the marginal and the average tax rates at different
income levels.

Earned income is actually subject to two kinds of mandatory payments:
formal taxes and taxlike mandatory contributions.
In this document, words like "tax" and "tax system" often actuall refer to all
mandatory payments, though you should consider the context to make sure which
is meant.

The app can calculate things like the total tax burden, marginal tax rate, and
average tax rate based on the parameters of the tax system (outlined below).
It can plot these on a graph for the user.
The user can select system parameters from a preset (for example, based on the
law for a really existing tax year) or manually experiment with different
options.
The app can also compare two different tax schedules, and show the difference in
annual income between the two.

## The tax system

This model is for the taxation of earned income in Finland.
For our purposes, we partition earned income into three disjoint sets:
- Work income (such as wages),
- Pension income,
- Other earned income.

Total earned income is the sum of work income,
pension income and other earned income.
Pure earned income is total earned income minus natural deductions.
Taxable earned income is pure earned income minus some other deductions.
Some deductions can also be made from actual taxes.

The parameters (tax rates, thresholds and so on)
presented in this section are for the tax year 2025.
The app should treat these as configurable parameters,
not hardcode them.

### Taxlike contributions

The pension contribution is a flat rate on work income.
It is deductible from pure earned income.
The rate is 7.15% for most people,
but 8.65% for those aged 53 to 62.

The unemployment insurance contribution is a flat rate on work income.
It is deductible from pure earned income.
The rate is 0.59% for most people, but zero for people aged 65 or over.

The illness insurance contribution is a flat 0.84% on work income,
except if your work income is less than 16862 euros,
in which case it is zero.
When above the threshold, you pay the flat rate on the entire work income,
not just the part exceeding the threshold.
It is deductible from pure earned income.
People aged 68 or over do not have to pay this contribution.

### Taxes from taxable income in 2025

The state income tax is a progressive tax on taxable income.
It is 12.64% for the portion of income between 0 and 21200 euros,
19.00% between 21200 and 31500 euros,
30.25% between 31500 and 52100 euros,
34.00% between 52100 and 88200 euros,
41.75% between 88200 and 150000 euros,
and 44.25% above 150000 euros.

The municipal income tax is a flat rate on taxable income.
The rate depends on the municipality.
The app should use the weighted average by default,
which in 2025 is 7.54%.

The church tax is a flat rate on taxable income.
It applies only to church members.
The rate depends on the municipality.
The app should use the weighted average by default,
which in 2025 is 1.38%.

The public health insurance contribution is a flat rate on taxable income.
The rate is 1.06% for taxable work income and 1.45% for other taxable income.

### Other taxes on income

The public radio tax is a flat 2.50% on
on pure earned income exceeding 14000 euros.
The total payable tax is capped at 163 euros.

The additional tax on pension income is a flat 5.85%
on pension income exceeding 47000 euros.

### Deductions in 2025

These are the numbers for 2025.
The app should accommodate different numerical parameters.

Natural deductions are subtracted from total earned income.
They can be claimed for expenses incurred from making the income,
such as buying tools or professional literature.
You always get at least 750 euros, no matter your actual expenses
(but of course if your actual expenses are more,
you can claim based on actual expenses).
For the purposes of this app, we just assume that you take the 750.

The pension income deduction is subtracted from pure earned income.
Its basic amount is either your pension income or 11030 euros,
whichever is smaller.
The basic amount is reduced by 51% of the amount
by which pure earned income exceeds 11030 euros,
down to a minimum of zero.

The basic deduction is subtracted from pure earned income,
after all other deductions from pure earned income have been subtracted
(reduced pure earned income).
Its basic amount is 4115 euros.
The basic amount is reduced by 18% of the amount
by which the reduced pure earned income exceeds 4115 euros,
down to a minimum of zero.

The work income deduction is subtracted from the sum of
state income tax, municipal income tax, church tax
and public health insurance contribution.
Its maximum amount is 3225 euros,
except for those 65 years or older, for whom it is 4425 euros.
Additionally, the maximum amount is increased by 50 euros
for each dependent child.
Its basic amount is either 18% of your work income
or the aforementioned maximum amount,
whichever is smaller.
The basic amount is reduced by 2.22% for pure earned income
between 24250 euros and 42550 euros,
and 3.44% for pure earned income above 42550 euros,
down to a minimum of zero.

Deductions cannot reduce a number below zero.
