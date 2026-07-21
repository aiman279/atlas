import type { AppView } from '../data/types';
import './BottomNav.css';

const items: { view: AppView; label: string; icon: string }[] = [
  { view: 'home', label: 'Home', icon: '⌂' },
  { view: 'journeys', label: 'Journeys', icon: '◇' },
  { view: 'world', label: 'World', icon: '○' },
  { view: 'profile', label: 'Profile', icon: '☺' },
];

export function BottomNav({
  current,
  onNavigate,
}: {
  current: AppView;
  onNavigate: (v: AppView) => void;
}) {
  const active =
    current === 'journey-detail'
      ? 'journeys'
      : current === 'country'
        ? 'world'
        : current;

  return (
    <nav className="bottom-nav" aria-label="Main">
      {items.map((item) => (
        <button
          key={item.view}
          type="button"
          className={active === item.view ? 'is-active' : undefined}
          onClick={() => onNavigate(item.view)}
          aria-current={active === item.view ? 'page' : undefined}
        >
          <span className="nav-icon" aria-hidden>
            {item.icon}
          </span>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
