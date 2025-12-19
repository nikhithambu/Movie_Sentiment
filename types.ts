
export interface MovieAnalysis {
  title: string;
  overallSentiment: 'Positive' | 'Mixed' | 'Negative';
  sentimentScore: number; // 0-100
  storyQualityScore: number; // 0-100
  societalImpactScore: number; // 0-100
  summary: string;
  narrativeAnalysis: {
    strengths: string[];
    weaknesses: string[];
    pacing: string;
    characterDepth: string;
  };
  societalDevelopment: {
    contributionToSociety: string;
    keyThemes: string[];
    potentialPositiveImpact: string[];
    potentialNegativeInfluences: string[];
  };
  finalVerdict: string;
}

export interface AnalysisState {
  data: MovieAnalysis | null;
  loading: boolean;
  error: string | null;
}
