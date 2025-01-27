import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Semester, Course, Grade } from "@/lib/utils";
import { calculateGPA, gradePoints } from "@/lib/utils";
import { useAuth } from "@/components/Auth/AuthProvider";

interface SemesterListProps {
  semesters: Semester[];
  setSemesters: React.Dispatch<React.SetStateAction<Semester[]>>;
}

export const SemesterList = ({ semesters, setSemesters }: SemesterListProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const addCourse = async (semesterId: string) => {
    setIsLoading(true);
    try {
      const newCourse = {
        semester_id: semesterId,
        name: "",
        credits: 3,
        grade: "A" as Grade,
      };

      const { data: course, error } = await supabase
        .from('courses')
        .insert(newCourse)
        .select()
        .single();

      if (error) throw error;

      setSemesters(prevSemesters =>
        prevSemesters.map(semester => {
          if (semester.id === semesterId) {
            return {
              ...semester,
              courses: [
                ...semester.courses,
                course as unknown as Course,
              ],
            };
          }
          return semester;
        })
      );

      toast.success("Course added successfully");
    } catch (error) {
      toast.error("Failed to add course");
      console.error("Error adding course:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addSemester = async () => {
    if (!user) {
      toast.error("You must be logged in to add a semester");
      return;
    }

    setIsLoading(true);
    try {
      const { data: semester, error } = await supabase
        .from('semesters')
        .insert({
          name: `Semester ${semesters.length + 1}`,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      setSemesters(prev => [...prev, { ...semester, courses: [] }]);
      toast.success("Semester added successfully");
    } catch (error) {
      toast.error("Failed to add semester");
      console.error("Error adding semester:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateCourse = async (
    semesterId: string,
    courseId: string,
    field: keyof Course,
    value: string | number | Grade
  ) => {
    try {
      const { error } = await supabase
        .from('courses')
        .update({ [field]: value })
        .eq('id', courseId);

      if (error) throw error;

      setSemesters(prevSemesters =>
        prevSemesters.map(semester => {
          if (semester.id === semesterId) {
            return {
              ...semester,
              courses: semester.courses.map(course => {
                if (course.id === courseId) {
                  return { ...course, [field]: value };
                }
                return course;
              }),
            };
          }
          return semester;
        })
      );
    } catch (error) {
      toast.error("Failed to update course");
      console.error("Error updating course:", error);
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-gray-900 to-gray-800 border border-gold-dark/20">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gold-light">Semesters</h2>
        <Button 
          onClick={addSemester}
          className="bg-gold-dark hover:bg-gold-DEFAULT text-white transition-colors"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Plus className="w-4 h-4 mr-2" />
          )}
          Add Semester
        </Button>
      </div>

      <div className="space-y-6">
        {semesters.map(semester => (
          <div key={semester.id} className="border border-gold-dark/20 rounded-lg p-4 bg-gray-900/50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gold-light">{semester.name}</h3>
              <div className="text-sm text-gold-DEFAULT">
                GPA: {calculateGPA(semester.courses).toFixed(2)}
              </div>
            </div>

            <div className="space-y-4">
              {semester.courses.map(course => (
                <div key={course.id} className="grid grid-cols-12 gap-4">
                  <div className="col-span-5">
                    <Input
                      placeholder="Course Name"
                      value={course.name}
                      onChange={e =>
                        updateCourse(semester.id, course.id, "name", e.target.value)
                      }
                      className="bg-gray-800 border-gold-dark/20 text-white placeholder:text-gold-dark/50"
                    />
                  </div>
                  <div className="col-span-3">
                    <Input
                      type="number"
                      min="1"
                      max="6"
                      value={course.credits}
                      onChange={e =>
                        updateCourse(
                          semester.id,
                          course.id,
                          "credits",
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="bg-gray-800 border-gold-dark/20 text-white"
                    />
                  </div>
                  <div className="col-span-4">
                    <Select
                      value={course.grade}
                      onValueChange={value =>
                        updateCourse(semester.id, course.id, "grade", value as Grade)
                      }
                    >
                      <SelectTrigger className="bg-gray-800 border-gold-dark/20 text-white">
                        <SelectValue placeholder="Grade" />
                      </SelectTrigger>
                      <SelectContent>
                        {["A", "B", "C", "D", "E", "F"].map(grade => (
                          <SelectItem key={grade} value={grade}>
                            {grade}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                className="w-full border-gold-dark/20 text-white hover:bg-gold-dark/10"
                onClick={() => addCourse(semester.id)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  "Add Course"
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};