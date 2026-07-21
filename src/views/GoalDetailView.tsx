import { motion } from 'framer-motion';
import { useNorth } from '../hooks/useNorth';

export function GoalDetailView({
  goalId,
  onBack,
}: {
  goalId: string;
  onBack: () => void;
}) {
  const { data, updateGoal } = useNorth();
  const goal = data.goals.find((g) => g.id === goalId);

  if (!goal) {
    return (
      <div className="page">
        <button type="button" className="back-link" onClick={onBack}>
          Back
        </button>
        <p>Goal not found.</p>
      </div>
    );
  }

  function toggleMilestone(id: string) {
    if (!goal) return;
    updateGoal(goal.id, {
      milestones: goal.milestones.map((m) =>
        m.id === id ? { ...m, done: !m.done } : m,
      ),
    });
  }

  return (
    <div className="page">
      <button type="button" className="back-link" onClick={onBack}>
        Back
      </button>

      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="goal-detail-head"
      >
        <p className="eyebrow">
          <span aria-hidden>{goal.icon}</span> Goal mission
        </p>
        <h1>{goal.title}</h1>
        <p className="goal-vision">“{goal.vision}”</p>
      </motion.header>

      <section className="glass detail-block">
        <p className="eyebrow">Why this matters</p>
        <p>{goal.why}</p>
      </section>

      <section className="glass detail-block">
        <div className="goal-stats wide">
          <div>
            <p className="focus-label">Current</p>
            <p className="stat-lg">{goal.currentLabel}</p>
          </div>
          <div>
            <p className="focus-label">Target</p>
            <p className="stat-lg">{goal.targetLabel}</p>
          </div>
        </div>
        <div className="meter tall">
          <span style={{ width: `${goal.progress * 100}%` }} />
        </div>
        <p className="goal-pct">{Math.round(goal.progress * 100)}% · {goal.timeline}</p>
      </section>

      <section className="roadmap">
        <p className="eyebrow">Roadmap</p>
        <ol className="roadmap-list">
          {goal.milestones.map((m, i) => (
            <li key={m.id}>
              <button
                type="button"
                className={`roadmap-step${m.done ? ' is-done' : ''}`}
                onClick={() => toggleMilestone(m.id)}
              >
                <span className="step-num">{i + 1}</span>
                <span>{m.title}</span>
              </button>
            </li>
          ))}
        </ol>
      </section>

      <section className="glass detail-block">
        <p className="eyebrow">Reflection</p>
        <p className="editorial">{goal.reflection}</p>
      </section>
    </div>
  );
}
