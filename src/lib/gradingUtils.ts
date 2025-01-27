import { GradingSystem, GradeRange, GradeFormat } from "@/types/grading";

export const defaultGradingSystem: GradingSystem = {
  id: "default",
  name: "Standard 5.0 Scale",
  maxGPA: 5.0,
  grades: [
    { min: 70, max: 100, letter: "A", points: 5.0 },
    { min: 60, max: 69.99, letter: "B", points: 4.0 },
    { min: 50, max: 59.99, letter: "C", points: 3.0 },
    { min: 45, max: 49.99, letter: "D", points: 2.0 },
    { min: 40, max: 44.99, letter: "E", points: 1.0 },
    { min: 0, max: 39.99, letter: "F", points: 0.0 },
  ],
};

export const convertGrade = (
  value: number | string,
  fromFormat: GradeFormat,
  toFormat: GradeFormat,
  gradingSystem: GradingSystem
): string | number => {
  // Convert to percentage first
  let percentage: number;
  if (fromFormat === "percentage") {
    percentage = Number(value);
  } else if (fromFormat === "letter") {
    const grade = gradingSystem.grades.find(g => g.letter === value);
    percentage = grade ? (grade.max + grade.min) / 2 : 0;
  } else {
    // Points to percentage
    const grade = gradingSystem.grades.find(g => g.points === Number(value));
    percentage = grade ? (grade.max + grade.min) / 2 : 0;
  }

  // Convert from percentage to target format
  if (toFormat === "percentage") {
    return percentage;
  } else if (toFormat === "letter") {
    const grade = gradingSystem.grades.find(
      g => percentage >= g.min && percentage <= g.max
    );
    return grade ? grade.letter : "F";
  } else {
    // To points
    const grade = gradingSystem.grades.find(
      g => percentage >= g.min && percentage <= g.max
    );
    return grade ? grade.points : 0;
  }
};

export const validateGradingSystem = (system: GradingSystem): string[] => {
  const errors: string[] = [];
  
  // Check for overlapping ranges
  for (let i = 0; i < system.grades.length; i++) {
    for (let j = i + 1; j < system.grades.length; j++) {
      if (
        (system.grades[i].min <= system.grades[j].max &&
          system.grades[i].max >= system.grades[j].min) ||
        (system.grades[j].min <= system.grades[i].max &&
          system.grades[j].max >= system.grades[i].min)
      ) {
        errors.push(`Overlapping grade ranges detected between ${system.grades[i].letter} and ${system.grades[j].letter}`);
      }
    }
  }

  // Check for gaps in ranges
  system.grades.sort((a, b) => b.min - a.min);
  for (let i = 0; i < system.grades.length - 1; i++) {
    if (system.grades[i].min !== system.grades[i + 1].max) {
      errors.push(`Gap detected between grade ranges ${system.grades[i].letter} and ${system.grades[i + 1].letter}`);
    }
  }

  return errors;
};