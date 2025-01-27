import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type Grade = "A" | "B" | "C" | "D" | "E" | "F";

export const gradePoints: Record<Grade, number> = {
  "A": 5.0,
  "B": 4.0,
  "C": 3.0,
  "D": 2.0,
  "E": 1.0,
  "F": 0.0,
};

export interface Course {
  id: string;
  name: string;
  credits: number;
  grade: Grade;
}

export interface Semester {
  id: string;
  name: string;
  courses: Course[];
}

// Calculate Grade Points for a single course
export const calculateCoursePoints = (course: Course): number => {
  return course.credits * gradePoints[course.grade];
};

// Calculate Total Grade Points (TGP) for a set of courses
export const calculateTotalGradePoints = (courses: Course[]): number => {
  return courses.reduce((sum, course) => sum + calculateCoursePoints(course), 0);
};

// Calculate Total Units (TNU) for a set of courses
export const calculateTotalUnits = (courses: Course[]): number => {
  return courses.reduce((sum, course) => sum + course.credits, 0);
};

// Calculate GPA for a single semester
export const calculateGPA = (courses: Course[]): number => {
  if (courses.length === 0) return 0;
  
  const totalPoints = calculateTotalGradePoints(courses);
  const totalUnits = calculateTotalUnits(courses);
  
  return totalUnits === 0 ? 0 : Number((totalPoints / totalUnits).toFixed(2));
};

// Calculate CGPA across all semesters
export const calculateCGPA = (semesters: Semester[]): number => {
  const allCourses = semesters.flatMap(semester => semester.courses);
  const totalPoints = calculateTotalGradePoints(allCourses);
  const totalUnits = calculateTotalUnits(allCourses);
  
  return totalUnits === 0 ? 0 : Number((totalPoints / totalUnits).toFixed(2));
};