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

export function MissionDetailView({
  missionId,
  onBack,
}: {
  missionId: string;
  onBack: () => void;
}) {
  const { data, toggleChecklist, updateNotes } = useWaypoint();
  const mission = data.missions.find((m) => m.id === missionId);
  const [notes, setNotes] = useState(mission?.notes ?? '');

  if (!mission) {
    return (
      <div className="view">
        <BackButton onClick={onBack} />
        <p className="muted">Mission not found.</p>
      </div>
    );
  }

  const groups: ChecklistGroup[] = ['documents', 'transport', 'knowledge'];

  return (
    <div className="view">
      <BackButton onClick={onBack} />
      <div
        className="detail-hero"
        style={{ backgroundImage: `url(${mission.coverImage})` }}
      >
        <div className="detail-hero-veil">
          <Pill tone="blue">{mission.status}</Pill>
          <h1>
            {mission.flag} {mission.title}
          </h1>
          <p>
            {formatMonthYear(mission.startDate)} · {mission.durationDays} days ·{' '}
            {formatMoney(mission.budget)}
          </p>
        </div>
      </div>

      <SectionLabel>A. Preparation</SectionLabel>
      {groups.map((group) => (
        <Card key={group} className="mb">
          <p className="group-title">{groupLabels[group]}</p>
          <ul className="check-list interactive">
            {mission.checklist
              .filter((c) => c.group === group)
              .map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    className={c.done ? 'done' : 'pending'}
                    onClick={() => toggleChecklist(mission.id, c.id)}
                  >
                    <span aria-hidden>{c.done ? '✓' : '○'}</span>
                    {c.label}
                  </button>
                </li>
              ))}
          </ul>
        </Card>
      ))}

      <SectionLabel>B. Timeline</SectionLabel>
      <Card className="mb">
        <ul className="timeline">
          {mission.timeline.map((d) => (
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

      <SectionLabel>C. Budget</SectionLabel>
      <Card className="mb">
        <ul className="budget-lines">
          {mission.budgetBreakdown.map((b) => (
            <li key={b.category}>
              <span>{b.category}</span>
              <strong>{formatMoney(b.amount)}</strong>
            </li>
          ))}
          <li className="total">
            <span>Total planned</span>
            <strong>
              {formatMoney(
                mission.budgetBreakdown.reduce((s, b) => s + b.amount, 0),
              )}
            </strong>
          </li>
        </ul>
      </Card>

      <SectionLabel>D. Notes</SectionLabel>
      <Card>
        <textarea
          className="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={() => updateNotes(mission.id, notes)}
          rows={4}
          aria-label="Mission notes"
        />
      </Card>
    </div>
  );
}
