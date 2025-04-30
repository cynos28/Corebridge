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
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { CalendarIcon } from "lucide-react";

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

const SingleTeacherPage = () => {
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/teachers/${params.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error('Update failed');
      
      const updatedTeacher = await response.json();
      setTeacher(updatedTeacher);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating teacher:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!teacher) return <div>Teacher not found</div>;

  return (
    <div className="flex-1 p-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="space-y-1">
            <CardTitle>{`${teacher.firstName} ${teacher.lastName}`}</CardTitle>
            <CardDescription>{teacher.email}</CardDescription>
          </div>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)} variant="outline">
              Edit Profile
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              {!isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="relative w-40 h-40 mx-auto md:mx-0">
                      <img
                        src={teacher.photoUrl ? `http://localhost:5000${teacher.photoUrl}` : "/images/default/teacher.png"}
                        alt={`${teacher.firstName} ${teacher.lastName}`}
                        className="rounded-full object-cover w-full h-full ring-2 ring-purple-100"
                      />
                      <Badge className="absolute bottom-2 right-2 bg-purple-500">
                        {teacher.teacherId || 'ID Pending'}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {teacher.subjects?.map((subject, index) => (
                        <Badge key={index} variant="secondary">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <InfoItem label="Phone" value={teacher.phone} icon="📞" />
                    <InfoItem label="Address" value={teacher.address} icon="📍" />
                    <InfoItem label="Blood Type" value={teacher.bloodType} icon="🩸" />
                    <InfoItem label="Birthday" value={new Date(teacher.birthday).toLocaleDateString()} icon="🎂" />
                    <InfoItem label="Sex" value={teacher.sex} icon="👤" />
                  </div>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            name="firstName"
                            defaultValue={teacher.firstName}
                            placeholder="Enter first name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            name="lastName"
                            defaultValue={teacher.lastName}
                            placeholder="Enter last name"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            defaultValue={teacher.email}
                            placeholder="Enter email"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            name="phone"
                            defaultValue={teacher.phone}
                            placeholder="Enter phone number"
                          />
                        </div>
                      </div>

                      <div className="col-span-2 space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          name="address"
                          defaultValue={teacher.address}
                          placeholder="Enter address"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bloodType">Blood Type</Label>
                        <Select name="bloodType" defaultValue={teacher.bloodType}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select blood type" />
                          </SelectTrigger>
                          <SelectContent>
                            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Profile Photo</Label>
                        <Input
                          type="file"
                          onChange={handleImageChange}
                          accept="image/*"
                          className="cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-4">
                      <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">
                        Save Changes
                      </Button>
                    </div>
                  </form>
                </motion.div>
              )}
            </TabsContent>

            <TabsContent value="schedule">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Weekly Schedule</h2>
                <BigCalendar />
              </div>
            </TabsContent>

            <TabsContent value="performance">
              <Performance />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <QuickCard
          title="Classes"
          value="6"
          description="Active classes"
          trend="+2 from last semester"
        />
        <QuickCard
          title="Students"
          value="180"
          description="Total students"
          trend="+15 this month"
        />
        <QuickCard
          title="Attendance"
          value="95%"
          description="Average attendance"
          trend="+3% this month"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Frequently used teacher actions</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Button variant="outline" className="h-20 w-32">
            <div className="space-y-2 text-center">
              <CalendarIcon className="h-6 w-6 mx-auto" />
              <span className="text-xs">Schedule Class</span>
            </div>
          </Button>
          {/* Add more quick action buttons */}
        </CardContent>
      </Card>
    </div>
  );
};

// Helper components
const InfoItem = ({ label, value, icon }: { label: string; value: string; icon: string }) => (
  <div className="space-y-1">
    <div className="flex items-center gap-2">
      <span>{icon}</span>
      <span className="text-sm text-gray-500">{label}</span>
    </div>
    <p className="font-medium">{value}</p>
  </div>
);

const QuickCard = ({ title, value, description, trend }: { 
  title: string; 
  value: string; 
  description: string;
  trend: string;
}) => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium text-gray-500">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-gray-500">{description}</p>
      <p className="text-xs text-green-500 mt-1">{trend}</p>
    </CardContent>
  </Card>
);

export default SingleTeacherPage;
