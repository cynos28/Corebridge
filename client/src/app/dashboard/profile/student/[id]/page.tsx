"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import BigCalendar from "@/app/component/BigCalendar";
import Performance from "@/app/component/Performance";
import Announcements from "@/app/component/Announcement";

interface Student {
  _id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  grade: number;
  class: string;
  sex: string;
  photoUrl?: string;
}

const StudentProfilePage = () => {
  const router = useRouter();
  const params = useParams();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  useEffect(() => {
    if (!params?.id) {
      setError("No student ID provided");
      setLoading(false);
      return;
    }
    fetchStudent();
  }, [params?.id]);

  const fetchStudent = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/");
        return;
      }

      const response = await fetch(`http://localhost:5000/api/students/${params.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch student");
      const data = await response.json();
      setStudent(data);
    } catch (error) {
      console.error("Error:", error);
      setError(error instanceof Error ? error.message : "Failed to fetch student");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStudent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const formData = new FormData(e.currentTarget);

      // Add existing fields that aren't in the form
      if (student) {
        Object.entries(student).forEach(([key, value]) => {
          if (!formData.has(key) && key !== 'photoUrl' && key !== '_id') {
            formData.append(key, value);
          }
        });
      }

      if (selectedImage) {
        formData.append("photo", selectedImage);
      }

      const response = await fetch(`http://localhost:5000/api/students/${params.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to update student");
      const updatedStudent = await response.json();
      setStudent(updatedStudent);
      setIsEditing(false);
    } catch (error) {
      console.error("Error:", error);
      setError(error instanceof Error ? error.message : "Failed to update student");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!student) return <div>Student not found</div>;

  return (
    <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
      <div className="w-full xl:w-2/3">
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="flex items-start gap-6">
            <div className="relative w-32 h-32">
              <Image
                src={student.photoUrl ? `http://localhost:5000${student.photoUrl}` : "/images/default/avatar.png"}
                alt={`${student.firstName} ${student.lastName}`}
                fill
                className="rounded-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-semibold">{`${student.firstName} ${student.lastName}`}</h1>
              <p className="text-gray-600 mt-1">{student.email}</p>
              <p className="text-gray-600">Student ID: {student.studentId}</p>
              <p className="text-gray-600">Grade {student.grade} - Class {student.class}</p>
              <button
                onClick={() => setIsEditing(true)}
                className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500">Phone</p>
              <p className="font-medium">{student.phone}</p>
            </div>
            <div>
              <p className="text-gray-500">Address</p>
              <p className="font-medium">{student.address}</p>
            </div>
            <div>
              <p className="text-gray-500">Sex</p>
              <p className="font-medium">{student.sex}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Schedule</h2>
          <BigCalendar />
        </div>
      </div>

      <div className="w-full xl:w-1/3 space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Performance Overview</h2>
          <Performance />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Announcements</h2>
          <Announcements />
        </div>
      </div>

      {isEditing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleUpdateStudent} className="space-y-6">
              <h2 className="text-xl font-semibold">Edit Profile</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    defaultValue={student.firstName}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    defaultValue={student.lastName}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={student.email}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    defaultValue={student.phone}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <input
                    type="text"
                    name="address"
                    defaultValue={student.address}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Profile Photo</label>
                  <input
                    type="file"
                    onChange={handleImageChange}
                    accept="image/*"
                    className="mt-1 block w-full"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default StudentProfilePage;
