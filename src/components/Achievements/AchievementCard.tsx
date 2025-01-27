import { Trophy, Star, Award } from "lucide-react";
import { Achievement } from "@/types/achievements";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const icons = {
  bronze: Trophy,
  silver: Star,
  gold: Award,
};

interface AchievementCardProps {
  achievement: Achievement;
}

export const AchievementCard = ({ achievement }: AchievementCardProps) => {
  const Icon = icons[achievement.tier];
  
  return (
    <Card className={`p-4 animate-scale-in ${achievement.isUnlocked ? 'bg-gradient-to-br from-gold-light/20 to-gold-dark/20' : 'bg-gray-800/50'}`}>
      <div className="flex items-center gap-3">
        <Icon className={`w-8 h-8 ${achievement.isUnlocked ? 'text-gold-light' : 'text-gray-400'} transition-transform hover:scale-110 duration-200`} />
        <div className="flex-1">
          <h3 className="font-semibold text-gold-light">{achievement.name}</h3>
          <p className="text-sm text-gold-dark">{achievement.description}</p>
          <Progress value={achievement.progress} className="mt-2" />
        </div>
      </div>
    </Card>
  );
};