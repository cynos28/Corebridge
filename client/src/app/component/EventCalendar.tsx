"use client";

import Image from "next/image";
import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const events = [
  {
    id: 1,
    title: "Parent-Teacher Conference",
    time: "9:00 AM - 11:00 AM",
    description: "Discuss student progress and school activities with our dedicated staff.",
  },
  {
    id: 2,
    title: "Art Workshop",
    time: "1:00 PM - 3:00 PM",
    description: "Join the interactive art workshop to explore your creative side at Corebridge.",
  },
  {
    id: 3,
    title: "Sports Day",
    time: "10:00 AM - 4:00 PM",
    description: "Enjoy a day full of sports and fun activities designed for a healthy lifestyle.",
  },
];

const EventCalendar = () => {
  const [value, onChange] = useState<Value>(new Date());

  return (
    <div className="bg-white p-4 rounded-md ">
      <Calendar onChange={onChange} value={value} />
      <div className="flex items-center justify-between mt-4">
        <h1 className="text-xl font-semibold">Corebridge Events</h1>
        <Image src="/moreDark.png" alt="More" width={20} height={20} />
      </div>
      <div className="flex flex-col gap-4 mt-4">
        {events.map((event) => (
          <div
            className="p-5 rounded-md border-2 border-gray-100 border-t-4 odd:border-t-[#9d75eb] even:border-t-[#d6c5f7]"
            key={event.id}
          >
            <div className="flex items-center justify-between">
              <h1 className="font-semibold text-gray-600">{event.title}</h1>
              <span className="text-gray-300 text-xs">{event.time}</span>
            </div>
            <p className="mt-2 text-gray-400 text-sm">{event.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventCalendar;
