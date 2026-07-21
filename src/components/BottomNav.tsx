import type { AppView } from '../data/types';
import './BottomNav.css';

const items: { view: AppView; icon: string; label: string }[] = [
  { view: 'dashboard', icon: '🏠', label: 'Home' },
  { view: 'missions', icon: '🧭', label: 'Missions' },
  { view: 'gear', icon: '🎒', label: 'Gear' },
  { view: 'fund', icon: '💰', label: 'Fund' },
  { view: 'explore', icon: '🌎', label: 'Explore' },
  { view: 'profile', icon: '⚙️', label: 'Profile' },
];

export function BottomNav({
  current,
  onNavigate,
}: {
  current: AppView;
  onNavigate: (v: AppView) => void;
}) {
  const active = current === 'mission-detail' ? 'missions' : current;

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
