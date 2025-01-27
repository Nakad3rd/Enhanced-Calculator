export interface GradeRange {
  min: number;
  max: number;
  letter: string;
  points: number;
}

export interface GradingSystem {
  id: string;
  name: string;
  maxGPA: number;
  grades: GradeRange[];
  weights?: {
    [key: string]: number;
  };
}

export type GradeFormat = "letter" | "percentage" | "points";