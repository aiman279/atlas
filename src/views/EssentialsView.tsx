import { useMemo, useState } from 'react';
import {
  formatMoney,
  gearWeightKg,
  pct,
  travelFreedomDays,
} from '../data/waypoint';
import type { ExpenseCategory, GearCategory, IncomeSource } from '../data/types';
import { useWaypoint } from '../hooks/useWaypoint';
import {
  Card,
  PageHeader,
  ProgressBar,
  ProgressRing,
  SectionLabel,
} from '../components/ui';

const categories: GearCategory[] = [
  'Technology',
  'Clothing',
  'Health',
  'Documents',
  'Accessories',
];

export function EssentialsView() {
  const { data } = useWaypoint();
  const [tab, setTab] = useState<'gear' | 'fund'>('gear');
  const weight = gearWeightKg(data);
  const limit = data.gearLimits.backpackLimitKg;
  const { fund } = data;
  const progress = pct(fund.saved, fund.target);
  const freedom = travelFreedomDays(data);

  const mostUsed = [...data.gear]
    .sort((a, b) => b.timesUsed - a.timesUsed)
    .slice(0, 3);
  const unused = data.gear.filter((g) => g.timesUsed <= 2);
  const essentials = data.gear.filter((g) => g.essential);

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
        eyebrow="Prepare for adventure"
        title="Essentials"
        subtitle="Gear lighter. Save clearer. Leave ready."
      />

      <div className="seg">
        <button
          type="button"
          className={tab === 'gear' ? 'is-on' : undefined}
          onClick={() => setTab('gear')}
        >
          Gear
        </button>
        <button
          type="button"
          className={tab === 'fund' ? 'is-on' : undefined}
          onClick={() => setTab('fund')}
        >
          Travel Fund
        </button>
      </div>

      {tab === 'gear' && (
        <>
          <Card className="mb">
            <SectionLabel>My Backpack</SectionLabel>
            <p className="weight-big">
              {weight}kg <span>/ {limit}kg</span>
            </p>
            <ProgressBar value={pct(weight, limit)} />
          </Card>

          <SectionLabel>Categories</SectionLabel>
          <div className="cat-grid mb">
            {categories.map((cat) => {
              const items = data.gear.filter((g) => g.category === cat);
              const w = items.reduce((s, g) => s + g.weightKg, 0);
              return (
                <Card key={cat} className="cat-card">
                  <p className="meta-k">{cat}</p>
                  <p className="meta-v">{items.length} items</p>
                  <p className="muted">{w.toFixed(1)}kg</p>
                </Card>
              );
            })}
          </div>

          <SectionLabel>Essential items</SectionLabel>
          <div className="stack mb">
            {essentials.map((g) => (
              <GearRow key={g.id} item={g} />
            ))}
          </div>

          <SectionLabel>Frequently used</SectionLabel>
          <div className="stack mb">
            {mostUsed.map((g) => (
              <GearRow key={g.id} item={g} />
            ))}
          </div>

          <SectionLabel>Unused items</SectionLabel>
          <div className="stack">
            {unused.map((g) => (
              <GearRow key={g.id} item={g} />
            ))}
          </div>
        </>
      )}

      {tab === 'fund' && (
        <>
          <Card className="fund-hero mb">
            <ProgressRing
              value={progress}
              size={130}
              label={`${progress}%`}
              sub="saved"
            />
            <div className="fund-nums">
              <div>
                <p className="meta-k">Goal</p>
                <p className="big">{fund.goalName}</p>
              </div>
              <div>
                <p className="meta-k">Target</p>
                <p className="big">
                  {formatMoney(fund.target, fund.currency)}
                </p>
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
              Based on your current saving, you can comfortably travel for{' '}
              <strong>{freedom} days</strong>.
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
        </>
      )}
    </div>
  );
}

function GearRow({
  item,
}: {
  item: {
    name: string;
    category: string;
    weightKg: number;
    price: number;
    essential: boolean;
    timesUsed: number;
  };
}) {
  return (
    <Card className="gear-row">
      <div>
        <p className="gear-name">{item.name}</p>
        <p className="muted">
          {item.category} · {item.weightKg}kg · used {item.timesUsed}x
          {item.essential ? ' · Essential' : ''}
        </p>
      </div>
      <p className="gear-price">
        {item.price > 0 ? formatMoney(item.price) : '—'}
      </p>
    </Card>
  );
}
