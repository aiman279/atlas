import { useMemo } from 'react';
import {
  formatMoney,
  pct,
  travelFreedomDays,
} from '../data/waypoint';
import type { ExpenseCategory, IncomeSource } from '../data/types';
import { useWaypoint } from '../hooks/useWaypoint';
import {
  Card,
  PageHeader,
  ProgressRing,
  SectionLabel,
} from '../components/ui';

export function FundView() {
  const { data } = useWaypoint();
  const { fund } = data;
  const progress = pct(fund.saved, fund.target);
  const freedom = travelFreedomDays(data);

  const income = useMemo(() => {
    const map: Record<IncomeSource, number> = {
      Salary: 0,
      Grab: 0,
      'Side income': 0,
    };
    fund.transactions
      .filter((t) => t.type === 'income' && t.source)
      .forEach((t) => {
        map[t.source!] += t.amount;
      });
    return map;
  }, [fund.transactions]);

  const expenses = useMemo(() => {
    const map: Record<ExpenseCategory, number> = {
      Flight: 0,
      Hotel: 0,
      Food: 0,
      Transport: 0,
      Activities: 0,
    };
    fund.transactions
      .filter((t) => t.type === 'expense' && t.category)
      .forEach((t) => {
        map[t.category!] += t.amount;
      });
    return map;
  }, [fund.transactions]);

  const expenseTotal = Object.values(expenses).reduce((a, b) => a + b, 0);

  return (
    <div className="view">
      <PageHeader
        eyebrow="Travel Fund"
        title={fund.goalName}
        subtitle="Save with intention. Know when you can go."
      />

      <Card className="fund-hero mb">
        <ProgressRing
          value={progress}
          size={130}
          label={`${progress}%`}
          sub="saved"
        />
        <div className="fund-nums">
          <div>
            <p className="meta-k">Target</p>
            <p className="big">{formatMoney(fund.target, fund.currency)}</p>
          </div>
          <div>
            <p className="meta-k">Saved</p>
            <p className="big blue">
              {formatMoney(fund.saved, fund.currency)}
            </p>
          </div>
        </div>
      </Card>

      <Card className="freedom-card mb">
        <SectionLabel>Travel Freedom</SectionLabel>
        <p className="freedom-text">
          Based on my savings:
          <br />
          <strong>
            You can comfortably travel for {freedom} days
          </strong>
        </p>
        <p className="muted">
          At ~{formatMoney(fund.dailyBurnRate, fund.currency)}/day
        </p>
      </Card>

      <SectionLabel>Income sources</SectionLabel>
      <div className="three-grid mb">
        {(Object.entries(income) as [IncomeSource, number][]).map(
          ([k, v]) => (
            <Card key={k} className="mini">
              <p className="meta-k">{k}</p>
              <p className="meta-v">{formatMoney(v, fund.currency)}</p>
            </Card>
          ),
        )}
      </div>

      <SectionLabel>Spending breakdown</SectionLabel>
      <Card className="mb">
        <ul className="spend">
          {(Object.entries(expenses) as [ExpenseCategory, number][])
            .filter(([, v]) => v > 0)
            .map(([k, v]) => (
              <li key={k}>
                <div className="spend-top">
                  <span>{k}</span>
                  <span>{formatMoney(v, fund.currency)}</span>
                </div>
                <div className="bar">
                  <span
                    style={{
                      width: `${expenseTotal ? pct(v, expenseTotal) : 0}%`,
                    }}
                  />
                </div>
              </li>
            ))}
        </ul>
      </Card>

      <SectionLabel>Saving timeline</SectionLabel>
      <ul className="stack">
        {[...fund.transactions]
          .sort((a, b) => b.date.localeCompare(a.date))
          .map((t) => (
            <li key={t.id}>
              <Card className="tx">
                <div>
                  <p className="gear-name">{t.note}</p>
                  <p className="muted">
                    {t.type === 'income' ? t.source : t.category} · {t.date}
                  </p>
                </div>
                <p className={t.type === 'income' ? 'in' : 'out'}>
                  {t.type === 'income' ? '+' : '−'}
                  {formatMoney(t.amount, fund.currency)}
                </p>
              </Card>
            </li>
          ))}
      </ul>
    </div>
  );
}
