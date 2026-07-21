import { motion } from 'framer-motion';
import {
  chapterLabel,
  formatFullDate,
  formatMoney,
  formatMonthYear,
} from '../data/atlas';
import { useAtlas } from '../hooks/useAtlas';
import { BackButton, EmptyHint } from '../components/ui';

export function JourneyDetailView({
  journeyId,
  onBack,
}: {
  journeyId: string;
  onBack: () => void;
}) {
  const { data } = useAtlas();
  const journey = data.journeys.find((j) => j.id === journeyId);

  if (!journey) {
    return (
      <div className="view">
        <BackButton onClick={onBack} />
        <EmptyHint>This journey could not be found.</EmptyHint>
      </div>
    );
  }

  return (
    <div className="view storybook">
      <BackButton onClick={onBack} label="Journeys" />

      <motion.div
        className="storybook-hero"
        style={{ backgroundImage: `url(${journey.coverImage})` }}
        initial={{ opacity: 0, scale: 1.02 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="storybook-hero-veil">
          <p className="eyebrow light">{chapterLabel(journey.chapter)}</p>
          <h1>
            {journey.flag} {journey.country}
          </h1>
          <p className="storybook-tagline">“{journey.tagline}”</p>
        </div>
      </motion.div>

      <div className="storybook-meta card soft-pad">
        <div>
          <p className="meta-k">Date</p>
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
        {journey.rating > 0 && (
          <div>
            <p className="meta-k">Rating</p>
            <p className="meta-v">{'★'.repeat(journey.rating)}</p>
          </div>
        )}
      </div>

      <section className="prose-block">
        <h2>Places visited</h2>
        <p className="place-chips">
          {journey.placesVisited.map((p) => (
            <span key={p}>{p}</span>
          ))}
        </p>
      </section>

      <section className="prose-block">
        <h2>Personal story</h2>
        <p className="prose">{journey.personalStory}</p>
      </section>

      <section className="prose-block">
        <h2>Favourite moment</h2>
        <p className="pull-quote">“{journey.favouriteMoment}”</p>
      </section>

      {journey.lessonsLearned.length > 0 && (
        <section className="prose-block">
          <h2>Lessons learned</h2>
          <ul className="lesson-list">
            {journey.lessonsLearned.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="reflection-panel">
        <h2>Before & After</h2>
        <p className="reflection-intro">
          The emotional core of this chapter — who you were, and who you became.
        </p>
        <div className="reflection-grid">
          <div className="reflection-card before">
            <p className="eyebrow">Before</p>
            <p className="mood">{journey.reflection.beforeMood}</p>
            <p className="thought">“{journey.reflection.beforeThought}”</p>
          </div>
          <div className="reflection-card after">
            <p className="eyebrow">After</p>
            <p className="mood">{journey.reflection.afterMood}</p>
            <p className="thought">“{journey.reflection.afterLesson}”</p>
          </div>
        </div>
      </section>

      {journey.photos.length > 0 && (
        <section className="prose-block">
          <h2>Memories</h2>
          <div className="photo-strip">
            {journey.photos.map((src) => (
              <img key={src} src={src} alt="" loading="lazy" />
            ))}
          </div>
        </section>
      )}

      <p className="storybook-foot">
        Written {formatFullDate(journey.startDate)} · Atlas
      </p>
    </div>
  );
}
