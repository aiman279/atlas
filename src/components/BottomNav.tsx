import type { AppView } from '../data/types';
import './BottomNav.css';

const items: { view: AppView; icon: string; label: string }[] = [
  { view: 'home', icon: '🏠', label: 'Home' },
  { view: 'journeys', icon: '🧭', label: 'Journeys' },
  { view: 'essentials', icon: '🎒', label: 'Essentials' },
  { view: 'explore', icon: '🌎', label: 'Explore' },
];

export function BottomNav({
  current,
  onNavigate,
}: {
  current: AppView;
  onNavigate: (v: AppView) => void;
}) {
  const active = current === 'journey-detail' ? 'journeys' : current;

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
          <span aria-hidden>{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
