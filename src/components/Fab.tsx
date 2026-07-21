import { AnimatePresence, motion } from 'framer-motion';
import type { FabAction } from '../data/types';
import './Fab.css';

const actions: { id: Exclude<FabAction, null>; label: string; hint: string }[] =
  [
    { id: 'chapter', label: 'Create Chapter', hint: 'A new period of your life' },
    { id: 'memory', label: 'Add Memory', hint: 'A moment worth keeping' },
    { id: 'goal', label: 'Add Goal', hint: 'Something you are becoming' },
    {
      id: 'achievement',
      label: 'Add Achievement',
      hint: 'A milestone you earned',
    },
  ];

export function Fab({
  open,
  onToggle,
  onSelect,
}: {
  open: boolean;
  onToggle: () => void;
  onSelect: (action: Exclude<FabAction, null>) => void;
}) {
  return (
    <div className="fab-root">
      <AnimatePresence>
        {open && (
          <motion.div
            className="fab-menu"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
          >
            {actions.map((a) => (
              <button
                key={a.id}
                type="button"
                className="fab-option"
                onClick={() => onSelect(a.id)}
              >
                <span>{a.label}</span>
                <small>{a.hint}</small>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        type="button"
        className={`fab-btn${open ? ' is-open' : ''}`}
        onClick={onToggle}
        aria-label={open ? 'Close' : 'Add to your story'}
        aria-expanded={open}
      >
        <span aria-hidden>{open ? '×' : '+'}</span>
      </button>
    </div>
  );
}
