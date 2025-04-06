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
          'Authorization': `Bearer ${token}`
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
      
      if (!response.ok) throw new Error('Failed to create admin');
      
      setNewAdmin(false);
    } catch (error) {
      console.error('Error creating admin:', error);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32 mb-4">
                <Image
                  src={profile?.photoUrl || "/avatar.png"}
                  alt="Profile"
                  fill
                  className="rounded-full object-cover"
                />
                <button className="absolute bottom-0 right-0 bg-[#ba9df1] p-2 rounded-full">
                  <Image src="/upload.png" alt="Upload" width={20} height={20} />
                </button>
              </div>
              <h2 className="text-2xl font-bold">{profile?.name}</h2>
              <span className="text-[#ba9df1] font-medium">{profile?.role}</span>
              <p className="text-gray-600 text-center mt-2">{profile?.description}</p>
              
              <button
                onClick={() => setIsEditing(true)}
                className="mt-4 px-4 py-2 bg-[#ba9df1] text-white rounded-lg hover:bg-[#9d75eb]"
              >
                Edit Profile
              </button>
            </div>
          </div>
          
          <button
            onClick={() => setNewAdmin(true)}
            className="w-full mt-4 px-4 py-2 bg-[#ba9df1] text-white rounded-lg hover:bg-[#9d75eb]"
          >
            Add New Admin
          </button>
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
            {/* Add your edit form here */}
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
            {/* Add your new admin form here */}
          </div>
        </motion.div>
      )}
    </div>
  );
}
