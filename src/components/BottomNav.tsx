import type { AppView } from '../data/types';
import './BottomNav.css';

const items: { view: AppView; label: string; icon: string }[] = [
  { view: 'home', label: 'Home', icon: '🏠' },
  { view: 'journeys', label: 'Journeys', icon: '🌍' },
  { view: 'stories', label: 'Stories', icon: '📖' },
  { view: 'map', label: 'Map', icon: '🗺️' },
  { view: 'achievements', label: 'Wins', icon: '⚡' },
  { view: 'fund', label: 'Fund', icon: '💰' },
];

export function BottomNav({
  current,
  onNavigate,
}: {
  current: AppView;
  onNavigate: (view: AppView) => void;
}) {
  const active =
    current === 'journey-detail'
      ? 'journeys'
      : current === 'dreams'
        ? 'home'
        : current;

  return (
    <nav className="bottom-nav" aria-label="Main">
      {items.map((item) => (
        <button
          key={item.view}
          type="button"
          className={`bottom-nav-item${active === item.view ? ' is-active' : ''}`}
          onClick={() => onNavigate(item.view)}
          aria-current={active === item.view ? 'page' : undefined}
        >
          <span className="bottom-nav-icon" aria-hidden>
            {item.icon}
          </span>
          <span className="bottom-nav-label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
