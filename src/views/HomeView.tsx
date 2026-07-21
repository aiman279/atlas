import { motion } from 'framer-motion';
import {
  daysUntil,
  formatMoney,
  greeting,
  pct,
} from '../data/waypoint';
import type { AppView } from '../data/types';
import { useWaypoint } from '../hooks/useWaypoint';
import {
  Card,
  ProgressBar,
  ProgressRing,
  SectionLabel,
} from '../components/ui';

export function HomeView({
  onNavigate,
  onOpenProfile,
  onQuickExpense,
  onAddMemory,
}: {
  onNavigate: (v: AppView, journeyId?: string) => void;
  onOpenProfile: () => void;
  onQuickExpense: () => void;
  onAddMemory: () => void;
}) {
  const { data, journey, readiness } = useWaypoint();
  const days = Math.max(0, daysUntil(journey.startDate));
  const fundPct = pct(data.fund.saved, data.fund.target);

  return (
    <div className="view">
      <motion.header
        className="home-top"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <p className="brand">Waypoint</p>
          <h1 className="welcome">
            {greeting()}, {data.profile.name}
          </h1>
          <p className="brand-q">Where am I in my travel journey right now?</p>
        </div>
        <button
          type="button"
          className="avatar-btn"
          onClick={onOpenProfile}
          aria-label="Open profile"
        >
          {data.profile.name.charAt(0)}
        </button>
      </motion.header>

      <Card
        className="mission-hero"
        onClick={() => onNavigate('journey-detail', journey.id)}
      >
        <p className="eyebrow">Current Adventure</p>
        <h2>
          {journey.flag} {journey.title}
        </h2>
        <div className="countdown">
          <span className="countdown-num">{days}</span>
          <span className="countdown-lbl">Days</span>
        </div>
      </Card>

      <Card className="mb">
        <SectionLabel>Travel Readiness</SectionLabel>
        <div className="readiness-row">
          <ProgressRing
            value={readiness.overall}
            label={`${readiness.overall}%`}
            sub="ready"
          />
          <ul className="mini-scores">
            <li>
              <span>Budget</span>
              <strong>{readiness.money}%</strong>
            </li>
            <li>
              <span>Checklist</span>
              <strong>{readiness.planning}%</strong>
            </li>
            <li>
              <span>Research</span>
              <strong>{readiness.knowledge}%</strong>
            </li>
            <li>
              <span>Packing</span>
              <strong>{readiness.gear}%</strong>
            </li>
          </ul>
        </div>
      </Card>

      <Card className="wallet-card" onClick={() => onNavigate('essentials')}>
        <SectionLabel>Travel Fund</SectionLabel>
        <p className="fund-goal-name">{data.fund.goalName}</p>
        <p className="fund-ratio">
          {formatMoney(data.fund.saved, data.fund.currency)} /{' '}
          {formatMoney(data.fund.target, data.fund.currency)}
        </p>
        <div className="wallet-row tight">
          <p className="meta-v">{fundPct}%</p>
        </div>
        <ProgressBar value={fundPct} />
      </Card>

      <SectionLabel>Quick Actions</SectionLabel>
      <div className="quick-actions mb">
        <button type="button" onClick={onQuickExpense}>
          + Add Expense
        </button>
        <button
          type="button"
          onClick={() => onNavigate('journey-detail', journey.id)}
        >
          + Update Checklist
        </button>
        <button type="button" onClick={onAddMemory}>
          + Add Memory
        </button>
      </div>

      <SectionLabel>Personal Travel Stats</SectionLabel>
      <div className="stats-3">
        <Card>
          <p className="stat-emoji" aria-hidden>
            🌎
          </p>
          <p className="stat-num">{data.profile.countriesVisited}</p>
          <p className="muted">Countries visited</p>
        </Card>
        <Card>
          <p className="stat-emoji" aria-hidden>
            ✈️
          </p>
          <p className="stat-num">{data.profile.totalJourneys}</p>
          <p className="muted">Total journeys</p>
        </Card>
        <Card>
          <p className="stat-emoji" aria-hidden>
            📅
          </p>
          <p className="stat-num">{data.profile.totalTravelDays}</p>
          <p className="muted">Travel days</p>
        </Card>
      </div>
    </div>
  );
}
