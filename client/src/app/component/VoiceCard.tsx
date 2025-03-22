"use client";

import { useState } from "react";
import { Mic, Video, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Schedule from "./Schedule"; // Import the Schedule component

export default function VoiceCard() {
  const [isHovering, setIsHovering] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [meetingDetails, setMeetingDetails] = useState({
    title: "",
    date: "",
    participants: 0,
  });

  const handleStartMeeting = () => {
    setIsListening(true);
    // Logic for starting voice recognition and asking questions
  };

  const openModal = () => {
    setIsModalOpen(true); // Open the modal when the Schedule button is clicked
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  return (
    <Card
      className="w-full mt-6 p-4 border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold flex items-center gap-3">
          <Video className="h-6 w-6 text-purple-500" />
          Create Google Meeting
        </CardTitle>
        <CardDescription className="mt-2 text-sm text-muted-foreground">
          Schedule a virtual meeting with students or colleagues using voice commands
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
          className={`gap-3 px-5 py-2 ${isHovering ? "bg-purple-600 hover:bg-purple-700" : "bg-purple-500 hover:bg-purple-600"}`}
          onClick={handleStartMeeting}
        >
          <Mic className="h-4 w-4" />
          {isListening ? "Listening..." : "Start Meeting Now"}
        </Button>
        <Button variant="outline" className="ml-3 px-5 py-2" onClick={openModal}>
          Schedule
        </Button>
      </CardFooter>

      {isModalOpen && <Schedule open={isModalOpen} onClose={closeModal} />} {/* Render the Schedule component as a modal */}
    </Card>
  );
}
