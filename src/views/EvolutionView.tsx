import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNorth } from '../hooks/useNorth';

export function EvolutionView() {
  const { data } = useNorth();
  const [yearIndex, setYearIndex] = useState(0);
  const year = data.evolution[yearIndex] ?? data.evolution[0];

  if (!year) {
    return (
      <div className="page">
        <header className="page-head">
          <h1>Evolution</h1>
          <p className="page-lead">No summaries yet.</p>
        </header>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="page-head">
        <h1>Evolution</h1>
        <p className="page-lead">How you have changed over time.</p>
      </header>

      <div className="year-switch">
        {data.evolution.map((y, i) => (
          <button
            key={y.year}
            type="button"
            className={i === yearIndex ? 'is-active' : ''}
            onClick={() => setYearIndex(i)}
          >
            {y.year}
          </button>
        ))}
      </div>

      <motion.section
        key={year.year}
        className="wrapped"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="eyebrow">Life analytics</p>
        <h2 className="wrapped-title">{year.title}</h2>

        <ul className="metric-grid">
          {year.metrics.map((m) => (
            <li key={m.label} className="glass metric-card">
              <p className="focus-label">{m.label}</p>
              <p className="metric-value">{m.value}</p>
            </li>
          ))}
        </ul>

        <div className="glass compare-panel">
          <div className="compare-row">
            <div>
              <p className="focus-label">Past self</p>
              <p className="stat-lg">{year.pastSelf}</p>
            </div>
            <div>
              <p className="focus-label">Current self</p>
              <p className="stat-lg">{year.currentSelf}</p>
            </div>
          </div>
          <ul className="compare-list">
            {year.comparisons.map((c) => (
              <li key={c}>“{c}”</li>
            ))}
          </ul>
        </div>
      </motion.section>
    </div>
  );
}
