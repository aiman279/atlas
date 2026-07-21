import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { formatMoney, fundProgress } from '../data/atlas';
import type { ExpenseCategory, IncomeSource } from '../data/types';
import { useAtlas } from '../hooks/useAtlas';
import { PageHeader, ProgressRing } from '../components/ui';

export function FundView() {
  const { data } = useAtlas();
  const fund = data.funds[0];

  const progress = fundProgress(fund.saved, fund.goal);

  const incomeBySource = useMemo(() => {
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

  const expenseByCategory = useMemo(() => {
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

  const totalExpense = Object.values(expenseByCategory).reduce((a, b) => a + b, 0);

  return (
    <div className="view">
      <PageHeader
        eyebrow="Adventure Fund"
        title={fund.name}
        subtitle="Prepare quietly. Arrive ready."
      />

      <motion.section
        className="fund-hero card soft-pad"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <ProgressRing
          progress={progress}
          size={140}
          label={`${progress}%`}
          sublabel="saved"
        />
        <div className="fund-hero-text">
          <div>
            <p className="meta-k">Goal</p>
            <p className="fund-big">{formatMoney(fund.goal, fund.currency)}</p>
          </div>
          <div>
            <p className="meta-k">Saved</p>
            <p className="fund-big sage">{formatMoney(fund.saved, fund.currency)}</p>
          </div>
          <div>
            <p className="meta-k">Remaining</p>
            <p className="fund-big">
              {formatMoney(Math.max(0, fund.goal - fund.saved), fund.currency)}
            </p>
          </div>
        </div>
      </motion.section>

      <section>
        <h2 className="section-label">Income sources</h2>
        <div className="budget-cards">
          {(Object.entries(incomeBySource) as [IncomeSource, number][]).map(
            ([source, amount]) => (
              <div key={source} className="budget-card card">
                <p className="meta-k">{source}</p>
                <p className="meta-v">{formatMoney(amount, fund.currency)}</p>
              </div>
            ),
          )}
        </div>
      </section>

      <section>
        <h2 className="section-label">Spending breakdown</h2>
        <div className="spend-list card soft-pad">
          {(Object.entries(expenseByCategory) as [ExpenseCategory, number][])
            .filter(([, amount]) => amount > 0 || totalExpense === 0)
            .map(([category, amount]) => {
              const pct =
                totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0;
              return (
                <div key={category} className="spend-row">
                  <div className="spend-top">
                    <span>{category}</span>
                    <span>{formatMoney(amount, fund.currency)}</span>
                  </div>
                  <div className="progress-bar">
                    <span style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          {totalExpense === 0 && (
            <p className="muted">No expenses logged yet.</p>
          )}
        </div>
      </section>

      <section>
        <h2 className="section-label">Recent activity</h2>
        <ul className="tx-list">
          {[...fund.transactions]
            .sort((a, b) => b.date.localeCompare(a.date))
            .map((t) => (
              <li key={t.id} className="tx-row card">
                <div>
                  <p className="tx-note">{t.note}</p>
                  <p className="muted">
                    {t.type === 'income' ? t.source : t.category} · {t.date}
                  </p>
                </div>
                <p className={t.type === 'income' ? 'tx-in' : 'tx-out'}>
                  {t.type === 'income' ? '+' : '−'}
                  {formatMoney(t.amount, fund.currency)}
                </p>
              </li>
            ))}
        </ul>
      </section>
    </div>
  );
}
