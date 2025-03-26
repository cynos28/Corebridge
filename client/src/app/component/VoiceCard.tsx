"use client";

import { useState, useEffect, useCallback } from "react";
import { Mic, Video, Calendar, Users, Loader2 } from "lucide-react";
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
import Schedule from "./Schedule";

export default function VoiceCard() {
  // UI States
  const [isHovering, setIsHovering] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Meeting Data States
  const [voiceMeetingData, setVoiceMeetingData] = useState({
    eventName: "",
    eventDescription: "",
    meetingDate: "",
    startTime: "",
    endTime: "",
  });
  const [voiceMeetLink, setVoiceMeetLink] = useState(null);

  // Google API States
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isGapiLoaded, setIsGapiLoaded] = useState(false);
  const [isGsiLoaded, setIsGsiLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
        callback: (tokenResponse) => {
          if (tokenResponse.error !== undefined) {
            setError("Sign in failed. Please try again.");
            setIsLoading(false);
            return;
          }
          setIsSignedIn(true);
          setIsLoading(false);
        },
      });
      tokenClient.requestAccessToken({ prompt: "consent" });
      return true;
    } catch (err) {
      console.error("Error signing in:", err);
      setError("Failed to sign in with Google. Please try again.");
      setIsLoading(false);
      return false;
    }
  };

  // Helper: Speak a message using SpeechSynthesis
  const speakMessage = (message) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(message);
    synth.speak(utterance);
  };

  // Format date from inputs like "20250325" to "2025-03-25"
  const formatDate = (inputDate) => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(inputDate)) {
      return inputDate;
    }
    const digitsOnly = inputDate.replace(/\D/g, '');
    if (digitsOnly.length === 8) {
      const year = digitsOnly.substring(0, 4);
      const month = digitsOnly.substring(4, 6);
      const day = digitsOnly.substring(6, 8);
      return `${year}-${month}-${day}`;
    }
    return inputDate;
  };

  // Format time from inputs like "0200" to "02:00"
  const formatTime = (inputTime) => {
    if (/^\d{2}:\d{2}$/.test(inputTime)) {
      return inputTime;
    }
    const digitsOnly = inputTime.replace(/\D/g, '');
    if (digitsOnly.length === 4) {
      const hours = digitsOnly.substring(0, 2);
      const minutes = digitsOnly.substring(2, 4);
      return `${hours}:${minutes}`;
    }
    if (digitsOnly.length === 3) {
      const hours = digitsOnly.substring(0, 1).padStart(2, '0');
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
  const isValidDate = (dateString) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
  };

  // Validate time in HH:MM format
  const isValidTime = (timeString) => {
    const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return regex.test(timeString);
  };

  // Process raw voice input for date
  const processDateInput = (input) => {
    const processed = input.trim().replace(/[^\w\s]/g, '');
    const dateMatch = processed.match(/\b(\d{8}|\d{6})\b/);
    if (dateMatch) {
      return formatDate(dateMatch[0]);
    }
    if (/\b(today|now)\b/i.test(processed)) {
      const today = new Date();
      return formatDate(
        `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`
      );
    }
    if (/\b(tomorrow)\b/i.test(processed)) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return formatDate(
        `${tomorrow.getFullYear()}${String(tomorrow.getMonth() + 1).padStart(2, '0')}${String(tomorrow.getDate()).padStart(2, '0')}`
      );
    }
    return processed;
  };

  // Process raw voice input for time
  const processTimeInput = (input) => {
    const processed = input.trim().replace(/[^\w\s]/g, '');
    const timeMatch = processed.match(/\b(\d{4}|\d{3}|\d{2})\b/);
    if (timeMatch) {
      return formatTime(timeMatch[0]);
    }
    return processed;
  };

  // Ask a voice question and listen for the response
  const askVoiceQuestion = (question) => {
    return new Promise((resolve, reject) => {
      // Speak the question out loud
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
        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          resolve(transcript);
        };
        recognition.onerror = (event) => {
          reject(event.error);
        };
        recognition.start();
      };
      synth.speak(utterance);
    });
  };

  // Create a Calendar event via Google Calendar API using collected data
  const createVoiceCalendarEvent = async (data) => {
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
      
      return response.result.hangoutLink || null;
    } catch (err) {
      console.error("Error creating voice meeting event:", err);
      throw new Error(`Failed to create meeting: ${err.message || "Unknown error"}`);
    }
  };

  // Main voice meeting flow
  const startVoiceMeeting = async () => {
    if (!isSignedIn) {
      const signedIn = await handleVoiceSignIn();
      if (!signedIn) {
        setError("You need to sign in with Google to create a meeting.");
        return;
      }
    }
    try {
      setIsListening(true);
      setError(null);
      
      // Prepare an object to store responses
      const responses = {
        eventName: "",
        eventDescription: "",
        meetingDate: "",
        startTime: "",
        endTime: "",
      };

      responses.eventName = await askVoiceQuestion("What is the title of your meeting?");
      responses.eventDescription = await askVoiceQuestion("Please provide a brief description for your meeting.");
      
      // Get and process date input
      let dateResponse;
      do {
        dateResponse = await askVoiceQuestion(
          "What is the meeting date? You can say a date like 20250325 for March 25, 2025."
        );
        dateResponse = processDateInput(dateResponse);
      } while (!isValidDate(dateResponse));
      responses.meetingDate = dateResponse;
      
      // Get start time
      let timeResponse;
      do {
        timeResponse = await askVoiceQuestion(
          "What is the start time? For example, say 0200 for 2:00 AM."
        );
        timeResponse = processTimeInput(timeResponse);
      } while (!isValidTime(timeResponse));
      responses.startTime = timeResponse;
      
      // Get end time
      do {
        timeResponse = await askVoiceQuestion(
          "What is the end time? For example, say 0330 for 3:30 AM."
        );
        timeResponse = processTimeInput(timeResponse);
      } while (!isValidTime(timeResponse));
      responses.endTime = timeResponse;
      
      setVoiceMeetingData(responses);
      
      // Prepare display-friendly strings for confirmation
      const displayDate = new Date(responses.meetingDate).toLocaleDateString();
      const displayStartTime = new Date(`2000-01-01T${responses.startTime}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const displayEndTime = new Date(`2000-01-01T${responses.endTime}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      const confirmationText = `I'm about to create a meeting titled "${responses.eventName}" on ${displayDate} from ${displayStartTime} to ${displayEndTime}. Should I create this meeting?`;
      const confirmation = await askVoiceQuestion(confirmationText);
      
      if (/yes|yeah|yep|confirm|create it|sure/i.test(confirmation)) {
        const meetLink = await createVoiceCalendarEvent(responses);
        setVoiceMeetLink(meetLink);
        speakMessage("Your meeting has been created successfully!");
      } else {
        setError("Meeting creation cancelled.");
        speakMessage("Meeting creation cancelled.");
      }
    } catch (err) {
      console.error("Voice meeting error:", err);
      setError(err.message || "An error occurred during voice meeting setup.");
    } finally {
      setIsListening(false);
    }
  };

  // Modal handlers
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <Card
        className="w-full mt-6 p-4 border-l-4 border-l-[#ba9df1] hover:shadow-lg transition-shadow"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold flex items-center gap-3">
            <Video className="h-6 w-6 text-[#ba9df1]" />
            Create Video Meeting
          </CardTitle>
          <CardDescription className="mt-2 text-sm text-muted-foreground">
            Schedule a virtual meeting with students or colleagues using voice commands or manually.
          </CardDescription>
        </CardHeader>

        <CardContent className="py-4">
          <div className="flex flex-col sm:flex-row gap-5 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-[#ba9df1]" />
              <span>Instant or scheduled</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-[#ba9df1]" />
              <span>Up to 100 participants</span>
            </div>
          </div>
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>

        <CardFooter className="pt-4 flex flex-wrap justify-between items-center gap-3">
          <Button
            className={`gap-3 px-5 py-2 ${
              isHovering
                ? "bg-[#9d75eb] hover:bg-[#814de5]"
                : "bg-[#9d75eb] hover:bg-[#814de5]"
            }`}
            onClick={startVoiceMeeting}
            disabled={isListening || isLoading}
          >
            {isListening || isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
            {isListening ? "Listening..." : isLoading ? "Loading..." : "Start Meeting Now"}
          </Button>
          <Button variant="outline" className="px-5 py-2" onClick={openModal} disabled={isLoading}>
            Schedule
          </Button>
        </CardFooter>

        {voiceMeetLink && (
          <div className="mt-4 p-4 bg-[#cfbaf5] rounded">
            <p className="font-semibold text-[#814de5] mb-2">
              Your Google Meet has been created successfully!
            </p>
            <p className="mb-1">
              <strong>Meet Link:</strong>
            </p>
            <a
              href={voiceMeetLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline break-all"
            >
              {voiceMeetLink}
            </a>
            <p className="mt-2 text-sm text-[#814de5]">
              The meeting has been added to your Google Calendar.
            </p>
          </div>
        )}
      </Card>

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
