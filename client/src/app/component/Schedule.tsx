import { useState } from "react";
import { CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ScheduleProps {
  open: boolean;
  onClose: () => void;
}

export default function Schedule({ open, onClose }: ScheduleProps) {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date(new Date().getTime() + 30 * 60000)); // Default to 30 min later
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [meetLink, setMeetLink] = useState<string | null>(null);

  // Generate time options for the select components
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = new Date();
        time.setHours(hour, minute);
        options.push({
          value: `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`,
          label: time.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }),
        });
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  const handleDateChange = (date: Date | null, isStart: boolean) => {
    if (!date) return;

    const newDate = new Date(date);
    if (isStart) {
      const currentStart = startDate;
      newDate.setHours(currentStart.getHours(), currentStart.getMinutes());
      setStartDate(newDate);
      
      // If end date is before start date, update it
      if (newDate > endDate) {
        const newEndDate = new Date(newDate);
        newEndDate.setMinutes(newEndDate.getMinutes() + 30);
        setEndDate(newEndDate);
      }
    } else {
      const currentEnd = endDate;
      newDate.setHours(currentEnd.getHours(), currentEnd.getMinutes());
      setEndDate(newDate);
    }
  };

  const handleTimeChange = (time: string, isStart: boolean) => {
    const [hours, minutes] = time.split(":").map(Number);
    
    if (isStart) {
      const newDate = new Date(startDate);
      newDate.setHours(hours, minutes);
      setStartDate(newDate);
      
      // If end time is before start time, update it
      if (newDate >= endDate) {
        const newEndDate = new Date(newDate);
        newEndDate.setMinutes(newEndDate.getMinutes() + 30);
        setEndDate(newEndDate);
      }
    } else {
      const newDate = new Date(endDate);
      newDate.setHours(hours, minutes);
      setEndDate(newDate);
    }
  };

  // Generate a meeting link based on form data
  const generateMeetingLink = () => {
    // Create a unique ID for the meeting
    const meetingId = Math.random().toString(36).substring(2, 12);
    
    // Format the date for the URL
    const formattedDate = format(startDate, "yyyyMMdd");
    const formattedTime = format(startDate, "HHmm");
    
    // Create a URL-friendly event name
    const encodedEventName = encodeURIComponent(eventName.replace(/\s+/g, '-').toLowerCase());
    
    // Generate the meeting link
    // In a real application, this would be a link to your actual meeting service
    return `https://meet.example.com/${formattedDate}-${formattedTime}-${encodedEventName}-${meetingId}`;
  };

  const handleCreateMeeting = async () => {
    if (!eventName || !eventDescription) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // Add a small delay to simulate processing
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Generate the meeting link
      const link = generateMeetingLink();
      setMeetLink(link);
      
    } catch (error: any) {
      console.error("Error creating meeting:", error);
      setError(error.message || "Failed to create meeting. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    // Reset form state
    setEventName("");
    setEventDescription("");
    setStartDate(new Date());
    setEndDate(new Date(new Date().getTime() + 30 * 60000));
    setError(null);
    setMeetLink(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Schedule a Meeting</DialogTitle>
          <DialogDescription>
            Please fill in the details to schedule your meeting.
          </DialogDescription>
        </DialogHeader>

        {meetLink ? (
          <div className="space-y-4 py-2">
            <Alert>
              <AlertDescription>
                <p className="mb-2">Your meeting has been created successfully!</p>
                <p className="mb-2"><strong>Meet Link:</strong></p>
                <a href={meetLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                  {meetLink}
                </a>
              </AlertDescription>
            </Alert>
            
            <div className="flex space-x-2 mt-4">
              <Button onClick={() => {
                navigator.clipboard.writeText(meetLink);
                alert("Meeting link copied to clipboard!");
              }} variant="outline" className="flex-1">
                Copy Link
              </Button>
              <Button onClick={handleClose} className="flex-1">
                Close
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-4 py-2">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div>
                <Label htmlFor="event-name" className="font-medium">
                  Event Name *
                </Label>
                <Input
                  id="event-name"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  className="mt-1"
                  placeholder="Enter event name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="event-description" className="font-medium">
                  Description *
                </Label>
                <Textarea
                  id="event-description"
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  className="mt-1"
                  rows={3}
                  placeholder="Enter event description"
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="font-medium">Start</Label>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      <Input
                        type="date"
                        value={format(startDate, "yyyy-MM-dd")}
                        onChange={(e) => handleDateChange(e.target.value ? new Date(e.target.value) : null, true)}
                        className="flex-1"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <Select
                        value={`${startDate.getHours().toString().padStart(2, "0")}:${startDate.getMinutes().toString().padStart(2, "0")}`}
                        onValueChange={(value) => handleTimeChange(value, true)}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="font-medium">End</Label>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      <Input
                        type="date"
                        value={format(endDate, "yyyy-MM-dd")}
                        onChange={(e) => handleDateChange(e.target.value ? new Date(e.target.value) : null, false)}
                        className="flex-1"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <Select
                        value={`${endDate.getHours().toString().padStart(2, "0")}:${endDate.getMinutes().toString().padStart(2, "0")}`}
                        onValueChange={(value) => handleTimeChange(value, false)}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={handleClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button onClick={handleCreateMeeting} disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Meeting"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}