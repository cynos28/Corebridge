"use client";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('user-role');
        const id = localStorage.getItem('user-id');

        if (!token || !role || !id) {
          router.push('/');
          return;
        }

        let url = 'http://localhost:5000/api';
        if (role === 'admin') {
          url += '/admin/profile';
        } else if (role === 'teacher') {
          url += `/teachers/${id}`;
        } else if (role === 'student') {
          url += `/students/${id}`;
        }

        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          
          // Format display name based on role
          const displayName = role === 'admin' ? 
            data.name : 
            `${data.firstName} ${data.lastName}`;
          
          // Handle photo URL
          const photoUrl = data.photoUrl ? 
            `http://localhost:5000${data.photoUrl}` : 
            '/images/default/avatar.png';
          
          setUser({
            ...data,
            displayName,
            role: role.charAt(0).toUpperCase() + role.slice(1),
            photoUrl
          });
        } else if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user-role');
          localStorage.removeItem('user-id');
          router.push('/');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user-role');
    router.push('/');
  };

  const getProfilePath = () => {
    const role = localStorage.getItem('user-role');
    const id = localStorage.getItem('user-id');
    
    switch(role) {
      case 'admin':
        return '/dashboard/profile/admin';
      case 'teacher':
        return `/profile/teacher/${id}`;
      case 'student':
        return `/profile/student/${id}`;
      default:
        return '/';
    }
  };

  return (
    <nav className="sticky top-0 z-10 bg-white shadow-md p-4 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div className="hidden md:flex items-center gap-2 text-xs rounded-full border border-gray-300 px-3 py-1">
          <Image src="/search.png" alt="Search" width={16} height={16} />
          <input
            type="text"
            placeholder="Search..."
            aria-label="Search"
            className="w-[200px] p-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
          />
        </div>

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
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-sm font-medium text-gray-800">{user?.displayName || 'Loading...'}</span>
              <span className="text-[10px] text-gray-500">{user?.role}</span>
              <span className="text-[10px] text-gray-400">{user?.email}</span>
            </div>
            <div className="relative group">
              <div 
                className="cursor-pointer"
                onClick={() => router.push(getProfilePath())}
              >
                <Image 
                  src={user?.photoUrl || "/avatar.png"} 
                  alt="User Avatar" 
                  width={40} 
                  height={40} 
                  className="rounded-full"
                />
              </div>
              <div className="hidden group-hover:block absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                <button
                  onClick={() => router.push(getProfilePath())}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
