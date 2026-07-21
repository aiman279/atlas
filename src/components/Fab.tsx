import { AnimatePresence, motion } from 'framer-motion';
import './Fab.css';
import type { FabAction } from '../data/types';

const actions: { id: Exclude<FabAction, null>; label: string; hint: string }[] =
  [
    { id: 'memory', label: 'Add Memory', hint: 'A moment from your journey' },
    { id: 'journey', label: 'Create Journey', hint: 'Start a new chapter' },
    { id: 'destination', label: 'Add Destination', hint: 'Visited or dreaming' },
    { id: 'expense', label: 'Add Expense', hint: 'Track travel spending' },
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
        aria-label={open ? 'Close actions' : 'Add to your story'}
        aria-expanded={open}
      >
        <span aria-hidden>{open ? '×' : '+'}</span>
      </button>
    </div>
  );
}
