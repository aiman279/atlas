import { useState, type FormEvent, type ReactNode } from 'react';
import type { FabAction } from '../data/types';
import { useAtlas } from '../hooks/useAtlas';
import { ImagePicker } from './ImagePicker';
import { Sheet } from './Sheet';

const defaultCover =
  'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&q=80';

export function ActionSheets({
  action,
  onClose,
  onCreatedChapter,
  onCreatedMemory,
}: {
  action: FabAction;
  onClose: () => void;
  onCreatedChapter?: (id: string) => void;
  onCreatedMemory?: (id: string) => void;
}) {
  return (
    <>
      <ChapterSheet
        open={action === 'chapter'}
        onClose={onClose}
        onCreated={onCreatedChapter}
      />
      <MemorySheet
        open={action === 'memory'}
        onClose={onClose}
        onCreated={onCreatedMemory}
      />
      <GoalSheet open={action === 'goal'} onClose={onClose} />
      <AchievementSheet open={action === 'achievement'} onClose={onClose} />
    </>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}

function ChapterSheet({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated?: (id: string) => void;
}) {
  const { data, addChapter } = useAtlas();
  const [title, setTitle] = useState('');
  const [period, setPeriod] = useState('');
  const [story, setStory] = useState('');
  const [cover, setCover] = useState('');

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    const nextNum =
      Math.max(0, ...data.chapters.map((c) => c.number)) + 1;
    const id = addChapter({
      number: nextNum,
      title: title.trim(),
      period: period.trim() || 'Present',
      coverImage: cover || defaultCover,
      story: story.trim(),
      status: 'current',
    });
    setTitle('');
    setPeriod('');
    setStory('');
    setCover('');
    onClose();
    onCreated?.(id);
  }

  return (
    <Sheet open={open} title="Create Chapter" onClose={onClose}>
      <form className="sheet-form" onSubmit={submit}>
        <ImagePicker
          label="Cover image"
          value={cover}
          onChange={setCover}
          tall
        />
        <Field label="Title">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Building Myself"
            required
          />
        </Field>
        <Field label="Period">
          <input
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            placeholder="2026 — Present"
          />
        </Field>
        <Field label="Story">
          <textarea
            value={story}
            onChange={(e) => setStory(e.target.value)}
            placeholder="What is this chapter about?"
            rows={4}
          />
        </Field>
        <button type="submit" className="btn-primary">
          Create chapter
        </button>
      </form>
    </Sheet>
  );
}

function MemorySheet({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated?: (id: string) => void;
}) {
  const { addMemory } = useAtlas();
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [story, setStory] = useState('');
  const [feeling, setFeeling] = useState('');
  const [image, setImage] = useState('');

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() || !image) return;
    const id = addMemory({
      title: title.trim(),
      date: date || new Date().toISOString().slice(0, 10),
      location: location.trim() || 'Somewhere',
      story: story.trim(),
      feeling: feeling.trim() || 'Present',
      image,
    });
    setTitle('');
    setDate('');
    setLocation('');
    setStory('');
    setFeeling('');
    setImage('');
    onClose();
    onCreated?.(id);
  }

  return (
    <Sheet open={open} title="Add Memory" onClose={onClose}>
      <form className="sheet-form" onSubmit={submit}>
        <ImagePicker
          label="Photo"
          value={image}
          onChange={setImage}
          tall
        />
        <Field label="Title">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="A moment worth keeping"
            required
          />
        </Field>
        <Field label="Date">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </Field>
        <Field label="Location">
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Tokyo"
          />
        </Field>
        <Field label="Story">
          <textarea
            value={story}
            onChange={(e) => setStory(e.target.value)}
            placeholder="What happened?"
            rows={3}
          />
        </Field>
        <Field label="Feeling">
          <input
            value={feeling}
            onChange={(e) => setFeeling(e.target.value)}
            placeholder="Alive, grateful, proud…"
          />
        </Field>
        <button type="submit" className="btn-primary" disabled={!image}>
          Save memory
        </button>
      </form>
    </Sheet>
  );
}

function GoalSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addGoal } = useAtlas();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('✦');
  const [progress, setProgress] = useState(10);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    addGoal({
      title: title.trim(),
      icon: icon || '✦',
      description: description.trim(),
      progress: Math.min(1, Math.max(0, progress / 100)),
    });
    setTitle('');
    setDescription('');
    setIcon('✦');
    setProgress(10);
    onClose();
  }

  return (
    <Sheet open={open} title="Add Goal" onClose={onClose}>
      <form className="sheet-form" onSubmit={submit}>
        <Field label="Title">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Explore the world"
            required
          />
        </Field>
        <Field label="Icon">
          <input
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            placeholder="🌎"
            maxLength={4}
          />
        </Field>
        <Field label="Description">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Why this matters"
          />
        </Field>
        <Field label={`Progress — ${progress}%`}>
          <input
            type="range"
            min={0}
            max={100}
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
          />
        </Field>
        <button type="submit" className="btn-primary">
          Add goal
        </button>
      </form>
    </Sheet>
  );
}

function AchievementSheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { addAchievement } = useAtlas();
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [reflection, setReflection] = useState('');
  const [image, setImage] = useState('');

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    addAchievement({
      title: title.trim(),
      date: date || new Date().toISOString().slice(0, 7),
      description: description.trim(),
      reflection: reflection.trim(),
      image: image || undefined,
    });
    setTitle('');
    setDate('');
    setDescription('');
    setReflection('');
    setImage('');
    onClose();
  }

  return (
    <Sheet open={open} title="Add Achievement" onClose={onClose}>
      <form className="sheet-form" onSubmit={submit}>
        <ImagePicker label="Photo (optional)" value={image} onChange={setImage} />
        <Field label="Title">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Bought my first home"
            required
          />
        </Field>
        <Field label="Date">
          <input
            value={date}
            onChange={(e) => setDate(e.target.value)}
            placeholder="2026-03"
          />
        </Field>
        <Field label="Description">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
          />
        </Field>
        <Field label="Reflection">
          <textarea
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            rows={3}
            placeholder="What did this mean to you?"
          />
        </Field>
        <button type="submit" className="btn-primary">
          Save achievement
        </button>
      </form>
    </Sheet>
  );
}
