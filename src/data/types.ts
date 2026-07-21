export interface Moment {
  id: string;
  kind: 'achievement' | 'decision' | 'experience' | 'lesson';
  title: string;
  date: string;
  reflection: string;
  image?: string;
}

export interface Chapter {
  id: string;
  number: number;
  title: string;
  subtitle?: string;
  period: string;
  coverImage: string;
  story: string;
  status: 'current' | 'past' | 'upcoming';
  moments: Moment[];
}

export interface Memory {
  id: string;
  title: string;
  date: string;
  location: string;
  story: string;
  feeling: string;
  image: string;
}

export interface Goal {
  id: string;
  title: string;
  icon: string;
  description: string;
  progress: number;
  reflection?: string;
  date?: string;
}

export interface Achievement {
  id: string;
  title: string;
  date: string;
  description: string;
  reflection: string;
  image?: string;
}

export interface FocusArea {
  id: string;
  label: string;
  icon: string;
}

export interface Milestone {
  title: string;
  date: string;
  daysAway: number;
}

export interface Profile {
  name: string;
  philosophy: string;
  values: string[];
  photo?: string;
  currentChapterId: string;
  focusAreas: FocusArea[];
  nextMilestone: Milestone;
}

export interface AtlasData {
  profile: Profile;
  chapters: Chapter[];
  memories: Memory[];
  goals: Goal[];
  achievements: Achievement[];
}

export type AppView =
  | 'home'
  | 'chapters'
  | 'chapter-detail'
  | 'memories'
  | 'memory-detail'
  | 'me';

export type FabAction =
  | 'chapter'
  | 'memory'
  | 'goal'
  | 'achievement'
  | null;
