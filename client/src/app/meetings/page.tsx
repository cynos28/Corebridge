import VoiceCard from "@/app/component/VoiceCard";
import Announcement from "@/app/component/Announcement";

export default function MeetingsPage() {
  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <VoiceCard />
        </div>
        <div className="md:col-span-1">
          <Announcement />
        </div>
      </div>
    </div>
  );
}