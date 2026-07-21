import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { BottomNav } from './components/BottomNav';
import type { AppView } from './data/types';
import { WaypointProvider } from './hooks/useWaypoint';
import { CountryView } from './views/CountryView';
import { HomeView } from './views/HomeView';
import { JourneyDetailView } from './views/JourneyDetailView';
import { JourneysView } from './views/JourneysView';
import { ProfileView } from './views/ProfileView';
import { WorldView } from './views/WorldView';
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
  const [view, setView] = useState<AppView>('home');
  const [journeyId, setJourneyId] = useState<string | null>(null);
  const [countryId, setCountryId] = useState<string | null>(null);

  function navigate(next: AppView, id?: string) {
    if (next === 'journey-detail' && id) setJourneyId(id);
    if (next === 'country' && id) setCountryId(id);
    setView(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const key =
    view === 'journey-detail'
      ? `j-${journeyId}`
      : view === 'country'
        ? `c-${countryId}`
        : view;

  return (
    <div className="app-shell">
      <main className="app-main">
        <AnimatePresence mode="wait">
          <motion.div
            key={key}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            {view === 'home' && <HomeView onNavigate={navigate} />}
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
            {view === 'world' && (
              <WorldView onOpenCountry={(id) => navigate('country', id)} />
            )}
            {view === 'country' && countryId && (
              <CountryView
                countryId={countryId}
                onBack={() => navigate('world')}
              />
            )}
            {view === 'profile' && <ProfileView />}
          </motion.div>
        </AnimatePresence>
      </main>
      <BottomNav current={view} onNavigate={navigate} />
    </div>
  );
}
