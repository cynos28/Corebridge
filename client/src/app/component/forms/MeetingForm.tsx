"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface MeetingFormProps {
  type: "create" | "update";
  data?: any;
  onSuccess?: () => void;
  onClose?: () => void;
}

const MeetingForm = ({ type, data, onSuccess, onClose }: MeetingFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: data?.title || "",
    description: data?.description || "",
    meetingDate: data?.meetingDate ? format(new Date(data.meetingDate), "yyyy-MM-dd") : "",
    startTime: data?.startTime || "",
    endTime: data?.endTime || "",
    meetingLink: data?.meetingLink || "",
    class: data?.class || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem('auth-token');
      const url = type === 'create' 
        ? 'http://localhost:5000/api/meetings'
        : `http://localhost:5000/api/meetings/${data?._id}`;

      // Ensure date is in correct format
      const formattedDate = format(new Date(formData.meetingDate), 'yyyy-MM-dd');

      const response = await fetch(url, {
        method: type === 'create' ? 'POST' : 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          meetingDate: formattedDate,
          createdBy: localStorage.getItem('userId') || 'unknown'
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save meeting');
      }

      toast.success(`Meeting ${type === 'create' ? 'created' : 'updated'} successfully`);
      if (onSuccess) onSuccess();
      if (onClose) onClose();

      // Dispatch custom event to notify BigCalendar to refresh
      window.dispatchEvent(new CustomEvent('meeting-updated'));
    } catch (error: any) {
      toast.error(error.message || `Failed to ${type} meeting`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter meeting title"
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter meeting description"
            className="w-full min-h-[100px] p-2 border rounded-md"
            required
          />
        </div>

        <div>
          <Label htmlFor="meetingDate">Meeting Date</Label>
          <Input
            id="meetingDate"
            name="meetingDate"
            type="date"
            value={formData.meetingDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="startTime">Start Time</Label>
            <Input
              id="startTime"
              name="startTime"
              type="time"
              value={formData.startTime}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="endTime">End Time</Label>
            <Input
              id="endTime"
              name="endTime"
              type="time"
              value={formData.endTime}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="meetingLink">Meeting Link (Optional)</Label>
          <Input
            id="meetingLink"
            name="meetingLink"
            type="url"
            value={formData.meetingLink}
            onChange={handleChange}
            placeholder="Enter meeting link (Google Meet, Zoom, etc.)"
          />
        </div>

        <div>
          <Label htmlFor="class">Class</Label>
          <Input
            id="class"
            name="class"
            value={formData.class}
            onChange={handleChange}
            placeholder="Enter class name"
            required
          />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onClose}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : type === "create" ? "Create Meeting" : "Update Meeting"}
        </Button>
      </div>
    </form>
  );
};

export default MeetingForm;