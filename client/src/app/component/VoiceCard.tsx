"use client";

import { useState, useEffect, useCallback } from "react";
import { Mic, Video, Calendar, Users, Loader2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { motion } from "framer-motion";
import Schedule from "./Schedule";
import { useAnnouncementContext } from "@/context/AnnouncementContext";

interface VoiceMeetingData {
  eventName: string;
  eventDescription: string;
  meetingDate: string;
  startTime: string;
  endTime: string;
}

interface TokenResponse {
  error?: string;
}

// Animation variants for buttons
const buttonVariants = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

export default function VoiceCard() {
  // UI States
  const [isHovering, setIsHovering] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Meeting Data States
  const [voiceMeetingData, setVoiceMeetingData] = useState<VoiceMeetingData>({
    eventName: "",
    eventDescription: "",
    meetingDate: "",
    startTime: "",
    endTime: "",
  });
  const [voiceMeetLink, setVoiceMeetLink] = useState<string | null>(null);

  // Google API States
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isGapiLoaded, setIsGapiLoaded] = useState(false);
  const [isGsiLoaded, setIsGsiLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isApiLoading, setIsApiLoading] = useState(true);

  // Google API Configuration (ensure these are secured in production)
  const CLIENT_ID =
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
    "528464651880-3o57pe8bqa0q3b932tlq47td0fo0hpcu.apps.googleusercontent.com";
  const API_KEY =
    process.env.NEXT_PUBLIC_GOOGLE_API_KEY ||
    "AIzaSyD72BvEfn7N5ikxzhxqBkwOj3EVB9-kwng";
  const DISCOVERY_DOCS = [
    "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
  ];
  const SCOPES = "https://www.googleapis.com/auth/calendar.events";

  const { addNotification } = useAnnouncementContext();

  // Initialize Google API client
  const initializeGapiClient = useCallback(async () => {
    if (!window.gapi) return;
    try {
      await new Promise((resolve) => {
        window.gapi.load("client", resolve);
      });
      await window.gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: DISCOVERY_DOCS,
      });
      setIsGapiLoaded(true);
    } catch (err) {
      console.error("Error initializing GAPI client:", err);
      setError("Failed to initialize Google Calendar API. Please try again.");
    } finally {
      setIsApiLoading(false);
    }
  }, [API_KEY]);

  // Load Google API Scripts and check Speech Recognition support
  useEffect(() => {
    // Check browser Speech Recognition support
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("Your browser doesn't support voice commands. Try Chrome or Edge.");
    }

    const loadGapiScript = () => {
      const script = document.createElement("script");
      script.src = "https://apis.google.com/js/api.js";
      script.async = true;
      script.defer = true;
      script.onload = initializeGapiClient;
      script.onerror = () => {
        console.error("Error loading GAPI script");
        setError("Failed to load Google API. Please try again later.");
        setIsApiLoading(false);
      };
      document.body.appendChild(script);
    };

    const loadGsiScript = () => {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => setIsGsiLoaded(true);
      script.onerror = () => {
        console.error("Error loading GSI script");
        setError("Failed to load Google Identity Services. Please try again later.");
        setIsApiLoading(false);
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

    // Cleanup: cancel any ongoing speech synthesis on unmount
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [initializeGapiClient]);

  // Check persisted sign-in state after APIs are loaded
  useEffect(() => {
    if (isGapiLoaded && isGsiLoaded) {
      const signedIn = localStorage.getItem("isSignedIn") === "true";
      setIsSignedIn(signedIn);
      setIsApiLoading(false);
    }
  }, [isGapiLoaded, isGsiLoaded]);

  // Google Sign-In using Google Identity Services
  const handleVoiceSignIn = async () => {
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
        callback: (tokenResponse: TokenResponse) => {
          if (tokenResponse.error !== undefined) {
            setError("Sign in failed. Please try again.");
            setIsLoading(false);
            return;
          }
          setIsSignedIn(true);
          localStorage.setItem("isSignedIn", "true");
          setIsLoading(false);
        },
      });
      tokenClient.requestAccessToken(); // Removed prompt: "consent"
      return true;
    } catch (err) {
      console.error("Error signing in:", err);
      setError("Failed to sign in with Google. Please try again.");
      setIsLoading(false);
      return false;
    }
  };

  // Sign-Out function
  const handleSignOut = () => {
    setIsSignedIn(false);
    localStorage.removeItem("isSignedIn");
    setVoiceMeetLink(null);
    setError(null);
    if (window.google?.accounts?.oauth2) {
      window.google.accounts.oauth2.revoke(CLIENT_ID, () => {
        console.log("Google token revoked");
      });
    }
  };

  // Helper: Speak a message using SpeechSynthesis
  const speakMessage = (message: string) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(message);
    synth.speak(utterance);
  };

  // Format date from inputs like "20250325" to "2025-03-25"
  const formatDate = (inputDate: string): string => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(inputDate)) {
      return inputDate;
    }
    const digitsOnly = inputDate.replace(/\D/g, "");
    if (digitsOnly.length === 8) {
      const year = digitsOnly.substring(0, 4);
      const month = digitsOnly.substring(4, 6);
      const day = digitsOnly.substring(6, 8);
      return `${year}-${month}-${day}`;
    }
    return inputDate;
  };

  // Format time from inputs like "0200" to "02:00"
  const formatTime = (inputTime: string): string => {
    if (/^\d{2}:\d{2}$/.test(inputTime)) {
      return inputTime;
    }
    const digitsOnly = inputTime.replace(/\D/g, "");
    if (digitsOnly.length === 4) {
      const hours = digitsOnly.substring(0, 2);
      const minutes = digitsOnly.substring(2, 4);
      return `${hours}:${minutes}`;
    }
    if (digitsOnly.length === 3) {
      const hours = digitsOnly.substring(0, 1).padStart(2, "0");
      const minutes = digitsOnly.substring(1, 3);
      return `${hours}:${minutes}`;
    }
    if (digitsOnly.length === 2) {
      if (parseInt(digitsOnly) < 24) {
        return `${digitsOnly}:00`;
      } else {
        return `00:${digitsOnly}`;
      }
    }
    return inputTime;
  };

  // Validate date in YYYY-MM-DD format
  const isValidDate = (dateString: string): boolean => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  };

  // Validate time in HH:MM format
  const isValidTime = (timeString: string): boolean => {
    const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return regex.test(timeString);
  };

  // Process raw voice input for date
  const processDateInput = (input: string): string => {
    const processed = input.trim().replace(/[^\w\s]/g, "");
    const dateMatch = processed.match(/\b(\d{8}|\d{6})\b/);
    if (dateMatch) {
      return formatDate(dateMatch[0]);
    }
    if (/\b(today|now)\b/i.test(processed)) {
      const today = new Date();
      return formatDate(
        `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, "0")}${String(today.getDate()).padStart(2, "0")}`
      );
    }
    if (/\b(tomorrow)\b/i.test(processed)) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return formatDate(
        `${tomorrow.getFullYear()}${String(tomorrow.getMonth() + 1).padStart(2, "0")}${String(tomorrow.getDate()).padStart(2, "0")}`
      );
    }
    return processed;
  };

  // Process raw voice input for time
  const processTimeInput = (input: string): string => {
    const processed = input.trim().replace(/[^\w\s]/g, "");
    const timeMatch = processed.match(/\b(\d{4}|\d{3}|\d{2})\b/);
    if (timeMatch) {
      return formatTime(timeMatch[0]);
    }
    return processed;
  };

  // Ask a voice question and listen for the response
  const askVoiceQuestion = (question: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(question);
      utterance.onend = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
          reject("Browser does not support Speech Recognition.");
          return;
        }
        const recognition = new SpeechRecognition();
        recognition.lang = "en-US";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          resolve(transcript);
        };
        recognition.onerror = (event: any) => {
          reject(event.error);
        };
        recognition.start();
      };
      synth.speak(utterance);
    });
  };

  // Create a Calendar event via Google Calendar API using collected data
  const createVoiceCalendarEvent = async (data: VoiceMeetingData): Promise<string | null> => {
    if (!window.gapi?.client) {
      setError("Google Calendar API is not available. Please refresh and try again.");
      return null;
    }
    try {
      if (!window.gapi.client.calendar) {
        await window.gapi.client.load("calendar", "v3");
      }
      const requestId = `meet_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
      const formattedDate = formatDate(data.meetingDate);
      const formattedStartTime = formatTime(data.startTime);
      const formattedEndTime = formatTime(data.endTime);

      if (!isValidDate(formattedDate)) {
        throw new Error(`Invalid date format: ${data.meetingDate}. Use YYYYMMDD format.`);
      }
      if (!isValidTime(formattedStartTime) || !isValidTime(formattedEndTime)) {
        throw new Error("Invalid time format. Use HHMM format.");
      }

      const startDate = new Date(`${formattedDate}T${formattedStartTime}:00`);
      const endDate = new Date(`${formattedDate}T${formattedEndTime}:00`);

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new Error("Failed to parse date and time values.");
      }
      if (endDate <= startDate) {
        throw new Error("End time must be after start time.");
      }

      const event = {
        summary: data.eventName || "New Meeting",
        description: data.eventDescription || "",
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

      if (response.result.hangoutLink) {
        addNotification({
          title: data.eventName,
          date: new Date().toLocaleDateString(),
          message: `A new meeting has been scheduled for ${new Date(formattedDate).toLocaleDateString()} from ${formattedStartTime} to ${formattedEndTime}. Click the meeting link to join.`,
          type: "meeting",
          bgColor: "bg-green-50",
          textColor: "text-green-700",
          meetingLink: response.result.hangoutLink,
          class: "All Classes"
        });
      }

      return response.result.hangoutLink || null;
    } catch (err) {
      console.error("Error creating voice meeting event:", err);
      if ((err as any).result?.error?.code === 401) {
        setIsSignedIn(false);
        localStorage.removeItem("isSignedIn");
        setError("Your session has expired. Please sign in again to continue.");
        return null;
      }
      setError(`Failed to create meeting: ${(err as Error).message || "Unknown error"}`);
      return null;
    }
  };

  // Main voice meeting flow
  const startVoiceMeeting = async () => {
    if (!isSignedIn) {
      setError("Please sign in with your Google account to create a meeting.");
      return;
    }
    try {
      setIsListening(true);
      setError(null);

      const responses: VoiceMeetingData = {
        eventName: "",
        eventDescription: "",
        meetingDate: "",
        startTime: "",
        endTime: "",
      };

      responses.eventName = await askVoiceQuestion("What is the title of your meeting?");
      responses.eventDescription = await askVoiceQuestion("Please provide a brief description for your meeting.");

      let dateResponse;
      do {
        dateResponse = await askVoiceQuestion(
          "What is the meeting date? You can say a date like 20250325 for March 25, 2025."
        );
        dateResponse = processDateInput(dateResponse);
      } while (!isValidDate(dateResponse));
      responses.meetingDate = dateResponse;

      let timeResponse;
      do {
        timeResponse = await askVoiceQuestion(
          "What is the start time? For example, say 0200 for 2:00 AM."
        );
        timeResponse = processTimeInput(timeResponse);
      } while (!isValidTime(timeResponse));
      responses.startTime = timeResponse;

      do {
        timeResponse = await askVoiceQuestion(
          "What is the end time? For example, say 0330 for 3:30 AM."
        );
        timeResponse = processTimeInput(timeResponse);
      } while (!isValidTime(timeResponse));
      responses.endTime = timeResponse;

      setVoiceMeetingData(responses);

      const displayDate = new Date(responses.meetingDate).toLocaleDateString();
      const displayStartTime = new Date(`2000-01-01T${responses.startTime}`).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      const displayEndTime = new Date(`2000-01-01T${responses.endTime}`).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      const confirmationText = `I'm about to create a meeting titled "${responses.eventName}" on ${displayDate} from ${displayStartTime} to ${displayEndTime}. Should I create this meeting?`;
      const confirmation = await askVoiceQuestion(confirmationText);

      if (/yes|yeah|yep|confirm|create it|sure/i.test(confirmation)) {
        const meetLink = await createVoiceCalendarEvent(responses);
        if (meetLink) {
          setVoiceMeetLink(meetLink);
          speakMessage("Your meeting has been created successfully!");
        }
      } else {
        setError("Meeting creation cancelled.");
        speakMessage("Meeting creation cancelled.");
      }
    } catch (err) {
      console.error("Voice meeting error:", err);
      setError((err as Error).message || "An error occurred during voice meeting setup.");
    } finally {
      setIsListening(false);
    }
  };

  // Modal handlers
  const openModal = () => {
    if (!isSignedIn) {
      setError("Please sign in with your Google account to schedule a meeting.");
      return;
    }
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card
          className="w-full mt-6 p-4 border-l-4 border-l-[#4A90E2] hover:shadow-lg transition-shadow"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold flex items-center gap-3">
              <Video className="h-6 w-6 text-[#4A90E2]" />
              Create Video Meeting
            </CardTitle>
            <CardDescription className="mt-2 text-sm text-gray-600">
              Schedule a virtual meeting with students, teachers, or parents using voice commands or manually.
            </CardDescription>
          </CardHeader>

          <CardContent className="py-4">
            <div className="flex flex-col sm:flex-row gap-5 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[#4A90E2]" />
                <span>Instant or scheduled</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-[#4A90E2]" />
                <span>Up to 100 participants</span>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              {isApiLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-[#4A90E2]" />
                  <span>Loading Google APIs...</span>
                </div>
              ) : (
                <span>
                  {isSignedIn ? "Signed in with Google Account" : "Not Signed In"}
                </span>
              )}
            </div>
            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>

          <CardFooter className="pt-4 flex flex-wrap justify-between items-center gap-3">
            <div className="flex gap-3">
              {!isSignedIn ? (
                <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                  <Button
                    className="gap-3 px-5 py-2 bg-[#4A90E2] hover:bg-[#50C878] text-white"
                    onClick={handleVoiceSignIn}
                    disabled={isLoading || isApiLoading}
                    aria-label="Sign in with Google"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Mic className="h-4 w-4" />
                    )}
                    {isLoading ? "Signing In..." : "Sign In with Google"}
                  </Button>
                </motion.div>
              ) : (
                <>
                  <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                    <Button
                      className="gap-3 px-5 py-2 bg-[#4A90E2] hover:bg-[#50C878] text-white"
                      onClick={startVoiceMeeting}
                      disabled={isListening || isLoading || isApiLoading}
                      aria-label="Start meeting with voice commands"
                    >
                      {isListening || isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Mic className="h-4 w-4" />
                      )}
                      {isListening ? "Listening..." : isLoading ? "Loading..." : "Start Meeting Now"}
                    </Button>
                  </motion.div>
                  <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                    <Button
                      variant="outline"
                      className="px-5 py-2 border-[#4A90E2] text-[#4A90E2] hover:bg-[#E6F0FA]"
                      onClick={openModal}
                      disabled={isLoading || isApiLoading}
                      aria-label="Schedule a meeting manually"
                    >
                      Schedule
                    </Button>
                  </motion.div>
                </>
              )}
            </div>
            {isSignedIn && (
              <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                <Button
                  variant="ghost"
                  className="gap-2 text-[#4A90E2] hover:text-[#50C878]"
                  onClick={handleSignOut}
                  aria-label="Sign out from Google account"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </motion.div>
            )}
          </CardFooter>

          {voiceMeetLink && (
            <div className="mt-4 p-4 bg-[#E6F0FA] rounded">
              <p className="font-semibold text-[#4A90E2] mb-2">
                Your Google Meet has been created successfully!
              </p>
              <p className="mb-1">
                <strong>Meet Link:</strong>
              </p>
              <a
                href={voiceMeetLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#4A90E2] hover:underline break-all"
              >
                {voiceMeetLink}
              </a>
              <p className="mt-2 text-sm text-[#4A90E2]">
                The meeting has been added to your Google Calendar.
              </p>
            </div>
          )}
        </Card>
      </motion.div>

      {isModalOpen && (
        <Schedule
          open={isModalOpen}
          onClose={closeModal}
          isSignedIn={isSignedIn}
          onSignIn={handleVoiceSignIn}
          createCalendarEvent={createVoiceCalendarEvent}
          formatDate={formatDate}
          formatTime={formatTime}
        />
      )}
    </>
  );
}