import { useState, type FormEvent, type ReactNode } from 'react';
import { COUNTRY_OPTIONS } from '../data/countries';
import type { BrainCategory, FabAction } from '../data/types';
import { useNorth } from '../hooks/useNorth';
import {
  categorizeBrain,
  futureProjection,
  monthlyReport,
  weeklyReflection,
} from '../lib/ai';
import { uid } from '../lib/images';
import { Sheet } from './Sheet';

export function ActionSheets({
  action,
  onClose,
  onCreatedGoal,
  onCreatedCountry,
}: {
  action: FabAction;
  onClose: () => void;
  onCreatedGoal?: (id: string) => void;
  onCreatedCountry?: () => void;
}) {
  return (
    <>
      <GoalSheet
        open={action === 'goal'}
        onClose={onClose}
        onCreated={onCreatedGoal}
      />
      <BrainSheet open={action === 'brain'} onClose={onClose} />
      <CountrySheet
        open={action === 'country'}
        onClose={onClose}
        onCreated={onCreatedCountry}
      />
      <ReflectSheet open={action === 'reflect'} onClose={onClose} />
      <ReportSheet open={action === 'report'} onClose={onClose} />
      <ProjectSheet open={action === 'project'} onClose={onClose} />
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

function GoalSheet({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated?: (id: string) => void;
}) {
  const { addGoal } = useNorth();
  const [title, setTitle] = useState('');
  const [vision, setVision] = useState('');
  const [why, setWhy] = useState('');
  const [currentLabel, setCurrent] = useState('');
  const [targetLabel, setTarget] = useState('');
  const [progress, setProgress] = useState(10);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    const id = addGoal({
      title: title.trim(),
      icon: '✦',
      vision: vision.trim() || title.trim(),
      why: why.trim() || 'This matters to who I am becoming.',
      currentLabel: currentLabel.trim() || 'Starting',
      targetLabel: targetLabel.trim() || 'Complete',
      progress: progress / 100,
      timeline: 'Now',
      reflection: '',
      milestones: [
        { id: uid('ms'), title: 'Define the path', done: false },
        { id: uid('ms'), title: 'Build momentum', done: false },
        { id: uid('ms'), title: 'Hit the target', done: false },
      ],
    });
    setTitle('');
    setVision('');
    setWhy('');
    setCurrent('');
    setTarget('');
    setProgress(10);
    onClose();
    onCreated?.(id);
  }

  return (
    <Sheet open={open} title="New goal mission" onClose={onClose}>
      <form className="sheet-form" onSubmit={submit}>
        <Field label="Goal">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Financial Freedom"
            required
          />
        </Field>
        <Field label="Vision">
          <textarea
            value={vision}
            onChange={(e) => setVision(e.target.value)}
            rows={2}
            placeholder="Build enough wealth to have freedom."
          />
        </Field>
        <Field label="Why this matters">
          <textarea
            value={why}
            onChange={(e) => setWhy(e.target.value)}
            rows={2}
          />
        </Field>
        <Field label="Current">
          <input
            value={currentLabel}
            onChange={(e) => setCurrent(e.target.value)}
            placeholder="RM50,000"
          />
        </Field>
        <Field label="Target">
          <input
            value={targetLabel}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="RM500,000"
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
          Create mission
        </button>
      </form>
    </Sheet>
  );
}

function BrainSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addBrain } = useNorth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [preview, setPreview] = useState<ReturnType<typeof categorizeBrain> | null>(
    null,
  );

  function analyze() {
    if (!title.trim() && !content.trim()) return;
    setPreview(categorizeBrain(title, content));
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    const ai = preview ?? categorizeBrain(title, content);
    addBrain({
      title: title.trim(),
      content: content.trim(),
      category: ai.category as BrainCategory,
      related: ai.related,
      potential: ai.potential,
      tags: ai.tags,
      date: new Date().toISOString().slice(0, 10),
    });
    setTitle('');
    setContent('');
    setPreview(null);
    onClose();
  }

  return (
    <Sheet open={open} title="Capture to Brain" onClose={onClose}>
      <form className="sheet-form" onSubmit={submit}>
        <Field label="Title">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Build a SaaS product"
            required
          />
        </Field>
        <Field label="Content">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            placeholder="What is the idea, lesson, or decision?"
          />
        </Field>
        <button type="button" className="btn-ghost full" onClick={analyze}>
          AI categorize
        </button>
        {preview && (
          <div className="ai-preview">
            <p>
              <strong>Category</strong> {preview.category}
            </p>
            <p>
              <strong>Related</strong> {preview.related}
            </p>
            <p>
              <strong>Potential</strong> {preview.potential}
            </p>
          </div>
        )}
        <button type="submit" className="btn-primary">
          Save to vault
        </button>
      </form>
    </Sheet>
  );
}

function CountrySheet({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
}) {
  const { data, addCountry } = useNorth();
  const available = COUNTRY_OPTIONS.filter(
    (opt) => !data.atlas.some((c) => c.isoNumeric === opt.isoNumeric),
  );
  const [iso, setIso] = useState('');
  const [visitedAt, setVisitedAt] = useState('');
  const [trips, setTrips] = useState('1');
  const [days, setDays] = useState('7');
  const [cities, setCities] = useState('');

  function submit(e: FormEvent) {
    e.preventDefault();
    const opt = COUNTRY_OPTIONS.find((c) => c.isoNumeric === iso);
    if (!opt) return;
    addCountry({
      name: opt.name,
      flag: opt.flag,
      isoNumeric: opt.isoNumeric,
      continent: opt.continent,
      visitedAt: visitedAt.trim() || 'Recently',
      trips: Math.max(1, Number(trips) || 1),
      days: Math.max(1, Number(days) || 1),
      cities: cities
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean),
    });
    setIso('');
    setVisitedAt('');
    setTrips('1');
    setDays('7');
    setCities('');
    onClose();
    onCreated?.();
  }

  return (
    <Sheet open={open} title="Add country" onClose={onClose}>
      <form className="sheet-form" onSubmit={submit}>
        <Field label="Country">
          <select
            value={iso}
            onChange={(e) => setIso(e.target.value)}
            required
          >
            <option value="">Select a country</option>
            {available.map((c) => (
              <option key={c.isoNumeric} value={c.isoNumeric}>
                {c.flag} {c.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Visited">
          <input
            value={visitedAt}
            onChange={(e) => setVisitedAt(e.target.value)}
            placeholder="March 2027"
          />
        </Field>
        <Field label="Trips">
          <input
            type="number"
            min={1}
            value={trips}
            onChange={(e) => setTrips(e.target.value)}
          />
        </Field>
        <Field label="Days">
          <input
            type="number"
            min={1}
            value={days}
            onChange={(e) => setDays(e.target.value)}
          />
        </Field>
        <Field label="Cities (comma separated)">
          <input
            value={cities}
            onChange={(e) => setCities(e.target.value)}
            placeholder="Tokyo, Kyoto"
          />
        </Field>
        <button type="submit" className="btn-primary" disabled={!iso}>
          Add to Atlas
        </button>
      </form>
    </Sheet>
  );
}

function ReflectSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<ReturnType<typeof weeklyReflection> | null>(
    null,
  );

  function run(e: FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    setResult(weeklyReflection(input));
  }

  return (
    <Sheet open={open} title="Weekly reflection AI" onClose={onClose}>
      <form className="sheet-form" onSubmit={run}>
        <Field label="What happened this week?">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={4}
            placeholder="Shipped features, saved consistently, felt distracted mid-week…"
            required
          />
        </Field>
        <button type="submit" className="btn-primary">
          Generate reflection
        </button>
      </form>
      {result && (
        <div className="ai-result">
          <p className="eyebrow">Summary</p>
          <p>{result.summary}</p>
          <p className="eyebrow spaced">Patterns</p>
          <ul>
            {result.patterns.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <p className="eyebrow spaced">Lessons</p>
          <ul>
            {result.lessons.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <p className="eyebrow spaced">Suggestions</p>
          <ul>
            {result.suggestions.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
      )}
    </Sheet>
  );
}

function ReportSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { data } = useNorth();
  const wealth = data.lifeAreas.find((a) => a.id === 'wealth')?.progress ?? 0;
  const career = data.lifeAreas.find((a) => a.id === 'career')?.progress ?? 0;
  const knowledge =
    data.lifeAreas.find((a) => a.id === 'knowledge')?.progress ?? 0;
  const milestones = data.goals.flatMap((g) => g.milestones);
  const report = monthlyReport({
    wealthProgress: wealth,
    careerProgress: career,
    knowledgeProgress: knowledge,
    goalsDone: milestones.filter((m) => m.done).length,
    goalsTotal: milestones.length || 1,
  });

  return (
    <Sheet open={open} title="Monthly life report" onClose={onClose}>
      <div className="ai-result">
        <p className="eyebrow">Money progress</p>
        <p>{report.money}</p>
        <p className="eyebrow spaced">Career growth</p>
        <p>{report.career}</p>
        <p className="eyebrow spaced">Personal development</p>
        <p>{report.development}</p>
        <p className="eyebrow spaced">Achievements</p>
        <p>{report.achievements}</p>
      </div>
    </Sheet>
  );
}

function ProjectSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [monthly, setMonthly] = useState(2000);
  const [years, setYears] = useState(5);
  const result = futureProjection(monthly, years);

  return (
    <Sheet open={open} title="Future projection" onClose={onClose}>
      <div className="sheet-form">
        <Field label={`Monthly save — RM${monthly.toLocaleString()}`}>
          <input
            type="range"
            min={500}
            max={10000}
            step={100}
            value={monthly}
            onChange={(e) => setMonthly(Number(e.target.value))}
          />
        </Field>
        <Field label={`Horizon — ${years} years`}>
          <input
            type="range"
            min={1}
            max={15}
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
          />
        </Field>
        <div className="projection-hero">
          <p className="focus-label">Estimated wealth</p>
          <p className="projection-num">{result.estimated}</p>
          <p className="projection-note">{result.note}</p>
        </div>
      </div>
    </Sheet>
  );
}
