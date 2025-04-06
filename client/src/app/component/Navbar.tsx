"use client";
import Image from "next/image";
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const router = useRouter();

  return (
    <nav className="sticky top-0 z-10 bg-white shadow-md p-4 border-b border-gray-200">
      <div className="flex items-center justify-between">
        
        {/* SEARCH BAR */}
        <div className="hidden md:flex items-center gap-2 text-xs rounded-full border border-gray-300 px-3 py-1">
          <Image src="/search.png" alt="Search" width={16} height={16} />
          <input
            type="text"
            placeholder="Search..."
            aria-label="Search"
            className="w-[200px] p-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
          />
        </div>
        {/* ICONS AND USER */}
        <div className="flex items-center gap-6">
          <div className="bg-white rounded-full w-9 h-9 flex items-center justify-center cursor-pointer hover:bg-[#f3eefc] transition">
            <Image src="/message.png" alt="Messages" width={20} height={20} />
          </div>
          <div className="relative">
            <div className="bg-white rounded-full w-9 h-9 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition">
              <Image src="/announcement.png" alt="Announcements" width={20} height={20} />
            </div>
            <div className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center bg-purple-500 text-white rounded-full text-xs">
              1
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-sm font-medium text-gray-800">John Doe</span>
            <span className="text-[10px] text-gray-500">Admin</span>
          </div>
          <div 
            className="cursor-pointer"
            onClick={() => router.push('/dashboard/profile/admin')}
          >
            <Image src="/avatar.png" alt="User Avatar" width={40} height={40} className="rounded-full" />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
