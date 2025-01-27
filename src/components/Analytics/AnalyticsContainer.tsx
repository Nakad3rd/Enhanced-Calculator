import { CGPATrendChart } from "./CGPATrendChart";
import { CategoryPerformance } from "./CategoryPerformance";
import type { Semester } from "@/lib/utils";

interface AnalyticsContainerProps {
  semesters: Semester[];
  targetCGPA?: number;
}

export const AnalyticsContainer = ({ semesters, targetCGPA }: AnalyticsContainerProps) => {
  const allCourses = semesters.flatMap(semester => semester.courses);

  return (
    <div className="space-y-6">
      <CGPATrendChart semesters={semesters} targetCGPA={targetCGPA} />
      <CategoryPerformance courses={allCourses} />
    </div>
  );
};