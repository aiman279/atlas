import { useWaypoint } from '../hooks/useWaypoint';
import { Card, PageHeader, ProgressBar, SectionLabel } from '../components/ui';

export function ProfileView() {
  const { data, readiness } = useWaypoint();
  const { profile } = data;

  return (
    <div className="view">
      <PageHeader
        eyebrow="Solo travel profile"
        title={profile.name}
        subtitle={profile.bio}
      />

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
          <p className="stat-num">{profile.totalTravelDays}</p>
          <p className="muted">Total travel days</p>
        </Card>
        <Card>
          <p className="stat-num">{profile.totalAdventures}</p>
          <p className="muted">Total adventures</p>
        </Card>
        <Card>
          <p className="stat-num soft">{profile.favouriteStyle}</p>
          <p className="muted">Favourite style</p>
        </Card>
      </div>

      <Card>
        <SectionLabel>Travel Readiness Score</SectionLabel>
        <p className="stat-num mb-sm">{readiness.overall}%</p>
        <ul className="score-break">
          {(
            [
              ['Money', readiness.money],
              ['Planning', readiness.planning],
              ['Gear', readiness.gear],
              ['Knowledge', readiness.knowledge],
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
  );
}
