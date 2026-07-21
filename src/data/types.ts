export interface MemoryPhoto {
  id: string;
  url: string;
  title: string;
  description: string;
  date: string;
  location: string;
}

export interface Journey {
  id: string;
  country: string;
  countryCode: string;
  flag: string;
  title?: string;
  cities: string[];
  startDate: string;
  durationDays: number;
  coverImage: string;
  placesVisited: string[];
  photos: MemoryPhoto[];
  reflection: string;
  rating: number;
  status: 'upcoming' | 'completed';
  isNext: boolean;
}

export interface DreamDestination {
  id: string;
  country: string;
  countryCode: string;
  flag: string;
  dream: string;
  targetYear: number;
  coverImage: string;
}

export interface CountryMemory {
  id: string;
  country: string;
  countryCode: string;
  flag: string;
  coverImage: string;
  visitedAt: string;
  days: number;
  cities: string[];
  photos: MemoryPhoto[];
  reflection: string;
  rating: number;
  journeyId?: string;
  kind: 'visited' | 'dream';
  dream?: string;
  targetYear?: number;
}

export interface FundExpense {
  id: string;
  amount: number;
  note: string;
  date: string;
}

export interface TravelFund {
  goalName: string;
  saved: number;
  target: number;
  currency: string;
  expenses: FundExpense[];
}

export interface Profile {
  name: string;
  role: string;
  travelStyle: string;
  preferences: string[];
  countriesVisited: number;
  totalJourneys: number;
  travelDays: number;
  lifeChapter: string;
  chapterNote: string;
  photo?: string;
}

export interface WaypointData {
  profile: Profile;
  fund: TravelFund;
  journeys: Journey[];
  dreams: DreamDestination[];
  countries: CountryMemory[];
}

export type AppView =
  | 'home'
  | 'journeys'
  | 'journey-detail'
  | 'world'
  | 'country'
  | 'profile';

export type FabAction =
  | 'journey'
  | 'memory'
  | 'destination'
  | 'expense'
  | null;
