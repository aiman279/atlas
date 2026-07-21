export type Mood =
  | 'Nervous'
  | 'Excited'
  | 'Curious'
  | 'Anxious'
  | 'Calm'
  | 'Confident'
  | 'Grateful'
  | 'Inspired';

export type IncomeSource = 'Salary' | 'Grab' | 'Side income';
export type ExpenseCategory =
  | 'Flight'
  | 'Hotel'
  | 'Food'
  | 'Transport'
  | 'Activities';

export interface Reflection {
  beforeMood: Mood;
  beforeThought: string;
  afterMood: Mood;
  afterLesson: string;
}

export interface Journey {
  id: string;
  chapter: number;
  country: string;
  countryCode: string;
  flag: string;
  city: string;
  title: string;
  tagline: string;
  coverImage: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  budget: number;
  placesVisited: string[];
  personalStory: string;
  lessonsLearned: string[];
  favouriteMoment: string;
  rating: number;
  photos: string[];
  reflection: Reflection;
  status: 'completed' | 'upcoming';
}

export interface Story {
  id: string;
  title: string;
  location: string;
  date: string;
  photo: string;
  whatHappened: string;
  howIFelt: string;
  whatILearned: string;
  journeyId?: string;
}

export interface MapPlace {
  id: string;
  country: string;
  countryCode: string;
  city: string;
  type: 'visited' | 'dream';
  journeyId?: string;
  memory?: string;
  lesson?: string;
  photos: string[];
}

export interface Achievement {
  id: string;
  title: string;
  icon: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: string;
  xp: number;
}

export interface ExplorerProfile {
  level: number;
  xp: number;
  xpToNext: number;
}

export interface FundTransaction {
  id: string;
  type: 'income' | 'expense';
  source?: IncomeSource;
  category?: ExpenseCategory;
  amount: number;
  note: string;
  date: string;
}

export interface AdventureFund {
  id: string;
  name: string;
  goal: number;
  saved: number;
  currency: string;
  targetDate: string;
  transactions: FundTransaction[];
}

export interface DreamDestination {
  id: string;
  country: string;
  flag: string;
  why: string;
  estimatedBudget: number;
  targetYear: number;
  priority: 'high' | 'medium' | 'low';
  coverImage: string;
}

export interface LifeChapter {
  number: number;
  title: string;
  subtitle: string;
}

export interface AtlasStats {
  countriesVisited: number;
  totalJourneys: number;
  memoriesCreated: number;
  achievementsUnlocked: number;
  citiesVisited: number;
  travelDays: number;
}

export interface AtlasData {
  lifeChapter: LifeChapter;
  explorer: ExplorerProfile;
  journeys: Journey[];
  stories: Story[];
  places: MapPlace[];
  achievements: Achievement[];
  funds: AdventureFund[];
  dreams: DreamDestination[];
}

export type AppView =
  | 'home'
  | 'journeys'
  | 'journey-detail'
  | 'stories'
  | 'map'
  | 'achievements'
  | 'fund'
  | 'dreams';
