import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { BottomNav } from './components/BottomNav';
import type { AppView } from './data/types';
import { AtlasProvider } from './hooks/useAtlas';
import { AchievementsView } from './views/AchievementsView';
import { DreamsView } from './views/DreamsView';
import { FundView } from './views/FundView';
import { HomeView } from './views/HomeView';
import { JourneyDetailView } from './views/JourneyDetailView';
import { JourneysView } from './views/JourneysView';
import { MapView } from './views/MapView';
import { StoriesView } from './views/StoriesView';
import './styles/global.css';
import './views/views.css';

export default function App() {
  return (
    <AtlasProvider>
      <AtlasApp />
    </AtlasProvider>
  );
}

function AtlasApp() {
  const [view, setView] = useState<AppView>('home');
  const [journeyId, setJourneyId] = useState<string | null>(null);

  function navigate(next: AppView, id?: string) {
    if (next === 'journey-detail' && id) {
      setJourneyId(id);
    }
    setView(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="app-shell">
      <main className="app-main">
        <AnimatePresence mode="wait">
          <motion.div
            key={view === 'journey-detail' ? `journey-${journeyId}` : view}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
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
            {view === 'stories' && <StoriesView />}
            {view === 'map' && <MapView />}
            {view === 'achievements' && <AchievementsView />}
            {view === 'fund' && <FundView />}
            {view === 'dreams' && (
              <DreamsView onBack={() => navigate('home')} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
      <BottomNav current={view} onNavigate={navigate} />
    </div>
  );
}
