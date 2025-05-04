"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AnnouncementFormProps {
  type: "create" | "update";
  data?: any;
  onSuccess?: () => void;
  onClose?: () => void;
}

const AnnouncementForm = ({ type, data, onSuccess, onClose }: AnnouncementFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: data?.title || "",
    message: data?.message || "",
    class: data?.class || "",
    meetingLink: data?.meetingLink || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const url = `http://localhost:5000/api/announcements${type === "update" ? `/${data?._id}` : ""}`;
      const response = await fetch(url, {
        method: type === "create" ? "POST" : "PUT",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save announcement');
      }

      if (onSuccess) await onSuccess();
      if (onClose) onClose();
    } catch (error: any) {
      console.error('Error submitting form:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter announcement title"
            required
          />
        </div>

        <div>
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Enter announcement message"
            className="min-h-[100px]"
            required
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

        <div>
          <Label htmlFor="meetingLink">Meeting Link (Optional)</Label>
          <Input
            id="meetingLink"
            name="meetingLink"
            type="url"
            value={formData.meetingLink}
            onChange={handleChange}
            placeholder="Enter meeting link (optional)"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading 
            ? "Saving..." 
            : type === "create" 
              ? "Create Announcement" 
              : "Update Announcement"
          }
        </Button>
      </div>
    </form>
  );
};

export default AnnouncementForm;