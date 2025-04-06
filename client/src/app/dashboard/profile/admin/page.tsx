"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface Admin {
  _id: string;
  name: string;
  email: string;
  role: string;
  description?: string;
  photoUrl?: string;
}

interface Teacher {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  photoUrl?: string;
  addedBy: string;
}

export default function AdminProfile() {
  const router = useRouter();
  const [profile, setProfile] = useState<Admin | null>(null);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [newAdmin, setNewAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
      return;
    }
    fetchAdminProfile();
    fetchTeachers();
  }, [router]);

  const fetchAdminProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.status === 401) {
        localStorage.removeItem('token');
        router.push('/');
        return;
      }
      
      if (!response.ok) throw new Error('Failed to fetch profile');
      const data = await response.json();
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchTeachers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/teachers', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        router.push('/');
        return;
      }

      if (!response.ok) throw new Error('Failed to fetch teachers');
      const data: Teacher[] = await response.json();
      setTeachers(data);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  const updateProfile = async (formData: FormData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });
      
      if (!response.ok) throw new Error('Failed to update profile');
      
      const updatedProfile = await response.json();
      setProfile(updatedProfile);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const addNewAdmin = async (formData: FormData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/new', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create admin');
      }
      
      const newAdmin = await response.json();
      setNewAdmin(false);
      // Optionally refresh the admin list or show success message
    } catch (error: any) {
      console.error('Error creating admin:', error);
      // Optionally show error message to user
    }
  };

  const handleProfileUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    updateProfile(formData);
  };

  const handleNewAdmin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    addNewAdmin(formData);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Admin Profile Section */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32 mb-4">
                <Image
                  src={profile?.photoUrl || "/avatar.png"}
                  alt="Profile"
                  fill
                  className="rounded-full object-cover"
                  sizes="(max-width: 128px) 100vw, 128px"
                />
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800">{profile?.name}</h2>
                <span className="inline-block px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm font-medium mt-2">
                  {profile?.role}
                </span>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <span className="text-gray-600">{profile?.email}</span>
                  </div>
                </div>
                <p className="mt-4 text-gray-600 text-sm">{profile?.description || 'No description available'}</p>
              </div>
              
              <div className="mt-6 w-full space-y-3">
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Edit Profile
                </button>
                <button
                  onClick={() => setNewAdmin(true)}
                  className="w-full px-4 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
                >
                  Add New Admin
                </button>
              </div>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="mt-6 bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{teachers.length}</div>
                <div className="text-sm text-gray-600">Teachers</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">Active</div>
                <div className="text-sm text-gray-600">Status</div>
              </div>
            </div>
          </div>
        </div>

        {/* Teachers List */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold mb-4">Teachers Added</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teachers.map((teacher) => (
                <div key={teacher._id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <Image
                    src={teacher.photoUrl || "/avatar.png"}
                    alt={teacher.firstName}
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                  <div>
                    <h4 className="font-medium">{`${teacher.firstName} ${teacher.lastName}`}</h4>
                    <p className="text-sm text-gray-600">{teacher.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center"
        >
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <input
                type="text"
                name="name"
                defaultValue={profile?.name}
                placeholder="Name"
                className="w-full p-2 border rounded"
              />
              <input
                type="email"
                name="email"
                defaultValue={profile?.email}
                placeholder="Email"
                className="w-full p-2 border rounded"
              />
              <textarea
                name="description"
                defaultValue={profile?.description}
                placeholder="Description"
                className="w-full p-2 border rounded"
              />
              <input
                type="file"
                name="photo"
                className="w-full p-2 border rounded"
              />
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#ba9df1] text-white rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      )}

      {/* Add Admin Modal */}
      {newAdmin && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center"
        >
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <form onSubmit={handleNewAdmin} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Name"
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="w-full p-2 border rounded"
                required
              />
              <textarea
                name="description"
                placeholder="Description"
                className="w-full p-2 border rounded"
              />
              <input
                type="file"
                name="photo"
                className="w-full p-2 border rounded"
              />
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setNewAdmin(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#ba9df1] text-white rounded"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      )}
    </div>
  );
}
