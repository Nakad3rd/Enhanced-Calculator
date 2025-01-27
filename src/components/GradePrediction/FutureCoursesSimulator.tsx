import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Grade, gradePoints } from "@/lib/utils";

interface FutureCourse {
  id: string;
  name: string;
  credits: number;
  grade: Grade;
}

interface FutureCoursesSimulatorProps {
  onSimulate: (courses: FutureCourse[]) => void;
}

export const FutureCoursesSimulator = ({ onSimulate }: FutureCoursesSimulatorProps) => {
  const [futureCourses, setFutureCourses] = useState<FutureCourse[]>([]);

  const addCourse = () => {
    setFutureCourses([
      ...futureCourses,
      {
        id: crypto.randomUUID(),
        name: "",
        credits: 3,
        grade: "A",
      },
    ]);
  };

  const updateCourse = (
    id: string,
    field: keyof FutureCourse,
    value: string | number | Grade
  ) => {
    setFutureCourses(
      futureCourses.map((course) =>
        course.id === id ? { ...course, [field]: value } : course
      )
    );
  };

  const removeCourse = (id: string) => {
    setFutureCourses(futureCourses.filter((course) => course.id !== id));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-white">Future Courses</h3>
      {futureCourses.map((course) => (
        <div key={course.id} className="grid grid-cols-12 gap-4">
          <div className="col-span-5">
            <Input
              placeholder="Course Name"
              value={course.name}
              onChange={(e) => updateCourse(course.id, "name", e.target.value)}
              className="bg-gray-800 border-primary/20 text-white placeholder:text-white/50"
            />
          </div>
          <div className="col-span-2">
            <Input
              type="number"
              min="1"
              max="6"
              value={course.credits}
              onChange={(e) =>
                updateCourse(course.id, "credits", parseInt(e.target.value) || 0)
              }
              className="bg-gray-800 border-primary/20 text-white"
            />
          </div>
          <div className="col-span-3">
            <Select
              value={course.grade}
              onValueChange={(value) =>
                updateCourse(course.id, "grade", value as Grade)
              }
            >
              <SelectTrigger className="bg-gray-800 border-primary/20 text-white">
                <SelectValue placeholder="Grade" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(gradePoints).map((grade) => (
                  <SelectItem key={grade} value={grade}>
                    {grade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-2">
            <Button
              variant="destructive"
              onClick={() => removeCourse(course.id)}
              className="w-full"
            >
              Remove
            </Button>
          </div>
        </div>
      ))}
      <div className="flex gap-4">
        <Button
          onClick={addCourse}
          className="bg-primary hover:bg-primary-light text-white"
        >
          Add Course
        </Button>
        <Button
          onClick={() => onSimulate(futureCourses)}
          className="bg-primary hover:bg-primary-light text-white"
        >
          Simulate
        </Button>
      </div>
    </div>
  );
};