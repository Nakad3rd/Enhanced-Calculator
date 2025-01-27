import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GradingSystem } from "@/types/grading";
import { defaultGradingSystem, validateGradingSystem } from "@/lib/gradingUtils";

interface GradingSystemManagerProps {
  onSystemChange: (system: GradingSystem) => void;
}

export const GradingSystemManager = ({ onSystemChange }: GradingSystemManagerProps) => {
  const [activeSystem, setActiveSystem] = useState<GradingSystem>(defaultGradingSystem);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const handleSystemChange = (newSystem: GradingSystem) => {
    const errors = validateGradingSystem(newSystem);
    if (errors.length > 0) {
      toast({
        title: "Invalid Grading System",
        description: errors.join("\n"),
        variant: "destructive",
      });
      return;
    }

    setActiveSystem(newSystem);
    onSystemChange(newSystem);
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-white">Grading System</h3>
          <Button
            onClick={() => setIsEditing(true)}
            className="bg-primary hover:bg-primary-light text-white"
          >
            Customize
          </Button>
        </div>
        <div className="text-sm text-white/80">
          Current System: {activeSystem.name} (Max GPA: {activeSystem.maxGPA})
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gold-light">Edit Grading System</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="systemName">System Name</Label>
            <Input
              id="systemName"
              value={activeSystem.name}
              onChange={(e) =>
                setActiveSystem({ ...activeSystem, name: e.target.value })
              }
              className="bg-gray-800 border-gold-dark/20 text-gold-light"
            />
          </div>
          <div>
            <Label htmlFor="maxGPA">Maximum GPA</Label>
            <Input
              id="maxGPA"
              type="number"
              value={activeSystem.maxGPA}
              onChange={(e) =>
                setActiveSystem({
                  ...activeSystem,
                  maxGPA: parseFloat(e.target.value),
                })
              }
              className="bg-gray-800 border-gold-dark/20 text-gold-light"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Grade Ranges</Label>
          {activeSystem.grades.map((grade, index) => (
            <div key={index} className="grid grid-cols-4 gap-2">
              <Input
                value={grade.letter}
                onChange={(e) => {
                  const newGrades = [...activeSystem.grades];
                  newGrades[index] = { ...grade, letter: e.target.value };
                  setActiveSystem({ ...activeSystem, grades: newGrades });
                }}
                className="bg-gray-800 border-gold-dark/20 text-gold-light"
                placeholder="Letter"
              />
              <Input
                type="number"
                value={grade.min}
                onChange={(e) => {
                  const newGrades = [...activeSystem.grades];
                  newGrades[index] = {
                    ...grade,
                    min: parseFloat(e.target.value),
                  };
                  setActiveSystem({ ...activeSystem, grades: newGrades });
                }}
                className="bg-gray-800 border-gold-dark/20 text-gold-light"
                placeholder="Min %"
              />
              <Input
                type="number"
                value={grade.max}
                onChange={(e) => {
                  const newGrades = [...activeSystem.grades];
                  newGrades[index] = {
                    ...grade,
                    max: parseFloat(e.target.value),
                  };
                  setActiveSystem({ ...activeSystem, grades: newGrades });
                }}
                className="bg-gray-800 border-gold-dark/20 text-gold-light"
                placeholder="Max %"
              />
              <Input
                type="number"
                value={grade.points}
                onChange={(e) => {
                  const newGrades = [...activeSystem.grades];
                  newGrades[index] = {
                    ...grade,
                    points: parseFloat(e.target.value),
                  };
                  setActiveSystem({ ...activeSystem, grades: newGrades });
                }}
                className="bg-gray-800 border-gold-dark/20 text-gold-light"
                placeholder="Points"
              />
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          <Button
            onClick={() => handleSystemChange(activeSystem)}
            className="bg-gold-DEFAULT hover:bg-gold-light text-gray-900"
          >
            Save Changes
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsEditing(false)}
            className="border-gold-dark/20 text-gold-light hover:bg-gold-dark/10"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};