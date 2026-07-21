import { motion } from 'framer-motion';
import { formatFullDate } from '../data/atlas';
import { useAtlas } from '../hooks/useAtlas';
import { PageHeader, ProgressBar } from '../components/ui';

export function AchievementsView() {
  const { data } = useAtlas();
  const { explorer, achievements } = data;
  const xpPct = Math.round((explorer.xp / explorer.xpToNext) * 100);

  return (
    <div className="view">
      <PageHeader
        eyebrow="Achievement system"
        title="Wins"
        subtitle="Milestones that mark who you are becoming."
      />

      <motion.section
        className="level-card card soft-pad"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="eyebrow">Explorer level</p>
        <h2 className="level-num">Level {explorer.level}</h2>
        <p className="xp-line">
          XP {explorer.xp.toLocaleString()} / {explorer.xpToNext.toLocaleString()}
        </p>
        <ProgressBar progress={xpPct} />
      </motion.section>

      <div className="achievements-grid">
        {achievements.map((a, i) => (
          <motion.article
            key={a.id}
            className={`achievement card${a.unlocked ? '' : ' is-locked'}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <span className="achievement-icon" aria-hidden>
              {a.icon}
            </span>
            <h3>{a.title}</h3>
            <p>{a.description}</p>
            <div className="achievement-foot">
              <span>+{a.xp} XP</span>
              {a.unlocked && a.unlockedAt ? (
                <span>{formatFullDate(a.unlockedAt)}</span>
              ) : (
                <span>Locked</span>
              )}
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
