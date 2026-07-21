import { useState } from 'react';
import { formatMoney, formatMonthYear } from '../data/waypoint';
import type { ChecklistGroup } from '../data/types';
import { useWaypoint } from '../hooks/useWaypoint';
import { BackButton, Card, Pill, SectionLabel } from '../components/ui';

const groupLabels: Record<ChecklistGroup, string> = {
  documents: 'Documents',
  transport: 'Transport',
  knowledge: 'Knowledge',
};

export function JourneyDetailView({
  journeyId,
  onBack,
}: {
  journeyId: string;
  onBack: () => void;
}) {
  const { data, toggleChecklist, updateNotes } = useWaypoint();
  const journey = data.journeys.find((j) => j.id === journeyId);
  const [notes, setNotes] = useState(journey?.notes ?? '');

  if (!journey) {
    return (
      <div className="view">
        <BackButton onClick={onBack} />
        <p className="muted">Journey not found.</p>
      </div>
    );
  }

  const groups: ChecklistGroup[] = ['documents', 'transport', 'knowledge'];

  return (
    <div className="view">
      <BackButton onClick={onBack} />
      <div
        className="detail-hero"
        style={{ backgroundImage: `url(${journey.coverImage})` }}
      >
        <div className="detail-hero-veil">
          <Pill tone="blue">{journey.status}</Pill>
          <h1>
            {journey.flag} {journey.title}
          </h1>
          <p>
            {journey.city}, {journey.country}
          </p>
        </div>
      </div>

      <SectionLabel>A. Overview</SectionLabel>
      <Card className="mb overview-grid">
        <div>
          <p className="meta-k">Destination</p>
          <p className="meta-v">
            {journey.flag} {journey.country}
          </p>
        </div>
        <div>
          <p className="meta-k">Dates</p>
          <p className="meta-v">{formatMonthYear(journey.startDate)}</p>
        </div>
        <div>
          <p className="meta-k">Duration</p>
          <p className="meta-v">{journey.durationDays} days</p>
        </div>
        <div>
          <p className="meta-k">Budget</p>
          <p className="meta-v">{formatMoney(journey.budget)}</p>
        </div>
      </Card>

      <SectionLabel>B. Preparation</SectionLabel>
      {groups.map((group) => (
        <Card key={group} className="mb">
          <p className="group-title">{groupLabels[group]}</p>
          <ul className="check-list interactive">
            {journey.checklist
              .filter((c) => c.group === group)
              .map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    className={c.done ? 'done' : 'pending'}
                    onClick={() => toggleChecklist(journey.id, c.id)}
                  >
                    <span aria-hidden>{c.done ? '✓' : '○'}</span>
                    {c.label}
                  </button>
                </li>
              ))}
          </ul>
        </Card>
      ))}

      <SectionLabel>C. Timeline</SectionLabel>
      <Card className="mb">
        <ul className="timeline">
          {journey.timeline.map((d) => (
            <li key={d.day}>
              <span className="day">Day {d.day}</span>
              <div>
                <strong>{d.title}</strong>
                {d.note && <p className="muted">{d.note}</p>}
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <SectionLabel>D. Budget</SectionLabel>
      <Card className="mb">
        <ul className="budget-lines">
          {journey.budgetBreakdown.map((b) => (
            <li key={b.category}>
              <span>{b.category}</span>
              <strong>{formatMoney(b.amount)}</strong>
            </li>
          ))}
          <li className="total">
            <span>Total planned</span>
            <strong>
              {formatMoney(
                journey.budgetBreakdown.reduce((s, b) => s + b.amount, 0),
              )}
            </strong>
          </li>
        </ul>
      </Card>

      <SectionLabel>Notes</SectionLabel>
      <Card className="mb">
        <textarea
          className="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={() => updateNotes(journey.id, notes)}
          rows={3}
          aria-label="Journey notes"
        />
      </Card>

      {journey.memory && (
        <>
          <SectionLabel>E. Memories</SectionLabel>
          <Card className="mb">
            {journey.memory.photos.length > 0 && (
              <div className="photo-strip mb">
                {journey.memory.photos.map((src) => (
                  <img key={src} src={src} alt="" loading="lazy" />
                ))}
              </div>
            )}
            {journey.memory.favouriteMoment && (
              <p className="pull-quote mb-sm">
                “{journey.memory.favouriteMoment}”
              </p>
            )}
            {journey.memory.notes && (
              <p className="muted mb-sm">{journey.memory.notes}</p>
            )}
            {journey.memory.reflection && (
              <div className="mb-sm">
                <p className="meta-k">Reflection</p>
                <p>{journey.memory.reflection}</p>
              </div>
            )}
            {journey.memory.lessonsLearned.length > 0 && (
              <div className="mb-sm">
                <p className="meta-k">Lessons learned</p>
                <ul className="lesson-list">
                  {journey.memory.lessonsLearned.map((l) => (
                    <li key={l}>{l}</li>
                  ))}
                </ul>
              </div>
            )}
            {journey.memory.rating > 0 && (
              <p className="meta-v">{'★'.repeat(journey.memory.rating)}</p>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
