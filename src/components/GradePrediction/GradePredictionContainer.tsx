import { useState } from "react";
import { Card } from "@/components/ui/card";
import { TargetGPAInput } from "./TargetGPAInput";
import { FutureCoursesSimulator } from "./FutureCoursesSimulator";
import { SimulationResults } from "./SimulationResults";
import { GradingSystemManager } from "./GradingSystemManager";
import { calculateCGPA } from "@/lib/utils";
import { GradingSystem } from "@/types/grading";
import { defaultGradingSystem } from "@/lib/gradingUtils";
import type { Semester } from "@/lib/utils";

interface GradePredictionContainerProps {
  currentSemesters: Semester[];
}

export const GradePredictionContainer = ({
  currentSemesters,
}: GradePredictionContainerProps) => {
  const currentCGPA = calculateCGPA(currentSemesters);
  const [targetCGPA, setTargetCGPA] = useState(5.0);
  const [projectedCGPA, setProjectedCGPA] = useState(currentCGPA);
  const [gradingSystem, setGradingSystem] = useState<GradingSystem>(defaultGradingSystem);

  const handleSimulation = (futureCourses: any[]) => {
    const allCourses = [
      ...currentSemesters.flatMap((sem) => sem.courses),
      ...futureCourses,
    ];
    const simulatedCGPA = calculateCGPA([{ id: "future", name: "Future", courses: allCourses }]);
    setProjectedCGPA(simulatedCGPA);
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-gray-900 to-gray-800 border border-gold-dark/20 animate-slide-in">
      <div className="space-y-6">
        <GradingSystemManager onSystemChange={setGradingSystem} />
        <TargetGPAInput currentCGPA={currentCGPA} onTargetSet={setTargetCGPA} />
        <FutureCoursesSimulator onSimulate={handleSimulation} />
        <SimulationResults
          currentCGPA={currentCGPA}
          targetCGPA={targetCGPA}
          projectedCGPA={projectedCGPA}
        />
      </div>
    </Card>
  );
};