import { AnimatePresence, motion } from 'framer-motion';
import type { FabAction } from '../data/types';
import './Fab.css';

const actions: { id: Exclude<FabAction, null>; label: string; hint: string }[] =
  [
    { id: 'goal', label: 'New goal mission', hint: 'Turn a dream into a path' },
    { id: 'brain', label: 'Capture to Brain', hint: 'Idea, lesson, decision' },
    { id: 'reflect', label: 'Weekly reflection', hint: 'AI summary & patterns' },
    { id: 'report', label: 'Monthly report', hint: 'Life progress snapshot' },
    { id: 'project', label: 'Future projection', hint: 'Where compounding leads' },
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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
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
        aria-label={open ? 'Close' : 'Open actions'}
        aria-expanded={open}
      >
        <span aria-hidden>{open ? '×' : '+'}</span>
      </button>
    </div>
  );
}
