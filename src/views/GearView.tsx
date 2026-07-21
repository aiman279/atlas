import { motion } from 'framer-motion';
import { formatMoney, gearWeightKg, pct } from '../data/waypoint';
import type { GearCategory } from '../data/types';
import { useWaypoint } from '../hooks/useWaypoint';
import { Card, PageHeader, ProgressBar, SectionLabel } from '../components/ui';

const categories: GearCategory[] = [
  'Technology',
  'Clothing',
  'Health',
  'Documents',
  'Accessories',
];

export function GearView() {
  const { data } = useWaypoint();
  const weight = gearWeightKg(data);
  const limit = data.gearLimits.backpackLimitKg;
  const weightPct = pct(weight, limit);
  const mostUsed = [...data.gear]
    .sort((a, b) => b.timesUsed - a.timesUsed)
    .slice(0, 3);
  const unused = data.gear.filter((g) => g.timesUsed <= 2);

  return (
    <div className="view">
      <PageHeader
        eyebrow="One bag system"
        title="Gear"
        subtitle="Pack smarter. Travel lighter."
      />

      <Card className="mb">
        <SectionLabel>Backpack Weight</SectionLabel>
        <p className="weight-big">
          {weight}kg <span>/ {limit}kg</span>
        </p>
        <ProgressBar value={weightPct} />
      </Card>

      <SectionLabel>Categories</SectionLabel>
      <div className="cat-grid mb">
        {categories.map((cat) => {
          const items = data.gear.filter((g) => g.category === cat);
          const w = items.reduce((s, g) => s + g.weightKg, 0);
          return (
            <Card key={cat} className="cat-card">
              <p className="meta-k">{cat}</p>
              <p className="meta-v">{items.length} items</p>
              <p className="muted">{w.toFixed(1)}kg</p>
            </Card>
          );
        })}
      </div>

      <SectionLabel>Most used</SectionLabel>
      <div className="stack mb">
        {mostUsed.map((g, i) => (
          <motion.div
            key={g.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <GearRow item={g} />
          </motion.div>
        ))}
      </div>

      <SectionLabel>Unused / rarely used</SectionLabel>
      <div className="stack mb">
        {unused.map((g) => (
          <GearRow key={g.id} item={g} />
        ))}
      </div>

      <SectionLabel>My Gear</SectionLabel>
      <div className="stack">
        {data.gear.map((g) => (
          <GearRow key={g.id} item={g} />
        ))}
      </div>
    </div>
  );
}

function GearRow({
  item,
}: {
  item: {
    name: string;
    category: string;
    weightKg: number;
    price: number;
    essential: boolean;
    timesUsed: number;
  };
}) {
  return (
    <Card className="gear-row">
      <div>
        <p className="gear-name">{item.name}</p>
        <p className="muted">
          {item.category} · {item.weightKg}kg · used {item.timesUsed}x
          {item.essential ? ' · Essential' : ''}
        </p>
      </div>
      <p className="gear-price">
        {item.price > 0 ? formatMoney(item.price) : '—'}
      </p>
    </Card>
  );
}
