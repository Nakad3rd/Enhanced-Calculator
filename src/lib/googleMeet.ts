// This is a simplified version without Supabase
export const generateMeetLink = async () => {
  // For demo purposes, generating a random meeting ID
  // In a production environment, this would integrate with Google Calendar API
  const meetingId = Math.random().toString(36).substring(7);
  return `https://meet.google.com/${meetingId}`;
};