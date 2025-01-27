import { useState, useEffect } from "react";
import { GradePredictionContainer } from "@/components/GradePrediction/GradePredictionContainer";
import { AchievementsContainer } from "@/components/Achievements/AchievementsContainer";
import { SemesterList } from "@/components/Semesters/SemesterList";
import { AnalyticsContainer } from "@/components/Analytics/AnalyticsContainer";
import CourseIssuesAlert from "@/components/Issues/CourseIssuesAlert";
import LoadingScreen from "@/components/LoadingScreen";
import { calculateCGPA } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/Auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { ProfileDialog } from "@/components/Profile/ProfileDialog";
import type { Semester } from "@/lib/utils";
import { toast } from "sonner";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchSemesters = async () => {
      if (!user) return;

      try {
        const { data: semestersData, error: semestersError } = await supabase
          .from("semesters")
          .select(`
            id,
            name,
            courses (
              id,
              name,
              credits,
              grade
            )
          `)
          .order('created_at', { ascending: true });

        if (semestersError) throw semestersError;

        if (semestersData) {
          setSemesters(semestersData as Semester[]);
        }
      } catch (error) {
        console.error("Error fetching semesters:", error);
        toast.error("Failed to load your semesters");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSemesters();

    // Subscribe to realtime changes
    const semestersSubscription = supabase
      .channel('semesters_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'semesters' 
      }, payload => {
        console.log('Received semester change:', payload);
        fetchSemesters();
      })
      .subscribe();

    const coursesSubscription = supabase
      .channel('courses_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'courses' 
      }, payload => {
        console.log('Received course change:', payload);
        fetchSemesters();
      })
      .subscribe();

    return () => {
      semestersSubscription.unsubscribe();
      coursesSubscription.unsubscribe();
    };
  }, [user]);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out");
    }
  };

  const currentCGPA = calculateCGPA(semesters);
  const previousSemester = semesters[semesters.length - 2];
  const previousCGPA = previousSemester ? calculateCGPA([previousSemester]) : undefined;

  if (isLoading) {
    return <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-professional py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">CGPA Calculator</h1>
            <p className="text-lg text-gray-300">Track and analyze your academic performance</p>
          </div>
          <div className="flex items-center gap-4">
            <ProfileDialog />
            <Button
              variant="outline"
              className="text-white hover:text-gray-200"
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        <div className="space-y-8">
          <CourseIssuesAlert semesters={semesters} />
          <SemesterList semesters={semesters} setSemesters={setSemesters} />
          <AnalyticsContainer semesters={semesters} targetCGPA={3.5} />
          <GradePredictionContainer currentSemesters={semesters} />
          <AchievementsContainer currentCGPA={currentCGPA} previousCGPA={previousCGPA} />
        </div>

        <footer className="mt-16 pb-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Sambo Joseph Akpan. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;