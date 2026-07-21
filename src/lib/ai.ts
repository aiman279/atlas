/** Lightweight local “AI” helpers — structured output, no external API. */

export function categorizeBrain(title: string, content: string) {
  const text = `${title} ${content}`.toLowerCase();
  let category: string = 'Idea';
  let related = 'Life';
  let potential: 'High' | 'Medium' | 'Low' = 'Medium';

  if (/saas|business|money|wealth|invest|income/.test(text)) {
    category = 'Business';
    related = 'Career';
    potential = 'High';
  } else if (/learn|react|code|build|dev/.test(text)) {
    category = 'Knowledge';
    related = 'Career';
  } else if (/decide|choice|commit|chose/.test(text)) {
    category = 'Decision';
    related = 'Identity';
  } else if (/lesson|realized|learned/.test(text)) {
    category = 'Lesson';
    related = 'Growth';
  } else if (/insight|pattern|notice/.test(text)) {
    category = 'Insight';
  }

  if (/high|urgent|important|freedom|launch/.test(text)) potential = 'High';
  if (/maybe|someday|low/.test(text)) potential = 'Low';

  const tags = text
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 4)
    .slice(0, 4);

  return { category, related, potential, tags };
}

export function weeklyReflection(input: string) {
  const lines = input
    .split(/[\n.]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const summary =
    lines.slice(0, 2).join('. ') ||
    'A week of intentional movement with room to refine focus.';

  return {
    summary: summary.endsWith('.') ? summary : `${summary}.`,
    patterns: [
      'Energy followed clarity of mission.',
      'Progress showed up in small daily reps.',
      input.toLowerCase().includes('distract')
        ? 'Distraction competed with deep work.'
        : 'Focus held when goals were visible.',
    ],
    lessons: [
      'What gets measured becomes easier to protect.',
      'Reflection turns activity into growth.',
    ],
    suggestions: [
      'Protect one deep-work block tomorrow.',
      'Review your top goal roadmap this weekend.',
      'Capture one insight in Brain before the week ends.',
    ],
  };
}

export function monthlyReport(data: {
  wealthProgress: number;
  careerProgress: number;
  knowledgeProgress: number;
  goalsDone: number;
  goalsTotal: number;
}) {
  return {
    money: `Wealth systems at ${Math.round(data.wealthProgress * 100)}% balance — keep the compounding loop intact.`,
    career: `Career trajectory at ${Math.round(data.careerProgress * 100)}% — shipping remains the growth engine.`,
    development: `Knowledge at ${Math.round(data.knowledgeProgress * 100)}% — learning hours are converting into skill.`,
    achievements: `${data.goalsDone} of ${data.goalsTotal} roadmap milestones complete this season.`,
  };
}

export function futureProjection(monthlySave: number, years: number) {
  const months = years * 12;
  const estimated = monthlySave * months;
  const formatted = new Intl.NumberFormat('en-MY', {
    style: 'currency',
    currency: 'MYR',
    maximumFractionDigits: 0,
  }).format(estimated);

  return {
    monthlySave,
    years,
    estimated: formatted,
    note: `If you continue saving RM${monthlySave.toLocaleString()}/month for ${years} years, projected accumulation reaches about ${formatted} (simple projection, no interest).`,
  };
}
