"use client";

import { useState } from "react";

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    account: {
      name: "Nimal Perera",
      email: "nimal.perera@example.com",
      phone: "+94 77 123 4567",
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
    },
    password: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleInputChange = (e, section, field) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder for form submission logic
    console.log("Settings updated:", settings);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full overflow-hidden transition-all duration-300 hover:shadow-2xl">
        {/* Settings Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-8 text-white">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="mt-2 text-sm opacity-80">
            Manage your account preferences and security settings
          </p>
        </div>

        {/* Settings Content */}
        <div className="p-8">
          <form onSubmit={handleSubmit}>
            {/* Account Information */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Account Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-gray-500">Full Name</label>
                  <input
                    type="text"
                    value={settings.account.name}
                    onChange={(e) => handleInputChange(e, "account", "name")}
                    className="mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-500">Email</label>
                  <input
                    type="email"
                    value={settings.account.email}
                    onChange={(e) => handleInputChange(e, "account", "email")}
                    className="mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-500">Phone</label>
                  <input
                    type="tel"
                    value={settings.account.phone}
                    onChange={(e) => handleInputChange(e, "account", "phone")}
                    className="mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Notification Preferences</h2>
              <div className="space-y-4">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={settings.notifications.emailNotifications}
                    onChange={(e) => handleInputChange(e, "notifications", "emailNotifications")}
                    className="h-5 w-5 text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">Email Notifications</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={settings.notifications.smsNotifications}
                    onChange={(e) => handleInputChange(e, "notifications", "smsNotifications")}
                    className="h-5 w-5 text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">SMS Notifications</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={settings.notifications.pushNotifications}
                    onChange={(e) => handleInputChange(e, "notifications", "pushNotifications")}
                    className="h-5 w-5 text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">Push Notifications</span>
                </label>
              </div>
            </div>

            {/* Change Password */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Change Password</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-gray-500">Current Password</label>
                  <input
                    type="password"
                    value={settings.password.currentPassword}
                    onChange={(e) => handleInputChange(e, "password", "currentPassword")}
                    className="mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-500">New Password</label>
                  <input
                    type="password"
                    value={settings.password.newPassword}
                    onChange={(e) => handleInputChange(e, "password", "newPassword")}
                    className="mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-500">Confirm New Password</label>
                  <input
                    type="password"
                    value={settings.password.confirmPassword}
                    onChange={(e) => handleInputChange(e, "password", "confirmPassword")}
                    className="mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;