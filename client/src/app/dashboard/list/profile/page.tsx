"use client";

import Image from "next/image";
import { useState } from "react";

const ProfilePage = () => {
  const [profile] = useState({
    name: "Nimal Perera",
    role: "Class Teacher",
    email: "nimal.perera@example.com",
    phone: "+94 77 123 4567",
    address: "123 Temple Road, Kandy, Sri Lanka",
    joinedDate: "2022-01-15",
    avatar: "/user-avatar.png",
    bio: "Passionate educator with over 10 years of experience in teaching and mentoring students. Dedicated to fostering a positive learning environment.",
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full overflow-hidden transition-all duration-300 hover:shadow-2xl">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-8 text-white">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative w-36 h-36 group">
              <Image
                src={profile.avatar}
                alt="User Avatar"
                fill
                className="rounded-full object-cover border-4 border-white shadow-md transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold tracking-tight">{profile.name}</h1>
              <p className="text-lg font-medium text-blue-100">{profile.role}</p>
              <p className="mt-3 text-sm opacity-80">
                Member since{" "}
                <span className="font-semibold">{profile.joinedDate}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-8">
          {/* Bio Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">About Me</h2>
            <p className="text-gray-600 leading-relaxed">{profile.bio}</p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <svg
                className="w-6 h-6 text-blue-500 mt-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-base font-medium text-gray-800">
                  {profile.email}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg
                className="w-6 h-6 text-blue-500 mt-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="text-base font-medium text-gray-800">
                  {profile.phone}
                </p>
              </div>
            </div>
            <div className="md:col-span-2 flex items-start gap-3">
              <svg
                className="w-6 h-6 text-blue-500 mt-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="text-base font-medium text-gray-800">
                  {profile.address}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;