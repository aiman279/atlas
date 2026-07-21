import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { BottomNav } from './components/BottomNav';
import type { AppView } from './data/types';
import { WaypointProvider, useWaypoint } from './hooks/useWaypoint';
import { EssentialsView } from './views/EssentialsView';
import { ExploreView } from './views/ExploreView';
import { HomeView } from './views/HomeView';
import { JourneyDetailView } from './views/JourneyDetailView';
import { JourneysView } from './views/JourneysView';
import { ProfileSheet } from './views/ProfileSheet';
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
  const { journey, addExpense, addMemoryNote } = useWaypoint();
  const [view, setView] = useState<AppView>('home');
  const [journeyId, setJourneyId] = useState<string | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [expenseOpen, setExpenseOpen] = useState(false);
  const [memoryOpen, setMemoryOpen] = useState(false);
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseNote, setExpenseNote] = useState('');
  const [memoryText, setMemoryText] = useState('');

  function navigate(next: AppView, id?: string) {
    if (next === 'journey-detail' && id) setJourneyId(id);
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

  function submitMemory() {
    if (!memoryText.trim()) return;
    addMemoryNote(journey.id, memoryText.trim());
    setMemoryText('');
    setMemoryOpen(false);
  }

  return (
    <div className="app-shell">
      <main className="app-main">
        <AnimatePresence mode="wait">
          <motion.div
            key={view === 'journey-detail' ? `j-${journeyId}` : view}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}
          >
            {view === 'home' && (
              <HomeView
                onNavigate={navigate}
                onOpenProfile={() => setProfileOpen(true)}
                onQuickExpense={() => setExpenseOpen(true)}
                onAddMemory={() => setMemoryOpen(true)}
              />
            )}
            {view === 'journeys' && (
              <JourneysView
                onOpen={(id) => navigate('journey-detail', id)}
              />
            )}
            {view === 'journey-detail' && journeyId && (
              <JourneyDetailView
                journeyId={journeyId}
                onBack={() => navigate('journeys')}
              />
            )}
            {view === 'essentials' && <EssentialsView />}
            {view === 'explore' && <ExploreView />}
          </motion.div>
        </AnimatePresence>
      </main>

      <BottomNav current={view} onNavigate={navigate} />

      {profileOpen && <ProfileSheet onClose={() => setProfileOpen(false)} />}

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
              <button
                type="button"
                className="ghost"
                onClick={() => setExpenseOpen(false)}
              >
                Cancel
              </button>
              <button type="button" className="primary" onClick={submitExpense}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {memoryOpen && (
        <div className="modal-backdrop" role="presentation">
          <div className="modal" role="dialog" aria-label="Add memory">
            <h3>Add Memory</h3>
            <p className="muted mb-sm">
              For {journey.flag} {journey.title}
            </p>
            <label>
              What do you want to remember?
              <textarea
                value={memoryText}
                onChange={(e) => setMemoryText(e.target.value)}
                rows={4}
                placeholder="A moment, a feeling, a lesson…"
              />
            </label>
            <div className="modal-actions">
              <button
                type="button"
                className="ghost"
                onClick={() => setMemoryOpen(false)}
              >
                Cancel
              </button>
              <button type="button" className="primary" onClick={submitMemory}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
