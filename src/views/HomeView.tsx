import { motion } from 'framer-motion';
import {
  chapterLabel,
  daysUntil,
  formatMoney,
  fundProgress,
} from '../data/atlas';
import type { AppView } from '../data/types';
import { useAtlas } from '../hooks/useAtlas';
import { Card, ProgressBar, StatPill } from '../components/ui';
import './views.css';

export function HomeView({
  onNavigate,
}: {
  onNavigate: (view: AppView, journeyId?: string) => void;
}) {
  const { data, stats } = useAtlas();
  const upcoming =
    data.journeys.find((j) => j.status === 'upcoming') ?? data.journeys.at(-1)!;
  const fund = data.funds[0];
  const days = daysUntil(upcoming.startDate);
  const progress = fund ? fundProgress(fund.saved, fund.goal) : 0;

  return (
    <div className="view">
      <motion.div
        className="brand-row"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="brand">Atlas</p>
        <p className="brand-tag">Your life adventure OS</p>
      </motion.div>

      <motion.section
        className="chapter-hero card soft-pad"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.05 }}
      >
        <p className="eyebrow">Current life chapter</p>
        <h1 className="chapter-title">
          Chapter {String(data.lifeChapter.number).padStart(2, '0')}:
          <br />
          {data.lifeChapter.title}
        </h1>
        <p className="chapter-sub">{data.lifeChapter.subtitle}</p>
      </motion.section>

      <section className="stats-grid">
        <StatPill icon="🌎" value={stats.countriesVisited} label="Countries visited" />
        <StatPill icon="✈️" value={stats.totalJourneys} label="Total journeys" />
        <StatPill icon="📸" value={stats.memoriesCreated} label="Memories created" />
        <StatPill
          icon="🔥"
          value={stats.achievementsUnlocked}
          label="Achievements unlocked"
        />
      </section>

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.12 }}
      >
        <div className="section-row">
          <h2 className="section-label">Upcoming adventure</h2>
        </div>
        <Card
          className="upcoming-card"
          onClick={() => onNavigate('journey-detail', upcoming.id)}
        >
          <div
            className="upcoming-cover"
            style={{ backgroundImage: `url(${upcoming.coverImage})` }}
          />
          <div className="upcoming-body">
            <p className="eyebrow">{chapterLabel(upcoming.chapter)}</p>
            <h3>{upcoming.flag} {upcoming.title}</h3>
            <div className="upcoming-meta">
              <div>
                <p className="meta-k">Starts</p>
                <p className="meta-v">
                  {days > 0 ? `${days} days` : days === 0 ? 'Today' : 'In progress'}
                </p>
              </div>
              <div>
                <p className="meta-k">Budget</p>
                <p className="meta-v">{formatMoney(upcoming.budget)}</p>
              </div>
              <div>
                <p className="meta-k">Progress</p>
                <p className="meta-v">{progress}%</p>
              </div>
            </div>
            <ProgressBar progress={progress} />
          </div>
        </Card>
      </motion.section>

      <section className="home-links">
        <Card onClick={() => onNavigate('dreams')}>
          <p className="eyebrow">Future</p>
          <h3 className="link-title">Dream Board</h3>
          <p className="muted">Places your heart is saving for.</p>
        </Card>
        <Card onClick={() => onNavigate('stories')}>
          <p className="eyebrow">Journal</p>
          <h3 className="link-title">Latest stories</h3>
          <p className="muted">{data.stories[0]?.title}</p>
        </Card>
      </section>
    </div>
  );
}
