"use client";

import { useState, useEffect } from "react";
import Announcements from "@/app/component/Announcement";
import BigCalendar from "@/app/component/BigCalendar";
import FormModal from "@/app/component/FormModal";
import Performance from "@/app/component/Performance";
import { role } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

const SingleTeacherPage = () => {
  const [teacher, setTeacher] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/teachers/${params.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.status === 401) {
          localStorage.removeItem('token');
          // You may want to redirect to login page here
          return;
        }

        if (!response.ok) throw new Error('Failed to fetch teacher');
        const data = await response.json();
        setTeacher(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchTeacher();
    }
  }, [params.id]);

  if (loading) return <div>Loading...</div>;
  if (!teacher) return <div>Teacher not found</div>;

  return (
    <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        {/* TOP */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* USER INFO CARD */}
          <div className="bg-cbSky py-6 px-4 rounded-md flex-1 flex gap-4">
            <div className="w-1/3">
              {teacher.photoUrl ? (
                <Image
                  src={`http://localhost:5000${teacher.photoUrl}`}
                  alt={`${teacher.firstName} ${teacher.lastName}`}
                  width={144}
                  height={144}
                  className="w-36 h-36 rounded-full object-cover"
                />
              ) : (
                <Image
                  src="/images/default/teacher.png"  // Updated path
                  alt="Default profile"
                  width={144}
                  height={144}
                  className="w-36 h-36 rounded-full object-cover"
                />
              )}
            </div>
            <div className="w-2/3 flex flex-col justify-between gap-4">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-semibold">{`${teacher.firstName} ${teacher.lastName}`}</h1>
                {role === "admin" && <FormModal table="teacher" type="update" data={teacher} />}
              </div>
              <p className="text-sm text-gray-500">
                {teacher.subjects?.join(", ") || "No subjects assigned"}
              </p>
              <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/blood.png" alt="" width={14} height={14} />
                  <span>{teacher.bloodType}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/date.png" alt="" width={14} height={14} />
                  <span>{new Date(teacher.birthday).toLocaleDateString()}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/mail.png" alt="" width={14} height={14} />
                  <span>{teacher.email}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/phone.png" alt="" width={14} height={14} />
                  <span>{teacher.phone}</span>
                </div>
              </div>
            </div>
          </div>
          {/* SMALL CARDS */}
          <div className="flex-1 flex gap-4 justify-between flex-wrap">
            {/* CARD */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/singleAttendance.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="">
                <h1 className="text-xl font-semibold">90%</h1>
                <span className="text-sm text-gray-400">Attendance</span>
              </div>
            </div>
            {/* CARD */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/singleBranch.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="">
                <h1 className="text-xl font-semibold">2</h1>
                <span className="text-sm text-gray-400">Branches</span>
              </div>
            </div>
            {/* CARD */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/singleLesson.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="">
                <h1 className="text-xl font-semibold">6</h1>
                <span className="text-sm text-gray-400">Lessons</span>
              </div>
            </div>
            {/* CARD */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/singleClass.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="">
                <h1 className="text-xl font-semibold">6</h1>
                <span className="text-sm text-gray-400">Classes</span>
              </div>
            </div>
          </div>
        </div>
        {/* BOTTOM */}
        <div className="mt-4 bg-white rounded-md p-4 h-[800px]">
          <h1>Teacher&apos;s Schedule</h1>
          <BigCalendar />
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        <div className="bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Shortcuts</h1>
          <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
            <Link className="p-3 rounded-md bg-cbSkyLight" href="/">
              Teacher&apos;s Classes
            </Link>
            <Link className="p-3 rounded-md bg-cbPurpleLight" href="/">
              Teacher&apos;s Students
            </Link>
            <Link className="p-3 rounded-md bg-cbYellowLight" href="/">
              Teacher&apos;s Lessons
            </Link>
            <Link className="p-3 rounded-md bg-pink-50" href="/">
              Teacher&apos;s Exams
            </Link>
            <Link className="p-3 rounded-md bg-cbSkyLight" href="/">
              Teacher&apos;s Assignments
            </Link>
          </div>
        </div>
        <Performance />
        <Announcements />
      </div>
    </div>
  );
};

export default SingleTeacherPage;
