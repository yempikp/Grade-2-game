export type SubjectId = 'math' | 'language' | 'science' | 'social';

export type ChallengeType = 
  | 'multiple-choice'
  | 'sorting'
  | 'clock'
  | 'place-value'
  | 'compound-word';

export interface BaseChallenge {
  id: string;
  type: ChallengeType;
  prompt: string;
  subPrompt?: string;
  explanation: string;
  hint?: string;
  audioPrompt?: string;
}

export interface MultipleChoiceChallenge extends BaseChallenge {
  type: 'multiple-choice';
  options: {
    id: string;
    text: string;
    icon?: string;
    isCorrect: boolean;
  }[];
  visualAid?: {
    kind: 'coin' | 'number-line' | 'image' | 'math-blocks' | 'emoji-grid';
    data: any;
  };
}

export interface SortingChallengeData extends BaseChallenge {
  type: 'sorting';
  categories: {
    id: string;
    label: string;
    color: string;
    iconName?: string;
  }[];
  items: {
    id: string;
    text: string;
    categoryId: string;
    icon?: string;
  }[];
}

export interface ClockChallengeData extends BaseChallenge {
  type: 'clock';
  targetHours: number;
  targetMinutes: number;
  mode: 'read' | 'set'; // 'read' gives an analog clock and asks for time; 'set' asks to adjust clock
  options?: string[]; // For read mode
}

export interface PlaceValueChallengeData extends BaseChallenge {
  type: 'place-value';
  targetNumber: number;
  mode: 'build' | 'identify';
  hundreds: number;
  tens: number;
  ones: number;
  options?: number[];
}

export interface CompoundWordChallengeData extends BaseChallenge {
  type: 'compound-word';
  word1: string;
  word2: string;
  compound: string;
  distractors: string[];
  meaning: string;
}

export type Challenge = 
  | MultipleChoiceChallenge 
  | SortingChallengeData 
  | ClockChallengeData 
  | PlaceValueChallengeData
  | CompoundWordChallengeData;

export interface Level {
  id: string;
  realmId: SubjectId;
  order: number;
  title: string;
  description: string;
  badgeName: string;
  iconName: string;
  challenges: Challenge[];
}

export interface Realm {
  id: SubjectId;
  name: string;
  subtitle: string;
  tagline: string;
  description: string;
  color: string;
  accentColor: string;
  bgGradient: string;
  imagePath: string;
  iconName: string;
  levels: Level[];
}

export interface UserProgress {
  starsByLevel: Record<string, number>; // levelId -> stars (1, 2, or 3)
  highScoresByLevel: Record<string, number>;
  unlockedLevelIds: string[];
  totalStars: number;
  totalCoins: number;
  studentName: string;
  arcadeHighScores: {
    mathSprint: number;
    wordSorter: number;
    clockFrenzy: number;
  };
  badgesEarned: string[];
  soundEnabled: boolean;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  realmId?: SubjectId;
  requiredStars?: number;
  isUnlocked: boolean;
}
