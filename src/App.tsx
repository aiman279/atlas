import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { ActionSheets } from './components/ActionSheets';
import { BottomNav } from './components/BottomNav';
import { Fab } from './components/Fab';
import type { AppView, FabAction } from './data/types';
import { AtlasProvider } from './hooks/useAtlas';
import { ChapterDetailView } from './views/ChapterDetailView';
import { ChaptersView } from './views/ChaptersView';
import { HomeView } from './views/HomeView';
import { MeView } from './views/MeView';
import { MemoriesView } from './views/MemoriesView';
import { MemoryDetailView } from './views/MemoryDetailView';
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
  const [chapterId, setChapterId] = useState<string | null>(null);
  const [memoryId, setMemoryId] = useState<string | null>(null);
  const [fabOpen, setFabOpen] = useState(false);
  const [action, setAction] = useState<FabAction>(null);

  function navigate(next: AppView, id?: string) {
    if (next === 'chapter-detail' && id) setChapterId(id);
    if (next === 'memory-detail' && id) setMemoryId(id);
    setView(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const key =
    view === 'chapter-detail'
      ? `ch-${chapterId}`
      : view === 'memory-detail'
        ? `mem-${memoryId}`
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
            transition={{ duration: 0.28 }}
          >
            {view === 'home' && <HomeView onNavigate={navigate} />}
            {view === 'chapters' && (
              <ChaptersView
                onOpen={(id) => navigate('chapter-detail', id)}
              />
            )}
            {view === 'chapter-detail' && chapterId && (
              <ChapterDetailView
                chapterId={chapterId}
                onBack={() => navigate('chapters')}
              />
            )}
            {view === 'memories' && (
              <MemoriesView
                onOpen={(id) => navigate('memory-detail', id)}
              />
            )}
            {view === 'memory-detail' && memoryId && (
              <MemoryDetailView
                memoryId={memoryId}
                onBack={() => navigate('memories')}
              />
            )}
            {view === 'me' && <MeView />}
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
        onCreatedChapter={(id) => navigate('chapter-detail', id)}
        onCreatedMemory={(id) => navigate('memory-detail', id)}
      />

      <BottomNav current={view} onNavigate={navigate} />
    </div>
  );
}
