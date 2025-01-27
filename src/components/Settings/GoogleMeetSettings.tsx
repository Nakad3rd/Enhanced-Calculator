import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";

export const GoogleMeetSettings = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenGoogleMeet = () => {
    // Direct link to Google Meet's scheduling page
    window.open('https://meet.google.com/new', '_blank');
    setIsOpen(false);
    toast({
      title: "Opening Google Meet",
      description: "Redirecting you to schedule a new meeting.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          Configure Google Meet
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Schedule Google Meet</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            You will be redirected to Google Meet to schedule your meeting. Make sure you're signed in to your Google account.
          </p>
          <Button onClick={handleOpenGoogleMeet} className="w-full">
            Open Google Meet
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};