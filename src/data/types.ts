export interface LifeArea {
  id: string;
  label: string;
  icon: string;
  progress: number;
}

export interface TodayPulse {
  mission: string;
  energy: number;
  mood: string;
}

export interface GoalMilestone {
  id: string;
  title: string;
  done: boolean;
}

export interface GoalMission {
  id: string;
  title: string;
  icon: string;
  vision: string;
  why: string;
  currentLabel: string;
  targetLabel: string;
  progress: number;
  timeline: string;
  reflection: string;
  milestones: GoalMilestone[];
}

export type BrainCategory =
  | 'Idea'
  | 'Lesson'
  | 'Insight'
  | 'Decision'
  | 'Knowledge'
  | 'Business'
  | 'Career'
  | 'Life';

export interface BrainItem {
  id: string;
  title: string;
  content: string;
  category: BrainCategory;
  related?: string;
  potential?: 'High' | 'Medium' | 'Low';
  tags: string[];
  date: string;
}

export interface YearMetric {
  label: string;
  value: string;
}

export interface EvolutionYear {
  year: number;
  title: string;
  metrics: YearMetric[];
  pastSelf: string;
  currentSelf: string;
  comparisons: string[];
}

export interface IdentityProfile {
  name: string;
  archetype: string;
  values: string[];
  rules: string[];
  workBestWhen: string[];
  struggleWhen: string[];
  photo?: string;
  currentState: string;
  stateNote: string;
}

export interface ThemePrefs {
  mode: 'dark' | 'light';
}

export interface NorthData {
  profile: IdentityProfile;
  lifeAreas: LifeArea[];
  today: TodayPulse;
  goals: GoalMission[];
  brain: BrainItem[];
  evolution: EvolutionYear[];
  theme: ThemePrefs;
}

export type AppView =
  | 'command'
  | 'goals'
  | 'goal-detail'
  | 'brain'
  | 'evolution'
  | 'identity';

export type FabAction =
  | 'goal'
  | 'brain'
  | 'reflect'
  | 'report'
  | 'project'
  | null;
