import type { AppView } from '../data/types';
import './BottomNav.css';

const tabs: { id: AppView; label: string; icon: string }[] = [
  { id: 'home', label: 'Home', icon: '⌂' },
  { id: 'chapters', label: 'Chapters', icon: '☰' },
  { id: 'memories', label: 'Memories', icon: '◎' },
  { id: 'me', label: 'Me', icon: '○' },
];

export function BottomNav({
  current,
  onNavigate,
}: {
  current: AppView;
  onNavigate: (view: AppView) => void;
}) {
  const active =
    current === 'chapter-detail'
      ? 'chapters'
      : current === 'memory-detail'
        ? 'memories'
        : current;

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
          <span className="nav-icon" aria-hidden>
            {tab.icon}
          </span>
          <span className="nav-label">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
