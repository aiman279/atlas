import { motion } from 'framer-motion';
import type { AppView } from '../data/types';
import { useAtlas } from '../hooks/useAtlas';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export function HomeView({
  onNavigate,
}: {
  onNavigate: (view: AppView, id?: string) => void;
}) {
  const { data, currentChapter } = useAtlas();
  const { profile } = data;
  const chapter = currentChapter;

  return (
    <div className="page home-page">
      <header className="home-brand">
        <motion.p
          className="brand-mark"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Atlas
        </motion.p>
        <motion.p
          className="home-greeting"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
        >
          {greeting()}, {profile.name}
        </motion.p>
      </header>

      <motion.section
        className="home-hero"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.12 }}
        onClick={() => chapter && onNavigate('chapter-detail', chapter.id)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && chapter)
            onNavigate('chapter-detail', chapter.id);
        }}
      >
        <img
          src={chapter?.coverImage}
          alt=""
          className="home-hero-img"
        />
        <div className="home-hero-veil" />
        <div className="home-hero-copy">
          <p className="eyebrow">Current chapter</p>
          <h1>“{chapter?.title ?? 'Building My Future'}”</h1>
          <p className="home-hero-sub">
            {chapter?.subtitle ?? 'Creating a life I am proud of.'}
          </p>
        </div>
      </motion.section>

      <motion.section
        className="home-focus"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.28 }}
      >
        <p className="eyebrow">Current focus</p>
        <ul className="focus-grid">
          {profile.focusAreas.map((f) => (
            <li key={f.id}>
              <span aria-hidden>{f.icon}</span>
              <span>{f.label}</span>
            </li>
          ))}
        </ul>
      </motion.section>

      <motion.section
        className="home-milestone"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.36 }}
      >
        <p className="eyebrow">Next milestone</p>
        <h2>{profile.nextMilestone.title}</h2>
        <p className="milestone-meta">
          <span>{profile.nextMilestone.daysAway} days away</span>
        </p>
      </motion.section>
    </div>
  );
}
