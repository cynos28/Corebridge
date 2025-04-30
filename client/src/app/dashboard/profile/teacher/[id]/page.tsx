"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import BigCalendar from "@/app/component/BigCalendar";
import Performance from "@/app/component/Performance";
import Announcements from "@/app/component/Announcement";
import { motion } from "framer-motion";

interface Teacher {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  bloodType: string;
  birthday: string;
  sex: string;
  subjects: string[];
  photoUrl?: string;
  teacherId?: string;
}

const TeacherProfilePage = () => {
  const router = useRouter();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const params = useParams();

  useEffect(() => {
    if (!params?.id) {
      setError('No teacher ID provided');
      setLoading(false);
      return;
    }
    
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('user-role');
      const userId = localStorage.getItem('user-id');

      if (!token || !role || !userId) {
        router.push('/');
        return;
      }

      // Only allow teachers to view their own profile or admins to view any profile
      if (role === 'teacher' && userId !== params.id) {
        router.push('/dashboard');
        return;
      }

      await fetchTeacher();
    };

    checkAuth();
  }, [params?.id, router]);

  const fetchTeacher = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/');
        return;
      }

      const role = localStorage.getItem('user-role');
      if (role !== 'teacher' && role !== 'admin') {
        router.push('/');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/teachers/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user-role');
        localStorage.removeItem('user-id');
        router.push('/');
        return;
      }

      if (!response.ok) throw new Error('Failed to fetch teacher');
      const data = await response.json();
      setTeacher(data);
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch teacher');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTeacher = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const formData = new FormData(e.currentTarget);

      // Add existing fields that aren't in the form
      if (teacher) {
        Object.entries(teacher).forEach(([key, value]) => {
          if (!formData.has(key) && key !== 'photoUrl' && key !== '_id') {
            formData.append(key, value);
          }
        });
      }

      // Add selected image if any
      if (selectedImage) {
        formData.append('photo', selectedImage);
      }

      const response = await fetch(`http://localhost:5000/api/teachers/${params.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) throw new Error('Failed to update teacher');
      
      const updatedTeacher = await response.json();
      setTeacher(updatedTeacher);
      setIsEditing(false);
      
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'Failed to update teacher');
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
  if (!teacher) return <div>Teacher not found</div>;

  return (
    <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
      <div className="w-full xl:w-2/3">
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="flex items-start gap-6">
            <div className="relative w-32 h-32">
              <Image
                src={teacher.photoUrl ? `http://localhost:5000${teacher.photoUrl}` : "/images/default/teacher.png"}
                alt={`${teacher.firstName} ${teacher.lastName}`}
                fill
                className="rounded-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-semibold">{`${teacher.firstName} ${teacher.lastName}`}</h1>
                  <p className="text-gray-600 mt-1">{teacher.email}</p>
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                  Edit Profile
                </button>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500">Teacher ID</p>
                  <p className="font-medium">{teacher.teacherId || 'Not assigned'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Phone</p>
                  <p className="font-medium">{teacher.phone}</p>
                </div>
                <div>
                  <p className="text-gray-500">Address</p>
                  <p className="font-medium">{teacher.address}</p>
                </div>
                <div>
                  <p className="text-gray-500">Blood Type</p>
                  <p className="font-medium">{teacher.bloodType}</p>
                </div>
                <div>
                  <p className="text-gray-500">Birthday</p>
                  <p className="font-medium">{new Date(teacher.birthday).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-500">Sex</p>
                  <p className="font-medium">{teacher.sex}</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-gray-500">Subjects</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {teacher.subjects?.map((subject, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
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

      {/* Edit Profile Modal */}
      {isEditing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleUpdateTeacher} className="space-y-6">
              <h2 className="text-xl font-semibold">Edit Profile</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    defaultValue={teacher.firstName}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    defaultValue={teacher.lastName}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={teacher.email}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    defaultValue={teacher.phone}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <input
                    type="text"
                    name="address"
                    defaultValue={teacher.address}
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

export default TeacherProfilePage;
