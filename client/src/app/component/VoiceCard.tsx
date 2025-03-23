"use client";

import { useState, useEffect } from "react";
import { Mic, Video, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Schedule from "./Schedule";

export default function VoiceCard() {
  const [isHovering, setIsHovering] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // For manual scheduling
  const [voiceMeetingData, setVoiceMeetingData] = useState({
    eventName: "",
    eventDescription: "",
    meetingDate: "",
    startTime: "",
    endTime: "",
  });
  const [voiceMeetLink, setVoiceMeetLink] = useState<string | null>(null);

  // States for Google API and sign-in
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isGapiLoaded, setIsGapiLoaded] = useState(false);
  const [isGsiLoaded, setIsGsiLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Google API configuration (move to environment variables in production)
  const CLIENT_ID =
    "528464651880-3o57pe8bqa0q3b932tlq47td0fo0hpcu.apps.googleusercontent.com";
  const API_KEY = "AIzaSyD72BvEfn7N5ikxzhxqBkwOj3EVB9-kwng";
  const DISCOVERY_DOCS = [
    "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
  ];
  const SCOPES = "https://www.googleapis.com/auth/calendar.events";

  // Load GAPI and GSI scripts if needed
  useEffect(() => {
    const loadGapiScript = () => {
      const script = document.createElement("script");
      script.src = "https://apis.google.com/js/api.js";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        initializeGapiClient();
      };
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
      script.onload = () => {
        setIsGsiLoaded(true);
      };
      script.onerror = () => {
        console.error("Error loading GSI script");
        setError(
          "Failed to load Google Identity Services. Please try again later."
        );
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
      setIsGapiLoaded(true);
    } catch (error) {
      console.error("Error initializing GAPI client:", error);
      setError("Failed to initialize Google Calendar API. Please try again.");
    }
  };

  // Sign in using Google Identity Services
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
      tokenClient.requestAccessToken({ prompt: "consent" });
      return true;
    } catch (error) {
      console.error("Error signing in:", error);
      setError("Failed to sign in with Google. Please try again.");
      setIsLoading(false);
      return false;
    }
  };

  // Create a calendar event for the voice meeting using the collected data
  const createVoiceCalendarEvent = async (data: {
    eventName: string;
    eventDescription: string;
    meetingDate: string;
    startTime: string;
    endTime: string;
  }) => {
    if (!window.gapi?.client) {
      alert("Google Calendar API is not available. Please refresh and try again.");
      return;
    }
    try {
      if (!window.gapi.client.calendar) {
        await window.gapi.client.load("calendar", "v3");
      }
      const requestId = `meet_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 11)}`;
      const startDate = new Date(`${data.meetingDate}T${data.startTime}:00`);
      const endDate = new Date(`${data.meetingDate}T${data.endTime}:00`);
      const event = {
        summary: data.eventName,
        description: data.eventDescription,
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
      setVoiceMeetLink(response.result.hangoutLink || null);
    } catch (error) {
      console.error("Error creating voice meeting event:", error);
      alert("Failed to create voice meeting. Please try again.");
    }
  };

  // Helper that uses the Web Speech API to speak a question and then listen for the answer
  const askVoiceQuestion = (question: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      // Use SpeechSynthesis to speak out the question
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(question);
      utterance.onend = () => {
        // Once speaking is finished, use SpeechRecognition to capture your answer
        const SpeechRecognition =
          (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
          reject("Browser does not support Speech Recognition.");
          return;
        }
        const recognition = new SpeechRecognition();
        recognition.lang = "en-US";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        recognition.onresult = (event: any) => {
          // The captured answer is available as the transcript
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
  

  // This function runs the voice meeting flow:
  // It asks a series of questions and collects the user’s responses.
  const startVoiceMeeting = async () => {
    if (!isSignedIn) {
      const signedIn = await handleVoiceSignIn();
      if (!signedIn) {
        alert("You need to sign in with Google to create a meeting.");
        return;
      }
    }
    try {
      setIsListening(true);
      const responses: {
        eventName: string;
        eventDescription: string;
        meetingDate: string;
        startTime: string;
        endTime: string;
      } = {
        eventName: "",
        eventDescription: "",
        meetingDate: "",
        startTime: "",
        endTime: "",
      };

      responses.eventName = await askVoiceQuestion(
        "What is the title of your meeting?"
      );
      responses.eventDescription = await askVoiceQuestion(
        "Please provide a brief description for your meeting."
      );
      responses.meetingDate = await askVoiceQuestion(
        "What is the meeting date? Please answer in the format YYYY-MM-DD."
      );
      responses.startTime = await askVoiceQuestion(
        "What is the start time for the meeting? Please answer in HH:MM format."
      );
      responses.endTime = await askVoiceQuestion(
        "What is the end time for the meeting? Please answer in HH:MM format."
      );

      setVoiceMeetingData(responses);
      await createVoiceCalendarEvent(responses);
      setIsListening(false);
    } catch (error: any) {
      console.error("Voice meeting error:", error);
      alert("An error occurred during voice meeting: " + error);
      setIsListening(false);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Card
        className="w-full mt-6 p-4 border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold flex items-center gap-3">
            <Video className="h-6 w-6 text-purple-500" />
            Create Video Meeting
          </CardTitle>
          <CardDescription className="mt-2 text-sm text-muted-foreground">
            Schedule a virtual meeting with students or colleagues using voice commands or manually.
          </CardDescription>
        </CardHeader>

        <CardContent className="py-4">
          <div className="flex flex-col sm:flex-row gap-5 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-500" />
              <span>Instant or scheduled</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-500" />
              <span>Up to 100 participants</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-4 flex justify-between items-center">
          <Button
            className={`gap-3 px-5 py-2 ${
              isHovering
                ? "bg-purple-600 hover:bg-purple-700"
                : "bg-purple-500 hover:bg-purple-600"
            }`}
            onClick={startVoiceMeeting}
            disabled={isListening || isLoading}
          >
            <Mic className="h-4 w-4" />
            {isListening ? "Listening..." : "Start Meeting Now"}
          </Button>
          <Button variant="outline" className="ml-3 px-5 py-2" onClick={openModal}>
            Schedule
          </Button>
        </CardFooter>

        {voiceMeetLink && (
          <div className="mt-4 p-4 bg-green-100 rounded">
            <p>Your Google Meet has been created successfully!</p>
            <p>
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
            <p>The meeting has been added to your Google Calendar.</p>
          </div>
        )}
      </Card>
      {isModalOpen && <Schedule open={isModalOpen} onClose={closeModal} />}
    </>
  );
}
