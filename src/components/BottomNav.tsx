import type { AppView } from '../data/types';
import './BottomNav.css';

const tabs: { id: AppView; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'chapters', label: 'Chapters' },
  { id: 'memories', label: 'Memories' },
  { id: 'me', label: 'Me' },
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
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
