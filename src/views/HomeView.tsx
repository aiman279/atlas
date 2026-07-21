import { motion } from 'framer-motion';
import {
  daysUntil,
  formatMoney,
  greeting,
  nextJourney,
} from '../data/waypoint';
import type { AppView } from '../data/types';
import { useWaypoint } from '../hooks/useWaypoint';

export function HomeView({
  onNavigate,
}: {
  onNavigate: (v: AppView, id?: string) => void;
}) {
  const data = useWaypoint();
  const next = nextJourney(data);
  const days = Math.max(0, daysUntil(next.startDate));
  const fundPct = Math.min(
    100,
    Math.round((data.fund.saved / data.fund.target) * 100),
  );
  const recent = data.journeys
    .filter((j) => j.status === 'completed' && j.coverImage)
    .slice(0, 3);

  return (
    <motion.div
      className="page home"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <header className="home-header">
        <div>
          <p className="home-hello">{greeting()}</p>
          <h1 className="home-name">{data.profile.name}</h1>
        </div>
        <button
          type="button"
          className="home-avatar"
          onClick={() => onNavigate('profile')}
          aria-label="Open profile"
        >
          {data.profile.name.charAt(0)}
        </button>
      </header>

      <section className="chapter-chip">
        <p className="chip-label">Current chapter</p>
        <p className="chip-title">{data.profile.lifeChapter}</p>
        <p className="chip-note">{data.profile.chapterNote}</p>
      </section>

      <section className="home-section">
        <div className="section-head">
          <h2>Next adventure</h2>
          <span>{days} days</span>
        </div>
        <button
          type="button"
          className="adventure-card"
          onClick={() => onNavigate('journey-detail', next.id)}
        >
          <img src={next.coverImage} alt="" className="adventure-img" />
          <div className="adventure-veil">
            <p className="adventure-flag">{next.flag}</p>
            <h3>{next.country}</h3>
            <p>
              {next.cities.join(' · ')} · {next.durationDays} days
            </p>
          </div>
        </button>
      </section>

      <section className="home-section">
        <div className="section-head">
          <h2>Travel fund</h2>
          <span>{fundPct}%</span>
        </div>
        <div className="fund-card">
          <div className="fund-top">
            <div>
              <p className="fund-label">{data.fund.goalName}</p>
              <p className="fund-saved">
                {formatMoney(data.fund.saved, data.fund.currency)}
              </p>
            </div>
            <p className="fund-target">
              of {formatMoney(data.fund.target, data.fund.currency)}
            </p>
          </div>
          <div className="fund-bar">
            <span style={{ width: `${fundPct}%` }} />
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="section-head">
          <h2>Your journey</h2>
        </div>
        <div className="stat-cards">
          <div className="stat-card">
            <p className="stat-num">{data.profile.countriesVisited}</p>
            <p className="stat-lbl">Countries</p>
          </div>
          <div className="stat-card">
            <p className="stat-num">{data.profile.totalJourneys}</p>
            <p className="stat-lbl">Journeys</p>
          </div>
          <div className="stat-card">
            <p className="stat-num">{data.profile.travelDays}</p>
            <p className="stat-lbl">Days</p>
          </div>
        </div>
      </section>

      {recent.length > 0 && (
        <section className="home-section">
          <div className="section-head">
            <h2>Memories</h2>
            <button type="button" onClick={() => onNavigate('journeys')}>
              See all
            </button>
          </div>
          <div className="memory-row">
            {recent.map((j) => (
              <button
                key={j.id}
                type="button"
                className="memory-thumb"
                onClick={() => onNavigate('journey-detail', j.id)}
              >
                <img src={j.coverImage} alt="" />
                <span>
                  {j.flag} {j.country}
                </span>
              </button>
            ))}
          </div>
        </section>
      )}
    </motion.div>
  );
}
