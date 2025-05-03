import { useState, useEffect } from "react";
import { CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

declare global {
  interface Window {
    google: any;
    gapi: any;
  }
}

interface ScheduleProps {
  open: boolean;
  onClose: () => void;
}

interface GoogleEvent {
  summary: string;
  description: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  conferenceData: {
    createRequest: {
      requestId: string;
      conferenceSolutionKey: {
        type: string;
      };
    };
  };
}

export default function Schedule({ open, onClose }: ScheduleProps) {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date(new Date().getTime() + 30 * 60000));
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGapiLoaded, setIsGapiLoaded] = useState(false);
  const [isGsiLoaded, setIsGsiLoaded] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [meetLink, setMeetLink] = useState<string | null>(null);

  // Move these to environment variables in production
  // Note: You should secure these in production environments
  const CLIENT_ID = "528464651880-3o57pe8bqa0q3b932tlq47td0fo0hpcu.apps.googleusercontent.com";
  const API_KEY = "AIzaSyD72BvEfn7N5ikxzhxqBkwOj3EVB9-kwng";
  const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
  const SCOPES = "https://www.googleapis.com/auth/calendar.events";

  // Load the Google API Client Libraries
  useEffect(() => {
    // Load the Google API Client
    const loadGapiScript = () => {
      const script = document.createElement("script");
      script.src = "https://apis.google.com/js/api.js";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        console.log("GAPI script loaded");
        initializeGapiClient();
      };
      script.onerror = () => {
        console.error("Error loading GAPI script");
        setError("Failed to load Google API. Please try again later.");
      };
      document.body.appendChild(script);
    };

    // Load the Google Identity Services
    const loadGsiScript = () => {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        console.log("GSI script loaded");
        setIsGsiLoaded(true);
      };
      script.onerror = () => {
        console.error("Error loading GSI script");
        setError("Failed to load Google Identity Services. Please try again later.");
      };
      document.body.appendChild(script);
    };

    if (!window.gapi) {
      loadGapiScript();
    } else {
      initializeGapiClient();
    }

    if (!window.google) {
      loadGsiScript();
    } else {
      setIsGsiLoaded(true);
    }
  }, []);

  const initializeGapiClient = async () => {
    if (!window.gapi) return;
    
    try {
      await new Promise<void>((resolve) => {
        window.gapi.load("client", resolve);
      });

      await window.gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: DISCOVERY_DOCS,
      });

      console.log("GAPI client initialized");
      setIsGapiLoaded(true);
    } catch (error) {
      console.error("Error initializing GAPI client:", error);
      setError("Failed to initialize Google Calendar API. Please try again.");
    }
  };

  // Handle Google Sign-in
  const handleSignIn = async () => {
    if (!isGapiLoaded || !isGsiLoaded) {
      setError("Google API not loaded yet. Please wait or refresh the page.");
      return false;
    }

    try {
      setIsLoading(true);
      setError(null);

      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: (tokenResponse: any) => {
          if (tokenResponse.error !== undefined) {
            setError("Sign in failed. Please try again.");
            setIsLoading(false);
            return;
          }
          setIsSignedIn(true);
          setIsLoading(false);
        },
      });

      // Request an access token
      tokenClient.requestAccessToken({ prompt: "consent" });
      return true;
    } catch (error) {
      console.error("Error signing in:", error);
      setError("Failed to sign in with Google. Please try again.");
      setIsLoading(false);
      return false;
    }
  };

  const handleSignOut = () => {
    if (window.google?.accounts?.oauth2) {
      // Revoke token
      const token = window.gapi.client.getToken();
      if (token !== null) {
        window.google.accounts.oauth2.revoke(token.access_token);
        window.gapi.client.setToken(null);
        setIsSignedIn(false);
        setMeetLink(null);
      }
    }
  };

  const createCalendarEventWithMeet = async () => {
    if (!window.gapi?.client) {
      setError("Google Calendar API is not available. Please refresh and try again.");
      return null;
    }

    try {
      // Load the calendar API if not already loaded
      if (!window.gapi.client.calendar) {
        await window.gapi.client.load("calendar", "v3");
      }

      const requestId = `meet_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;

      const event: GoogleEvent = {
        summary: eventName,
        description: eventDescription,
        start: {
          dateTime: startDate.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        end: {
          dateTime: endDate.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        conferenceData: {
          createRequest: {
            requestId: requestId,
            conferenceSolutionKey: {
              type: "hangoutsMeet",
            },
          },
        },
      };

      const response = await window.gapi.client.calendar.events.insert({
        calendarId: "primary",
        resource: event,
        conferenceDataVersion: 1,
      });

      return response.result.hangoutLink || null;
    } catch (error) {
      console.error("Error creating event:", error);
      setError(`Failed to create Google Meet: ${(error as any).message || "Unknown error"}`);
      return null;
    }
  };

  const handleCreateMeeting = async () => {
    if (!eventName || !eventDescription) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      if (!isSignedIn) {
        const signedInSuccessfully = await handleSignIn();
        if (!signedInSuccessfully) {
          setError("You need to sign in with Google to create a meeting.");
          setIsLoading(false);
          return;
        }
      }

      const link = await createCalendarEventWithMeet();
      if (link) {
        setMeetLink(link);
      } else {
        setError("Meeting link could not be generated. Please try again.");
      }
    } catch (error) {
      console.error("Failed to create meeting:", error);
      setError(`Failed to create meeting: ${(error as any).message || "Please try again."}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEventName("");
    setEventDescription("");
    setStartDate(new Date());
    setEndDate(new Date(new Date().getTime() + 30 * 60000));
    setError(null);
    setMeetLink(null);
    onClose();
  };

  const generateTimeOptions = () => {
    const options: { value: string; label: string }[] = [];
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

  const handleDateChange = (date: Date | null, isStart: boolean) => {
    if (!date) return;

    const newDate = new Date(date);
    if (isStart) {
      const currentStart = startDate;
      newDate.setHours(currentStart.getHours(), currentStart.getMinutes());
      setStartDate(newDate);

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

  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Schedule Google Meet</DialogTitle>
          <DialogDescription>
            {isSignedIn
              ? "Fill in the details to create a Google Meet conference."
              : "Sign in with Google to create a meeting."}
          </DialogDescription>
        </DialogHeader>

        {meetLink ? (
          <div className="space-y-4 py-2">
            <Alert>
              <AlertDescription>
                <p>Your Google Meet has been created successfully!</p>
                <p><strong>Meet Link:</strong></p>
                <a href={meetLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                  {meetLink}
                </a>
                <p>The meeting has been added to your Google Calendar.</p>
              </AlertDescription>
            </Alert>
            <div className="mt-4">
              <Button onClick={() => { navigator.clipboard.writeText(meetLink); alert("Meeting link copied to clipboard!"); }} variant="outline" className="w-full mb-2">Copy Link</Button>
              <Button onClick={handleClose} className="w-full">Close</Button>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-4 py-2">
              {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

              {!isGapiLoaded || !isGsiLoaded ? (
                <div className="text-center">
                  <p>Loading Google API...</p>
                  {/* You can add a spinner here */}
                </div>
              ) : !isSignedIn ? (
                <div className="flex justify-center mb-4">
                  <Button onClick={handleSignIn} disabled={isLoading} className="w-full">
                    {isLoading ? "Signing in..." : "Sign in with Google"}
                  </Button>
                </div>
              ) : (
                <div className="flex justify-between items-center mb-4">
                  <p className="text-sm">Signed in to Google</p>
                  <Button variant="outline" size="sm" onClick={handleSignOut}>Sign Out</Button>
                </div>
              )}

              <div>
                <Label htmlFor="event-name" className="font-medium">Event Name *</Label>
                <Input 
                  id="event-name" 
                  value={eventName} 
                  onChange={(e) => setEventName(e.target.value)} 
                  className="mt-1" 
                  placeholder="Enter event name" 
                  required 
                  disabled={!isSignedIn || isLoading} 
                />
              </div>

              <div>
                <Label htmlFor="event-description" className="font-medium">Description *</Label>
                <Textarea 
                  id="event-description" 
                  value={eventDescription} 
                  onChange={(e) => setEventDescription(e.target.value)} 
                  className="mt-1" 
                  rows={3} 
                  placeholder="Enter event description" 
                  required 
                  disabled={!isSignedIn || isLoading} 
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
                        disabled={!isSignedIn || isLoading}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <Select
                        value={`${startDate.getHours().toString().padStart(2, "0")}:${startDate.getMinutes().toString().padStart(2, "0")}`}
                        onValueChange={(value) => handleTimeChange(value, true)}
                        disabled={!isSignedIn || isLoading}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          {generateTimeOptions().map((option) => (
                            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
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
                        disabled={!isSignedIn || isLoading}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <Select
                        value={`${endDate.getHours().toString().padStart(2, "0")}:${endDate.getMinutes().toString().padStart(2, "0")}`}
                        onValueChange={(value) => handleTimeChange(value, false)}
                        disabled={!isSignedIn || isLoading}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          {generateTimeOptions().map((option) => (
                            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={handleClose} disabled={isLoading}>Cancel</Button>
              <Button onClick={handleCreateMeeting} disabled={isLoading || !isSignedIn}>
                {isLoading ? "Creating..." : "Create Meeting"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}