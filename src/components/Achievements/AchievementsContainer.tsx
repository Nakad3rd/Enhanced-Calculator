import { useEffect } from "react";
import { toast } from "sonner";
import { Achievement } from "@/types/achievements";
import { AchievementCard } from "./AchievementCard";
import { Card } from "@/components/ui/card";

interface AchievementsContainerProps {
  currentCGPA: number;
  previousCGPA?: number;
}

const calculateAchievements = (cgpa: number, previousCGPA?: number): Achievement[] => {
  const achievements: Achievement[] = [
    {
      id: "deans-list",
      name: "Dean's List",
      description: "Maintain a GPA of 4.5 or higher",
      type: "gpa",
      tier: "gold",
      icon: "trophy",
      threshold: 4.5,
      isUnlocked: cgpa >= 4.5,
      progress: (cgpa / 4.5) * 100,
    },
    {
      id: "improvement",
      name: "Rising Star",
      description: "Show improvement from previous semester",
      type: "improvement",
      tier: "silver",
      icon: "star",
      threshold: previousCGPA || 0,
      isUnlocked: Boolean(previousCGPA && cgpa > previousCGPA),
      progress: previousCGPA ? ((cgpa - previousCGPA) / 0.5) * 100 : 0,
    },
    {
      id: "excellence",
      name: "Academic Excellence",
      description: "Achieve a perfect 5.0 GPA",
      type: "gpa",
      tier: "gold",
      icon: "award",
      threshold: 5.0,
      isUnlocked: cgpa === 5.0,
      progress: (cgpa / 5.0) * 100,
    },
  ];

  return achievements;
};

export const AchievementsContainer = ({ currentCGPA, previousCGPA }: AchievementsContainerProps) => {
  const achievements = calculateAchievements(currentCGPA, previousCGPA);

  useEffect(() => {
    const newlyUnlocked = achievements.filter(a => a.isUnlocked);
    newlyUnlocked.forEach(achievement => {
      toast.success(`Achievement Unlocked: ${achievement.name}`, {
        description: achievement.description,
      });
    });
  }, [achievements]);

  return (
    <Card className="p-6 bg-gradient-to-br from-gray-900 to-gray-800 border border-gold-dark/20">
      <h2 className="text-2xl font-bold text-gold-light mb-4">Achievements</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {achievements.map((achievement) => (
          <AchievementCard key={achievement.id} achievement={achievement} />
        ))}
      </div>
    </Card>
  );
};