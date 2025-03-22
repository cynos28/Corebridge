"use client"

import { Mic, Video, Calendar, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"

export default function VoiceCard() {
  const [isHovering, setIsHovering] = useState(false)

  return (
    <Card
      className="w-full mt-4 border-l-4 border-l-purple-500 hover:shadow-md transition-shadow"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Video className="h-5 w-5 text-purple-500" />
          Create Google Meeting
        </CardTitle>
        <CardDescription>Schedule a virtual meeting with students or colleagues</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>Instant or scheduled</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>Up to 100 participants</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button
          className={`gap-2 ${isHovering ? "bg-purple-600 hover:bg-purple-700" : "bg-purple-500 hover:bg-purple-600"}`}
        >
          <Mic className="h-4 w-4" />
          Start Meeting Now
        </Button>
        <Button variant="outline" className="ml-2">
          Schedule
        </Button>
      </CardFooter>
    </Card>
  )
}

