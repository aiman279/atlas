import { motion } from 'framer-motion';
import { useNorth } from '../hooks/useNorth';

export function IdentityView() {
  const { data, setTheme } = useNorth();
  const { profile, theme } = data;

  return (
    <div className="page">
      <header className="page-head identity-head">
        {profile.photo ? (
          <img src={profile.photo} alt="" className="id-avatar" />
        ) : (
          <div className="id-avatar id-fallback" aria-hidden>
            {profile.name.slice(0, 1)}
          </div>
        )}
        <h1>{profile.name}</h1>
        <p className="archetype">{profile.archetype}</p>
      </header>

      <motion.section
        className="glass detail-block"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="eyebrow">Values</p>
        <ul className="pill-list">
          {profile.values.map((v) => (
            <li key={v}>{v}</li>
          ))}
        </ul>
      </motion.section>

      <motion.section
        className="glass detail-block"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.06 }}
      >
        <p className="eyebrow">Personal rules</p>
        <ul className="rule-list">
          {profile.rules.map((r) => (
            <li key={r}>“{r}”</li>
          ))}
        </ul>
      </motion.section>

      <motion.section
        className="glass detail-block"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <p className="eyebrow">Operating manual</p>
        <p className="focus-label">I work best when</p>
        <ul className="manual-list">
          {profile.workBestWhen.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
        <p className="focus-label spaced">I struggle when</p>
        <ul className="manual-list">
          {profile.struggleWhen.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      </motion.section>

      <motion.section
        className="glass detail-block"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.14 }}
      >
        <p className="eyebrow">Theme</p>
        <div className="theme-switch">
          <button
            type="button"
            className={theme.mode === 'dark' ? 'is-active' : ''}
            onClick={() => setTheme({ mode: 'dark' })}
          >
            Dark
          </button>
          <button
            type="button"
            className={theme.mode === 'light' ? 'is-active' : ''}
            onClick={() => setTheme({ mode: 'light' })}
          >
            Light
          </button>
        </div>
      </motion.section>
    </div>
  );
}
