export interface DayPlan {
  day: number;
  week: number;
  topic: string;
  task: string;
  notes: string;
  motivation: string;
  challenge: string;
  codeTemplate?: string;
}

export interface UserProgress {
  completedDays: number[];
  userNotes: { [day: number]: string };
  challengeCompletions: number[]; // days where student finished the challenge task
  adaptedPlan?: DayPlan[]; // if the plan has been adapted by Gemini
  isAdapted: boolean;
  notes: string;
  currentDayIndex?: number; // active day index, defaults to 1
}

export interface StudyStats {
  completedCount: number;
  percentage: number;
  challengesCount: number;
  streak: number;
}
