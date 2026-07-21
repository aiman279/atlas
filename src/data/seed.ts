import type { AtlasData } from './types';

const img = {
  chapterCurrent:
    'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&q=80',
  chapterPast:
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80',
  chapterRoots:
    'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=1200&q=80',
  japan:
    'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&q=80',
  home:
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
  coffee:
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&q=80',
  sunset:
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80',
  city:
    'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&q=80',
  mountain:
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80',
  desk:
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&q=80',
};

export const seedAtlas: AtlasData = {
  profile: {
    name: "Asmu'i",
    philosophy: 'Keep building. Keep exploring.',
    values: ['Freedom', 'Growth', 'Experience', 'Family'],
    currentChapterId: 'ch-24',
    focusAreas: [
      { id: 'f1', label: 'Career', icon: '💻' },
      { id: 'f2', label: 'Home', icon: '🏠' },
      { id: 'f3', label: 'Wealth', icon: '💰' },
      { id: 'f4', label: 'Adventure', icon: '🌎' },
    ],
    nextMilestone: {
      title: 'Japan Solo Journey',
      date: '2026-09-01',
      daysAway: 42,
    },
  },
  chapters: [
    {
      id: 'ch-24',
      number: 24,
      title: 'Building Myself',
      subtitle: 'Creating a life I am proud of.',
      period: '2026 — Present',
      coverImage: img.chapterCurrent,
      story:
        'This chapter is about independence, growth, and building my future. I am learning who I am when I choose my own path.',
      status: 'current',
      moments: [
        {
          id: 'm1',
          kind: 'achievement',
          title: 'Bought my first home',
          date: '2026-03',
          reflection:
            'A reminder that small steps create big changes.',
        },
        {
          id: 'm2',
          kind: 'decision',
          title: 'Committed to building Atlas',
          date: '2026-07',
          reflection:
            'I chose to create something personal — a space for my own story.',
        },
        {
          id: 'm3',
          kind: 'experience',
          title: 'Started planning Japan alone',
          date: '2026-06',
          reflection:
            'Fear and excitement in equal measure. That means it matters.',
        },
        {
          id: 'm4',
          kind: 'lesson',
          title: 'Progress over perfection',
          date: '2026-05',
          reflection:
            'Showing up consistently beats waiting for the perfect moment.',
        },
      ],
    },
    {
      id: 'ch-23',
      number: 23,
      title: 'Finding Direction',
      period: '2024 — 2025',
      coverImage: img.chapterPast,
      story:
        'A quieter chapter of asking hard questions. Where do I want to go? What kind of life am I building?',
      status: 'past',
      moments: [
        {
          id: 'm5',
          kind: 'decision',
          title: 'Chose growth over comfort',
          date: '2025-08',
          reflection: 'Staying safe was no longer enough.',
        },
        {
          id: 'm6',
          kind: 'lesson',
          title: 'Clarity comes from action',
          date: '2025-02',
          reflection:
            'I stopped waiting for certainty and started moving.',
        },
      ],
    },
    {
      id: 'ch-22',
      number: 22,
      title: 'Roots & Becoming',
      period: '2022 — 2023',
      coverImage: img.chapterRoots,
      story:
        'Learning who I was before I knew who I wanted to become. Family, place, and the early sparks of ambition.',
      status: 'past',
      moments: [
        {
          id: 'm7',
          kind: 'experience',
          title: 'First real independence',
          date: '2023-01',
          reflection: 'The beginning of owning my choices.',
        },
      ],
    },
  ],
  memories: [
    {
      id: 'mem-1',
      title: 'My first solo adventure',
      date: '2027-03-15',
      location: 'Tokyo, Japan',
      story:
        'Walking through Shibuya at dusk, realizing I had planned every step myself. No one to lean on — and somehow that felt free.',
      feeling: 'Alive',
      image: img.japan,
    },
    {
      id: 'mem-2',
      title: 'Keys in hand',
      date: '2026-03-20',
      location: 'Home',
      story:
        'Standing in an empty living room that was finally mine. Quiet walls. A future I could furnish.',
      feeling: 'Proud',
      image: img.home,
    },
    {
      id: 'mem-3',
      title: 'Morning ritual',
      date: '2026-01-12',
      location: 'Café, Kuala Lumpur',
      story:
        'A slow morning with coffee and a notebook. Ideas for Atlas began here — not as a product, but as a feeling.',
      feeling: 'Calm',
      image: img.coffee,
    },
    {
      id: 'mem-4',
      title: 'Golden hour by the sea',
      date: '2025-11-08',
      location: 'Langkawi',
      story:
        'Watching the sun drop into the water with nowhere to be. Reminder that rest is part of the journey too.',
      feeling: 'Grateful',
      image: img.sunset,
    },
    {
      id: 'mem-5',
      title: 'City lights, open mind',
      date: '2025-07-22',
      location: 'Singapore',
      story:
        'A short trip that stretched how I think about possibility. Density, ambition, and quiet walks at night.',
      feeling: 'Inspired',
      image: img.city,
    },
    {
      id: 'mem-6',
      title: 'Above the clouds',
      date: '2024-09-03',
      location: 'Cameron Highlands',
      story:
        'Cool air and green hills. A weekend that reset everything.',
      feeling: 'Peaceful',
      image: img.mountain,
    },
  ],
  goals: [
    {
      id: 'g1',
      title: 'Build wealth',
      icon: '🏠',
      description: 'Grow savings and assets with patience and clarity.',
      progress: 0.48,
      reflection: 'Steady beats spectacular.',
    },
    {
      id: 'g2',
      title: 'Become a better developer',
      icon: '💻',
      description: 'Craft products with care — including Atlas itself.',
      progress: 0.62,
      reflection: 'Practice in public. Ship often.',
    },
    {
      id: 'g3',
      title: 'Explore the world',
      icon: '🌎',
      description: 'Collect places that change how I see myself.',
      progress: 0.28,
      date: '2026-09',
    },
  ],
  achievements: [
    {
      id: 'a1',
      title: 'Bought my first home',
      date: '2026-03',
      description: 'A foundation for the next decade.',
      reflection: 'Small steps create big changes.',
      image: img.home,
    },
    {
      id: 'a2',
      title: 'Shipped my first personal app',
      date: '2026-07',
      description: 'Atlas — a home for my life story.',
      reflection: 'Building for myself taught me more than building for others.',
      image: img.desk,
    },
  ],
};
