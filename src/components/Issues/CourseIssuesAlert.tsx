import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertTriangle, Calendar, Clock } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { GoogleMeetSettings } from "@/components/Settings/GoogleMeetSettings";
import { generateMeetLink } from "@/lib/googleMeet";
import { Semester } from "@/lib/utils";

interface CourseIssuesAlertProps {
  semesters: Semester[];
  passingGrade?: string;
}

interface CourseIssue {
  courseId: string;
  courseName: string;
  semester: string;
  grade: string;
  type: 'carryover' | 'incomplete' | 'low_grade';
}

interface TimeSlot {
  id: string;
  time: string;
  date: string;
  available: boolean;
}

const CourseIssuesAlert = ({ semesters, passingGrade = 'D' }: CourseIssuesAlertProps) => {
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [meetLink, setMeetLink] = useState<string>("");

  const timeSlots: TimeSlot[] = [
    { id: '1', time: '09:00 AM', date: '2024-03-20', available: true },
    { id: '2', time: '10:00 AM', date: '2024-03-20', available: true },
    { id: '3', time: '02:00 PM', date: '2024-03-20', available: true },
    { id: '4', time: '03:00 PM', date: '2024-03-20', available: false },
  ];

  const handleScheduleMeeting = async () => {
    if (!selectedTimeSlot) {
      toast({
        title: "Error",
        description: "Please select a time slot for the meeting.",
        variant: "destructive",
      });
      return;
    }

    try {
      const link = await generateMeetLink();
      setMeetLink(link);
      
      // Open Google Meet link in a new tab
      window.open(link, '_blank');
      
      toast({
        title: "Meeting Scheduled",
        description: `Your advisor meeting has been scheduled for ${selectedTimeSlot.date} at ${selectedTimeSlot.time}. The meeting link has been opened in a new tab.`,
      });
      setShowScheduleDialog(false);
      setSelectedTimeSlot(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate Google Meet link. Please try again.",
        variant: "destructive",
      });
    }
  };

  const detectIssues = (semesters: Semester[]): CourseIssue[] => {
    const issues: CourseIssue[] = [];
    
    semesters.forEach(semester => {
      semester.courses.forEach(course => {
        if (!course.grade) {
          issues.push({
            courseId: course.id,
            courseName: course.name,
            semester: semester.name,
            grade: course.grade || 'N/A',
            type: 'incomplete'
          });
        } else if (course.grade === 'F') {
          issues.push({
            courseId: course.id,
            courseName: course.name,
            semester: semester.name,
            grade: course.grade,
            type: 'carryover'
          });
        } else if (course.grade === 'E') {
          issues.push({
            courseId: course.id,
            courseName: course.name,
            semester: semester.name,
            grade: course.grade,
            type: 'low_grade'
          });
        }
      });
    });

    return issues;
  };

  const issues = detectIssues(semesters);

  if (issues.length === 0) {
    return null;
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-red-900/10 to-red-800/5 border border-red-600/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          <h2 className="text-xl font-semibold text-red-500">Academic Issues Detected</h2>
        </div>
        <GoogleMeetSettings />
      </div>

      <div className="space-y-4">
        {issues.map((issue) => (
          <div
            key={issue.courseId}
            className="p-4 rounded-lg bg-background/50 border border-red-200/20"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-foreground">{issue.courseName}</h3>
                <p className="text-sm text-muted-foreground">
                  Semester: {issue.semester} | Grade: {issue.grade}
                </p>
              </div>
              <Badge
                variant="destructive"
                className="capitalize"
              >
                {issue.type.replace('_', ' ')}
              </Badge>
            </div>
          </div>
        ))}

        <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
          <DialogTrigger asChild>
            <Button className="w-full mt-4" variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Advisor Meeting
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule Meeting with Advisor</DialogTitle>
              <DialogDescription>
                Select an available time slot to schedule a meeting with your academic advisor.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              {timeSlots.map((slot) => (
                <Button
                  key={slot.id}
                  variant={selectedTimeSlot?.id === slot.id ? "default" : "outline"}
                  disabled={!slot.available}
                  onClick={() => setSelectedTimeSlot(slot)}
                  className="p-4 h-auto"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{slot.date}</span>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{slot.time}</span>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowScheduleDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleScheduleMeeting}>
                Schedule Meeting
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Card>
  );
};

export default CourseIssuesAlert;