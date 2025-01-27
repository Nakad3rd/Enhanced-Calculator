export interface Achievement {
  id: string;
  name: string;
  description: string;
  type: "gpa" | "improvement" | "custom";
  tier: "bronze" | "silver" | "gold";
  icon: string;
  threshold: number;
  isUnlocked: boolean;
  progress: number;
}

export interface Milestone {
  id: string;
  name: string;
  targetGPA: number;
  deadline: Date;
  progress: number;
}