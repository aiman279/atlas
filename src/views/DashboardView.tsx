import { motion } from 'framer-motion';
import {
  dashboardProgress,
  daysUntil,
  formatMoney,
  pct,
} from '../data/waypoint';
import type { AppView } from '../data/types';
import { useWaypoint } from '../hooks/useWaypoint';
import { Card, ProgressBar, ProgressRing, SectionLabel } from '../components/ui';

export function DashboardView({
  onNavigate,
  onQuickExpense,
}: {
  onNavigate: (v: AppView, missionId?: string) => void;
  onQuickExpense: () => void;
}) {
  const { data, mission, readiness } = useWaypoint();
  const days = daysUntil(mission.startDate);
  const walletPct = pct(data.fund.saved, data.fund.target);
  const items = dashboardProgress(mission).map((item) =>
    item.id === 'budget'
      ? { ...item, done: walletPct >= 60 }
      : item,
  );

  return (
    <div className="view">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <p className="brand">Waypoint</p>
        <p className="brand-q">Am I ready for my next adventure?</p>
      </motion.div>

      <Card
        className="mission-hero"
        onClick={() => onNavigate('mission-detail', mission.id)}
      >
        <p className="eyebrow">Current Mission</p>
        <h2>
          {mission.flag} {mission.title}
        </h2>
        <div className="countdown">
          <span className="countdown-num">{Math.max(0, days)}</span>
          <span className="countdown-lbl">Days</span>
        </div>
      </Card>

      <section className="dash-grid">
        <Card className="readiness-card">
          <SectionLabel>Travel Readiness</SectionLabel>
          <div className="readiness-row">
            <ProgressRing
              value={readiness.overall}
              label={`${readiness.overall}%`}
              sub="ready"
            />
            <ul className="mini-scores">
              <li>
                <span>Money</span>
                <strong>{readiness.money}%</strong>
              </li>
              <li>
                <span>Planning</span>
                <strong>{readiness.planning}%</strong>
              </li>
              <li>
                <span>Gear</span>
                <strong>{readiness.gear}%</strong>
              </li>
              <li>
                <span>Knowledge</span>
                <strong>{readiness.knowledge}%</strong>
              </li>
            </ul>
          </div>
        </Card>
      </section>

      <Card>
        <SectionLabel>Progress</SectionLabel>
        <ul className="check-list">
          {items.map((item) => (
            <li key={item.id} className={item.done ? 'done' : 'pending'}>
              <span aria-hidden>{item.done ? '✓' : '⚠'}</span>
              {item.label}
            </li>
          ))}
        </ul>
      </Card>

      <Card className="wallet-card" onClick={() => onNavigate('fund')}>
        <SectionLabel>Travel Wallet</SectionLabel>
        <div className="wallet-row">
          <div>
            <p className="meta-k">Goal</p>
            <p className="meta-v">
              {formatMoney(data.fund.target, data.fund.currency)}
            </p>
          </div>
          <div>
            <p className="meta-k">Saved</p>
            <p className="meta-v blue">
              {formatMoney(data.fund.saved, data.fund.currency)}
            </p>
          </div>
          <div>
            <p className="meta-k">Progress</p>
            <p className="meta-v">{walletPct}%</p>
          </div>
        </div>
        <ProgressBar value={walletPct} />
      </Card>

      <SectionLabel>Quick Actions</SectionLabel>
      <div className="quick-actions">
        <button type="button" onClick={() => onNavigate('missions')}>
          + Add Mission
        </button>
        <button type="button" onClick={onQuickExpense}>
          + Add Expense
        </button>
        <button
          type="button"
          onClick={() => onNavigate('mission-detail', mission.id)}
        >
          + Update Progress
        </button>
      </div>
    </div>
  );
}
