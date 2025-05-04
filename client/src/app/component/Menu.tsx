'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const menuItems = [
  {
    title: 'MENU',
    items: [
      {
        icon: '/home.png',
        label: 'Home',
        href: '/', // This will be dynamically updated based on role
        visible: ['admin', 'teacher', 'student', 'parent'],
      },
      {
        icon: '/teacher.png',
        label: 'Teachers',
        href: '/list/teachers',
        visible: ['admin', 'teacher'],
      },
      {
        icon: '/student.png',
        label: 'Students',
        href: '/list/students',
        visible: ['admin', 'teacher'],
      },
      {
        icon: '/parent.png',
        label: 'Parents',
        href: '/list/parents',
        visible: ['admin', 'teacher'],
      },
      {
        icon: '/subject.png',
        label: 'Subjects',
        href: '/list/subjects',
        visible: ['admin'],
      },
      {
        icon: '/class.png',
        label: 'Classes',
        href: '/list/classes',
        visible: ['admin', 'teacher'],
      },
      {
        icon: '/lesson.png',
        label: 'Lessons',
        href: '/list/lessons',
        visible: ['admin', 'teacher'],
      },
      {
        icon: '/exam.png',
        label: 'Exams',
        href: '/list/exams',
        visible: ['admin', 'teacher', 'student', 'parent'],
      },
      {
        icon: '/assignment.png',
        label: 'Assignments',
        href: '/list/assignments',
        visible: ['admin', 'teacher', 'student', 'parent'],
      },
      {
        icon: '/result.png',
        label: 'Results',
        href: '/list/results',
        visible: ['admin', 'teacher', 'student', 'parent'],
      },
      {
        icon: '/attendance.png',
        label: 'Attendance',
        href: '/list/attendance',
        visible: ['admin', 'teacher', 'student', 'parent'],
      },
      {
        icon: '/calendar.png',
        label: 'Meetings',
        href: '/list/meetings',
        visible: ['admin', 'teacher', 'student', 'parent'],
      },
      {
        icon: '/message.png',
        label: 'Messages',
        href: '/list/messages',
        visible: ['admin', 'teacher', 'student', 'parent'],
      },
      {
        icon: '/announcement.png',
        label: 'Announcements',
        href: '/list/announcements', // Fixed incorrect route
        visible: ['admin', 'teacher', 'student', 'parent'],
      },
      {
        icon: '/tickets.png',
        label: 'Tickets',
        href: '/list/tickets',
        visible: ['admin', 'student'],
      },
    ],
  },
  {
    title: 'OTHER',
    items: [
      {
        icon: '/profile.png',
        label: 'Profile',
        href: '/profile',
        visible: ['admin', 'teacher', 'student', 'parent'],
      },
      {
        icon: '/setting.png',
        label: 'Settings',
        href: '/settings',
        visible: ['admin', 'teacher', 'student', 'parent'],
      },
      {
        icon: '/logout.png',
        label: 'Logout',
        href: '/logout',
        visible: ['admin', 'teacher', 'student', 'parent'],
      },
    ],
  },
];

const Menu = () => {
  const router = useRouter();
  const [userRole, setUserRole] = useState('admin');

  useEffect(() => {
    const storedRole = localStorage.getItem('user-role');
    if (storedRole) {
      setUserRole(storedRole);
    } else {
      setUserRole('admin');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('user-role');
    setUserRole('');
    router.push('/');
  };

  // Function to determine the home route based on user role
  const getHomeRoute = (role) => {
    switch (role) {
      case 'admin':
        return '/dashboard/admin';
      case 'teacher':
        return '/dashboard/teacher';
      case 'student':
        return '/dashboard/student';
      case 'parent':
        return '/'; // Default for parent, or change to '/dashboard/parent' if needed
      default:
        return '/';
    }
  };

  return (
    <div className="mt-4 text-sm">
      {menuItems.map((group) => (
        <div className="flex flex-col gap-2" key={group.title}>
          <span className="hidden lg:block text-gray-400 font-light my-4">
            {group.title}
          </span>
          {group.items.map((item) => {
            if (item.visible.includes(userRole)) {
              // Dynamically set the href for the Home item
              const itemHref = item.label === 'Home' ? getHomeRoute(userRole) : item.href;

              if (item.label === 'Logout') {
                return (
                  <button
                    key={item.label}
                    onClick={handleLogout}
                    className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-[#f3eefc] hover:text-[#9d75eb]"
                  >
                    <Image
                      src={item.icon}
                      alt=""
                      width={20}
                      height={20}
                      className="group-hover:filter group-hover:brightness-0 group-hover:invert-[0.5] group-hover:sepia group-hover:saturate-[5] group-hover:hue-rotate-[250deg] group-hover:brightness-[1.2] group-hover:contrast-[1.2]"
                    />
                    <span className="hidden lg:block">{item.label}</span>
                  </button>
                );
              }
              return (
                <Link
                  href={itemHref}
                  key={item.label}
                  className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-[#f3eefc] hover:text-[#9d75eb]"
                >
                  <Image
                    src={item.icon}
                    alt=""
                    width={20}
                    height={20}
                    className="group-hover:filter group-hover:brightness-0 group-hover:invert-[0.5] group-hover:sepia group-hover:saturate-[5] group-hover:hue-rotate-[250deg] group-hover:brightness-[1.2] group-hover:contrast-[1.2]"
                  />
                  <span className="hidden lg:block">{item.label}</span>
                </Link>
              );
            }
            return null;
          })}
        </div>
      ))}
    </div>
  );
};

export default Menu;