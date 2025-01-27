import { Progress } from "@/components/ui/progress";

interface SimulationResultsProps {
  currentCGPA: number;
  targetCGPA: number;
  projectedCGPA: number;
}

export const SimulationResults = ({
  currentCGPA,
  targetCGPA,
  projectedCGPA,
}: SimulationResultsProps) => {
  const progress = (projectedCGPA / targetCGPA) * 100;
  const isAchievable = projectedCGPA >= targetCGPA;

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gold-light">Simulation Results</h3>
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gold-light/80">
          <span>Current CGPA: {currentCGPA.toFixed(2)}</span>
          <span>Target CGPA: {targetCGPA.toFixed(2)}</span>
        </div>
        <Progress value={progress} className="h-2 bg-gray-700" />
        <p className="text-sm text-gold-light/80">
          Projected CGPA: {projectedCGPA.toFixed(2)}
        </p>
        <p className={`text-sm ${isAchievable ? "text-success" : "text-destructive"}`}>
          {isAchievable
            ? "Your target CGPA is achievable with these grades!"
            : "You'll need higher grades to reach your target CGPA"}
        </p>
      </div>
    </div>
  );
};