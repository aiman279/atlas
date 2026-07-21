import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { BottomNav } from './components/BottomNav';
import type { AppView } from './data/types';
import { WaypointProvider, useWaypoint } from './hooks/useWaypoint';
import { DashboardView } from './views/DashboardView';
import { ExploreView } from './views/ExploreView';
import { FundView } from './views/FundView';
import { GearView } from './views/GearView';
import { MissionDetailView } from './views/MissionDetailView';
import { MissionsView } from './views/MissionsView';
import { ProfileView } from './views/ProfileView';
import './styles/global.css';
import './views/views.css';

export default function App() {
  return (
    <WaypointProvider>
      <WaypointApp />
    </WaypointProvider>
  );
}

function WaypointApp() {
  const { addExpense } = useWaypoint();
  const [view, setView] = useState<AppView>('dashboard');
  const [missionId, setMissionId] = useState<string | null>(null);
  const [expenseOpen, setExpenseOpen] = useState(false);
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseNote, setExpenseNote] = useState('');

  function navigate(next: AppView, id?: string) {
    if (next === 'mission-detail' && id) setMissionId(id);
    setView(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function submitExpense() {
    const amount = Number(expenseAmount);
    if (!amount || amount <= 0) return;
    addExpense(amount, expenseNote.trim() || 'Quick expense');
    setExpenseAmount('');
    setExpenseNote('');
    setExpenseOpen(false);
  }

  return (
    <div className="app-shell">
      <main className="app-main">
        <AnimatePresence mode="wait">
          <motion.div
            key={view === 'mission-detail' ? `m-${missionId}` : view}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}
          >
            {view === 'dashboard' && (
              <DashboardView
                onNavigate={navigate}
                onQuickExpense={() => setExpenseOpen(true)}
              />
            )}
            {view === 'missions' && (
              <MissionsView
                onOpen={(id) => navigate('mission-detail', id)}
              />
            )}
            {view === 'mission-detail' && missionId && (
              <MissionDetailView
                missionId={missionId}
                onBack={() => navigate('missions')}
              />
            )}
            {view === 'gear' && <GearView />}
            {view === 'fund' && <FundView />}
            {view === 'explore' && <ExploreView />}
            {view === 'profile' && <ProfileView />}
          </motion.div>
        </AnimatePresence>
      </main>

      <BottomNav current={view} onNavigate={navigate} />

      {expenseOpen && (
        <div className="modal-backdrop" role="presentation">
          <div className="modal" role="dialog" aria-label="Add expense">
            <h3>Add Expense</h3>
            <label>
              Amount (RM)
              <input
                type="number"
                inputMode="decimal"
                value={expenseAmount}
                onChange={(e) => setExpenseAmount(e.target.value)}
                placeholder="100"
              />
            </label>
            <label>
              Note
              <input
                type="text"
                value={expenseNote}
                onChange={(e) => setExpenseNote(e.target.value)}
                placeholder="What for?"
              />
            </label>
            <div className="modal-actions">
              <button type="button" className="ghost" onClick={() => setExpenseOpen(false)}>
                Cancel
              </button>
              <button type="button" className="primary" onClick={submitExpense}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
