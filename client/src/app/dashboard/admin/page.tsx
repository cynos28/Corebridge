import UserCard from "@/app/component/UserCard";

const AdminPage = () => {
  return (
    <div className="pt-20 p-4 flex gap-4 flex-col md:flex-row">
      {/* LEFT */}
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        {/* USER CARDS */}
        <div className="flex gap-4 justify-between flex-wrap">
          <UserCard type="student" />
          <UserCard type="teacher" />
          <UserCard type="parent" />
          <UserCard type="staff" />
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8 bg-gray-100 rounded-lg"></div>
    </div>
  );
};

export default AdminPage;
