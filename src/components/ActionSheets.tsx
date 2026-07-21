import { useMemo, useState } from 'react';
import { ImagePicker } from './ImagePicker';
import { Sheet } from './Sheet';
import { useWaypoint } from '../hooks/useWaypoint';
import type { FabAction } from '../data/types';
import { nextJourney } from '../data/waypoint';

export function ActionSheets({
  action,
  onClose,
  onCreatedJourney,
  onCreatedCountry,
}: {
  action: FabAction;
  onClose: () => void;
  onCreatedJourney?: (id: string) => void;
  onCreatedCountry?: (id: string) => void;
}) {
  const {
    data,
    addJourney,
    addMemory,
    addDestination,
    addExpense,
  } = useWaypoint();

  return (
    <>
      <CreateJourneySheet
        open={action === 'journey'}
        onClose={onClose}
        onSubmit={(payload) => {
          const id = addJourney(payload);
          onClose();
          onCreatedJourney?.(id);
        }}
      />
      <AddMemorySheet
        open={action === 'memory'}
        journeys={data.journeys}
        defaultJourneyId={nextJourney(data)?.id}
        onClose={onClose}
        onSubmit={(payload) => {
          addMemory(payload);
          onClose();
          onCreatedJourney?.(payload.journeyId);
        }}
      />
      <AddDestinationSheet
        open={action === 'destination'}
        onClose={onClose}
        onSubmit={(payload) => {
          const id = addDestination(payload);
          onClose();
          onCreatedCountry?.(id);
        }}
      />
      <AddExpenseSheet
        open={action === 'expense'}
        onClose={onClose}
        onSubmit={(amount, note) => {
          addExpense(amount, note);
          onClose();
        }}
      />
    </>
  );
}

function CreateJourneySheet({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    country: string;
    flag: string;
    cities: string;
    startDate: string;
    durationDays: number;
    coverImage: string;
    reflection?: string;
  }) => void;
}) {
  const [country, setCountry] = useState('');
  const [flag, setFlag] = useState('✈️');
  const [cities, setCities] = useState('');
  const [startDate, setStartDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [days, setDays] = useState('7');
  const [cover, setCover] = useState('');
  const [reflection, setReflection] = useState('');

  const canSave = country.trim() && cover && Number(days) > 0;

  return (
    <Sheet open={open} title="New journey" onClose={onClose}>
      <div className="form-stack">
        <ImagePicker
          label="Add a cover photo"
          value={cover}
          onChange={setCover}
          tall
        />
        <label>
          Country
          <input
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="Japan"
          />
        </label>
        <label>
          Flag emoji
          <input
            value={flag}
            onChange={(e) => setFlag(e.target.value)}
            placeholder="🇯🇵"
          />
        </label>
        <label>
          Cities
          <input
            value={cities}
            onChange={(e) => setCities(e.target.value)}
            placeholder="Tokyo, Kyoto"
          />
        </label>
        <label>
          Date
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
        <label>
          Duration (days)
          <input
            type="number"
            min={1}
            value={days}
            onChange={(e) => setDays(e.target.value)}
          />
        </label>
        <label>
          A note for later
          <textarea
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="What do you hope this journey becomes?"
          />
        </label>
        <div className="form-actions">
          <button type="button" className="btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="btn-primary"
            disabled={!canSave}
            onClick={() =>
              onSubmit({
                country: country.trim(),
                flag: flag.trim() || '✈️',
                cities,
                startDate,
                durationDays: Number(days) || 1,
                coverImage: cover,
                reflection: reflection.trim(),
              })
            }
          >
            Create journey
          </button>
        </div>
      </div>
    </Sheet>
  );
}

function AddMemorySheet({
  open,
  journeys,
  defaultJourneyId,
  onClose,
  onSubmit,
}: {
  open: boolean;
  journeys: { id: string; country: string; flag: string }[];
  defaultJourneyId?: string;
  onClose: () => void;
  onSubmit: (payload: {
    journeyId: string;
    url: string;
    title: string;
    description: string;
    date: string;
    location: string;
  }) => void;
}) {
  const [journeyId, setJourneyId] = useState(defaultJourneyId || '');
  const [photo, setPhoto] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [location, setLocation] = useState('');

  const activeId = useMemo(
    () => journeyId || defaultJourneyId || journeys[0]?.id || '',
    [journeyId, defaultJourneyId, journeys],
  );

  const canSave = Boolean(photo && title.trim() && activeId);

  return (
    <Sheet open={open} title="Add a memory" onClose={onClose}>
      <div className="form-stack">
        <ImagePicker
          label="Choose a moment"
          value={photo}
          onChange={setPhoto}
          tall
        />
        <label>
          Title
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="The morning light"
          />
        </label>
        <label>
          Description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What made this moment stay with you?"
          />
        </label>
        <label>
          Journey
          <select
            value={activeId}
            onChange={(e) => setJourneyId(e.target.value)}
          >
            {journeys.map((j) => (
              <option key={j.id} value={j.id}>
                {j.flag} {j.country}
              </option>
            ))}
          </select>
        </label>
        <label>
          Date
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
        <label>
          Location
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Kyoto"
          />
        </label>
        <div className="form-actions">
          <button type="button" className="btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="btn-primary"
            disabled={!canSave}
            onClick={() =>
              onSubmit({
                journeyId: activeId,
                url: photo,
                title: title.trim(),
                description: description.trim(),
                date,
                location: location.trim() || 'Somewhere',
              })
            }
          >
            Save memory
          </button>
        </div>
      </div>
    </Sheet>
  );
}

function AddDestinationSheet({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    country: string;
    flag: string;
    dream: string;
    targetYear: number;
    coverImage: string;
    kind: 'visited' | 'dream';
  }) => void;
}) {
  const [country, setCountry] = useState('');
  const [flag, setFlag] = useState('🌍');
  const [dream, setDream] = useState('');
  const [year, setYear] = useState(String(new Date().getFullYear() + 1));
  const [kind, setKind] = useState<'visited' | 'dream'>('dream');
  const [cover, setCover] = useState('');

  const canSave = country.trim() && cover;

  return (
    <Sheet open={open} title="Add destination" onClose={onClose}>
      <div className="form-stack">
        <ImagePicker
          label="Add a destination photo"
          value={cover}
          onChange={setCover}
          tall
        />
        <label>
          Type
          <select
            value={kind}
            onChange={(e) => setKind(e.target.value as 'visited' | 'dream')}
          >
            <option value="dream">Dreaming</option>
            <option value="visited">Visited</option>
          </select>
        </label>
        <label>
          Country
          <input
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="Iceland"
          />
        </label>
        <label>
          Flag emoji
          <input value={flag} onChange={(e) => setFlag(e.target.value)} />
        </label>
        <label>
          {kind === 'dream' ? 'Dream' : 'Memory note'}
          <input
            value={dream}
            onChange={(e) => setDream(e.target.value)}
            placeholder="See the northern lights"
          />
        </label>
        <label>
          Target year
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
        </label>
        <div className="form-actions">
          <button type="button" className="btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="btn-primary"
            disabled={!canSave}
            onClick={() =>
              onSubmit({
                country: country.trim(),
                flag: flag.trim() || '🌍',
                dream: dream.trim(),
                targetYear: Number(year) || new Date().getFullYear(),
                coverImage: cover,
                kind,
              })
            }
          >
            Add destination
          </button>
        </div>
      </div>
    </Sheet>
  );
}

function AddExpenseSheet({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (amount: number, note: string) => void;
}) {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const canSave = Number(amount) > 0;

  return (
    <Sheet open={open} title="Add expense" onClose={onClose}>
      <div className="form-stack">
        <label>
          Amount (RM)
          <input
            type="number"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="120"
          />
        </label>
        <label>
          What for?
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Train pass"
          />
        </label>
        <div className="form-actions">
          <button type="button" className="btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="btn-primary"
            disabled={!canSave}
            onClick={() => onSubmit(Number(amount), note.trim())}
          >
            Save expense
          </button>
        </div>
      </div>
    </Sheet>
  );
}
