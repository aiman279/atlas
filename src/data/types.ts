export type MissionStatus = 'preparing' | 'active' | 'completed';
export type ChecklistGroup = 'documents' | 'transport' | 'knowledge';
export type GearCategory =
  | 'Technology'
  | 'Clothing'
  | 'Health'
  | 'Documents'
  | 'Accessories';
export type IncomeSource = 'Salary' | 'Grab' | 'Side income';
export type ExpenseCategory =
  | 'Flight'
  | 'Hotel'
  | 'Food'
  | 'Transport'
  | 'Activities';
export type Priority = 'High' | 'Medium' | 'Low';

export interface ChecklistItem {
  id: string;
  label: string;
  group: ChecklistGroup;
  done: boolean;
}

export interface TimelineDay {
  day: number;
  title: string;
  note?: string;
}

export interface BudgetLine {
  category: ExpenseCategory;
  amount: number;
}

export interface Mission {
  id: string;
  title: string;
  flag: string;
  country: string;
  status: MissionStatus;
  startDate: string;
  durationDays: number;
  budget: number;
  coverImage: string;
  checklist: ChecklistItem[];
  timeline: TimelineDay[];
  budgetBreakdown: BudgetLine[];
  notes: string;
  isCurrent: boolean;
}

export interface GearItem {
  id: string;
  name: string;
  category: GearCategory;
  weightKg: number;
  price: number;
  essential: boolean;
  timesUsed: number;
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

export interface TravelFund {
  goalName: string;
  target: number;
  saved: number;
  currency: string;
  dailyBurnRate: number;
  transactions: FundTransaction[];
}

export interface Destination {
  id: string;
  country: string;
  flag: string;
  why: string;
  estimatedBudget: number;
  targetYear: number;
  priority: Priority;
  coverImage: string;
}

export interface SoloProfile {
  name: string;
  explorerType: string;
  favouriteStyle: string;
  travelPersonality: string;
  countriesVisited: number;
  totalTravelDays: number;
  totalAdventures: number;
  bio: string;
}

export interface GearLimits {
  backpackLimitKg: number;
}

export interface WaypointData {
  profile: SoloProfile;
  missions: Mission[];
  gear: GearItem[];
  gearLimits: GearLimits;
  fund: TravelFund;
  destinations: Destination[];
}

export type AppView =
  | 'dashboard'
  | 'missions'
  | 'mission-detail'
  | 'gear'
  | 'fund'
  | 'explore'
  | 'profile';

export interface ReadinessBreakdown {
  overall: number;
  money: number;
  planning: number;
  gear: number;
  knowledge: number;
}
