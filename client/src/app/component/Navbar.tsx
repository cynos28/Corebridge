import Image from "next/image";

const Navbar = () => {
  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md h-[60px] flex items-center justify-between px-6">
      {/* Logo or App Name */}
      <div className="flex items-center gap-2">
        <Image src="/logo.png" alt="School Logo" width={30} height={30} />
        <span className="text-lg font-semibold">Corebridge</span>
      </div>

      {/* Search Bar */}
      <div className="hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-3 py-1 bg-gray-100">
        <Image src="/search.png" alt="Search Icon" width={14} height={14} />
        <input
          type="text"
          placeholder="Search..."
          className="w-[250px] md:w-[200px] p-1 bg-transparent outline-none"
          aria-label="Search"
        />
      </div>

      {/* Icons and User */}
      <div className="flex items-center gap-6">
        {/* Message Icon */}
        <div className="bg-white rounded-full w-8 h-8 flex items-center justify-center cursor-pointer shadow">
          <Image src="/message.png" alt="Messages" width={20} height={20} />
        </div>

        {/* Announcement Icon with Badge */}
        <div className="bg-white rounded-full w-8 h-8 flex items-center justify-center cursor-pointer relative shadow">
          <Image src="/announcement.png" alt="Announcements" width={20} height={20} />
          <div className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center bg-purple-500 text-white rounded-full text-xs">
            1
          </div>
        </div>

        {/* User Info */}
        <div className="flex flex-col text-right">
          <span className="text-xs leading-3 font-medium">John Doe</span>
          <span className="text-[10px] text-gray-500">Admin</span>
        </div>

        {/* User Avatar */}
        <Image
          src="/avatar.png"
          alt="User Avatar"
          width={36}
          height={36}
          className="rounded-full"
        />
      </div>
    </div>
  );
};

export default Navbar;
