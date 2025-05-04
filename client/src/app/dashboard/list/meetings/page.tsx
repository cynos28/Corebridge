'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { Video, Calendar, Clock, Users, Trash2 } from 'lucide-react';
import FormModal from '@/app/component/FormModal';
import TableSearch from '@/app/component/TableSearch';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface Meeting {
  _id: string;
  title: string;
  description: string;
  class: string;
  meetingDate: string;
  startTime: string;
  endTime: string;
  meetingLink?: string;
  createdBy: string;
}

const MeetingListPage = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string>('');

  useEffect(() => {
    // Check for user role and redirect if not authorized
    const role = localStorage.getItem('user-role');
    if (!role || (role !== 'admin' && role !== 'teacher')) {
      window.location.href = '/'; // Redirect unauthorized users
      return;
    }
    setUserRole(role);
  }, []);

  const fetchMeetings = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/meetings', {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('auth-token')}`,
          'Content-Type': 'application/json'
        },
      });
      
      if (!res.ok) {
        throw new Error('Failed to fetch meetings');
      }

      const data = await res.json();
      if (data.status === 'success') {
        setMeetings(data.data);
      } else {
        setError(data.message || 'Error fetching meetings');
      }
    } catch (error) {
      console.error('Error fetching meetings:', error);
      setError('Failed to load meetings. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this meeting?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/meetings/${id}`, {
        method: 'DELETE',
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('auth-token')}`,
          'Content-Type': 'application/json'
        },
      });

      if (response.ok) {
        setMeetings(meetings.filter(meeting => meeting._id !== id));
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to delete meeting');
      }
    } catch (error) {
      console.error('Error deleting meeting:', error);
      setError('Failed to delete meeting. Please try again.');
    }
  };

  const formatDate = (date: string) => {
    return format(new Date(date), 'MMMM dd, yyyy');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4A90E2]"></div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">All Meetings</h1>
        <div className="flex items-center gap-4">
          <TableSearch />
          {userRole === 'admin' && <FormModal table="meeting" type="create" />}
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {meetings.map((meeting) => (
            <motion.div
              key={meeting._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="bg-[#4A90E2]/10 pb-4">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-semibold text-[#4A90E2]">
                      {meeting.title}
                    </CardTitle>
                    {(userRole === 'admin' || userRole === 'teacher') && (
                      <div className="flex gap-2">
                        <FormModal table="meeting" type="update" data={meeting} />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100"
                          onClick={() => handleDelete(meeting._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-gray-600 text-sm mb-4">{meeting.description}</p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4 text-[#4A90E2]" />
                      <span>{formatDate(meeting.meetingDate)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4 text-[#4A90E2]" />
                      <span>{meeting.startTime} - {meeting.endTime}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="h-4 w-4 text-[#4A90E2]" />
                      <span>Class: {meeting.class}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50 mt-4">
                  {meeting.meetingLink ? (
                    <Button
                      className="w-full bg-[#4A90E2] hover:bg-[#50C878]"
                      onClick={() => window.open(meeting.meetingLink, '_blank')}
                    >
                      <Video className="h-4 w-4 mr-2" />
                      Join Meeting
                    </Button>
                  ) : (
                    <Button disabled className="w-full">No Link Available</Button>
                  )}
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {meetings.length === 0 && !error && (
        <div className="text-center py-10">
          <p className="text-gray-500">No meetings found.</p>
        </div>
      )}
    </div>
  );
};

export default MeetingListPage;