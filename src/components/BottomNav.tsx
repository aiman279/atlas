import type { AppView } from '../data/types';
import './BottomNav.css';

const tabs: { id: AppView; label: string }[] = [
  { id: 'command', label: 'Command' },
  { id: 'goals', label: 'Goals' },
  { id: 'atlas', label: 'Atlas' },
  { id: 'brain', label: 'Brain' },
  { id: 'evolution', label: 'Evolve' },
  { id: 'identity', label: 'Identity' },
];

export function BottomNav({
  current,
  onNavigate,
}: {
  current: AppView;
  onNavigate: (view: AppView) => void;
}) {
  const active = current === 'goal-detail' ? 'goals' : current;

  return (
    <nav className="bottom-nav" aria-label="Main">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={`nav-tab${active === tab.id ? ' is-active' : ''}`}
          onClick={() => onNavigate(tab.id)}
          aria-current={active === tab.id ? 'page' : undefined}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
