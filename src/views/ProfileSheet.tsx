import { useWaypoint } from '../hooks/useWaypoint';
import { Card, ProgressBar, SectionLabel } from '../components/ui';

export function ProfileSheet({ onClose }: { onClose: () => void }) {
  const { data, readiness } = useWaypoint();
  const { profile } = data;

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="modal profile-modal"
        role="dialog"
        aria-label="Explorer profile"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="profile-modal-top">
          <div className="avatar-lg">{profile.name.charAt(0)}</div>
          <div>
            <p className="eyebrow">Explorer Profile</p>
            <h3>{profile.name}</h3>
          </div>
          <button type="button" className="map-close static" onClick={onClose}>
            ×
          </button>
        </div>

        <Card className="mb profile-type">
          <SectionLabel>Explorer Type</SectionLabel>
          <h2>{profile.explorerType}</h2>
          <p className="muted">{profile.travelPersonality}</p>
        </Card>

        <div className="stats-2 mb">
          <Card>
            <p className="stat-num">{profile.countriesVisited}</p>
            <p className="muted">Countries visited</p>
          </Card>
          <Card>
            <p className="stat-num">{profile.totalJourneys}</p>
            <p className="muted">Total journeys</p>
          </Card>
          <Card>
            <p className="stat-num">{profile.totalTravelDays}</p>
            <p className="muted">Travel days</p>
          </Card>
          <Card>
            <p className="stat-num soft">{profile.favouriteStyle}</p>
            <p className="muted">Favourite style</p>
          </Card>
        </div>

        <Card>
          <SectionLabel>Travel Readiness</SectionLabel>
          <p className="stat-num mb-sm">{readiness.overall}%</p>
          <ul className="score-break">
            {(
              [
                ['Budget', readiness.money],
                ['Planning', readiness.planning],
                ['Packing', readiness.gear],
                ['Research', readiness.knowledge],
              ] as const
            ).map(([label, value]) => (
              <li key={label}>
                <div className="spend-top">
                  <span>{label}</span>
                  <span>{value}%</span>
                </div>
                <ProgressBar value={value} />
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
