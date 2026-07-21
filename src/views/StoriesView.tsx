import { motion } from 'framer-motion';
import { formatFullDate } from '../data/atlas';
import { useAtlas } from '../hooks/useAtlas';
import { PageHeader } from '../components/ui';

export function StoriesView() {
  const { data } = useAtlas();
  const stories = [...data.stories].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <div className="view">
      <PageHeader
        eyebrow="Travel journal"
        title="Stories"
        subtitle="Emotions and memories — not itineraries."
      />
      <div className="stack-lg">
        {stories.map((story, i) => (
          <motion.article
            key={story.id}
            className="story-entry card"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: i * 0.05 }}
          >
            <img className="story-photo" src={story.photo} alt="" loading="lazy" />
            <div className="story-body">
              <p className="eyebrow">{story.location}</p>
              <h2>{story.title}</h2>
              <p className="story-date">{formatFullDate(story.date)}</p>

              <div className="story-q">
                <h3>What happened?</h3>
                <p>{story.whatHappened}</p>
              </div>
              <div className="story-q">
                <h3>How did I feel?</h3>
                <p>{story.howIFelt}</p>
              </div>
              <div className="story-q">
                <h3>What did I learn?</h3>
                <p>{story.whatILearned}</p>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
