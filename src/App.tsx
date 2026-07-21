import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { ActionSheets } from './components/ActionSheets';
import { BottomNav } from './components/BottomNav';
import { Fab } from './components/Fab';
import type { AppView, FabAction } from './data/types';
import { NorthProvider } from './hooks/useNorth';
import { BrainView } from './views/BrainView';
import { AtlasView } from './views/AtlasView';
import { CommandView } from './views/CommandView';
import { EvolutionView } from './views/EvolutionView';
import { GoalDetailView } from './views/GoalDetailView';
import { GoalsView } from './views/GoalsView';
import { IdentityView } from './views/IdentityView';
import './styles/global.css';
import './views/views.css';

export default function App() {
  return (
    <NorthProvider>
      <NorthApp />
    </NorthProvider>
  );
}

function NorthApp() {
  const [view, setView] = useState<AppView>('command');
  const [goalId, setGoalId] = useState<string | null>(null);
  const [fabOpen, setFabOpen] = useState(false);
  const [action, setAction] = useState<FabAction>(null);

  function navigate(next: AppView, id?: string) {
    if (next === 'goal-detail' && id) setGoalId(id);
    setView(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const key = view === 'goal-detail' ? `g-${goalId}` : view;

  return (
    <div className="app-shell">
      <div className="ambient" aria-hidden />
      <main className="app-main">
        <AnimatePresence mode="wait">
          <motion.div
            key={key}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {view === 'command' && <CommandView />}
            {view === 'goals' && (
              <GoalsView onOpen={(id) => navigate('goal-detail', id)} />
            )}
            {view === 'goal-detail' && goalId && (
              <GoalDetailView
                goalId={goalId}
                onBack={() => navigate('goals')}
              />
            )}
            {view === 'brain' && <BrainView />}
            {view === 'atlas' && (
              <AtlasView onAdd={() => setAction('country')} />
            )}
            {view === 'evolution' && <EvolutionView />}
            {view === 'identity' && <IdentityView />}
          </motion.div>
        </AnimatePresence>
      </main>

      <Fab
        open={fabOpen}
        onToggle={() => setFabOpen((v) => !v)}
        onSelect={(a) => {
          setFabOpen(false);
          setAction(a);
        }}
      />

      <ActionSheets
        action={action}
        onClose={() => setAction(null)}
        onCreatedGoal={(id) => navigate('goal-detail', id)}
        onCreatedCountry={() => navigate('atlas')}
      />

      <BottomNav current={view} onNavigate={navigate} />
    </div>
  );
}
