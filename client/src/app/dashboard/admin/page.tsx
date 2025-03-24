import Announcement from "@/app/component/Announcement";
import AttendanceChart from "@/app/component/AttendanceChart";
import CountCharts from "@/app/component/CountCharts";
import EventCalendar from "@/app/component/EventCalendar";
import FinanceChart from "@/app/component/FinanceChart";
import UserCard from "@/app/component/UserCard";
import VoiceCard from "@/app/component/VoiceCard";

const AdminPage = () => {
  return (
    <div className=" p-4 flex gap-4 flex-col md:flex-row">
      {/* LEFT SECTION */}
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        {/* USER CARDS */}
        <div className="flex gap-4 justify-between flex-wrap">
          <UserCard type="student" />
          <UserCard type="teacher" />
          <UserCard type="parent" />
          <UserCard type="staff" />
        </div>

        {/* CHARTS */}
        <div className="flex flex-col gap-4">
          {/* TOP CHARTS */}
          <div className="flex gap-4 flex-col lg:flex-row">
            {/* COUNT CHART */}
            <div className="w-full lg:w-1/3 h-[450px]">
              <CountCharts />
            </div>
            {/* ATTENDANCE CHART */}
            <div className="w-full lg:w-2/3 h-[450px]">
              <AttendanceChart />
            </div>
          </div>
          {/* BOTTOM CHART */}
          <div className="w-full h-[500px]">
            {/* Additional content for bottom chart can go here */}
            <FinanceChart />
            <VoiceCard />
          </div>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8 bg-gray-100 rounded-lg">
        {/* Add content for the right section here */}
    
        <EventCalendar />
    
        <Announcement />
      </div>
    </div>
  );
};

export default AdminPage;
