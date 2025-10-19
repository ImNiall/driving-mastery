"use client";

import React, { useState, useEffect } from "react";
import { ProgressService } from "@/lib/services/progress";

export default function ProfilePageClient() {
  const [displayName, setDisplayName] = useState("");
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [region, setRegion] = useState("");
  const [testDate, setTestDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await ProgressService.updateProfile({
        display_name: displayName.trim() || undefined,
        name: name.trim() || undefined,
        country: city.trim() || undefined,
        region: region.trim() || undefined,
        test_date: testDate || undefined,
      });

      setMessage({
        type: "success",
        text: "Profile updated successfully! Your display name will appear on the leaderboard.",
      });
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error?.message || "Failed to update profile. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-2xl p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Profile Settings
        </h1>
        <p className="text-gray-600">
          Update your profile information. Your display name will be shown on
          the leaderboard.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="displayName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Display Name
              <span className="text-gray-500 font-normal ml-1">
                (shown on leaderboard)
              </span>
            </label>
            <input
              type="text"
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter your display name"
              maxLength={50}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
            />
            <p className="text-xs text-gray-500 mt-1">
              This name will be visible to other users on the leaderboard. Leave
              blank to use your full name.
            </p>
          </div>

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              maxLength={100}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
            />
            <p className="text-xs text-gray-500 mt-1">
              Used as fallback if no display name is set.
            </p>
          </div>

          <div>
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              City
            </label>
            <input
              type="text"
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="London"
              maxLength={50}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
            />
          </div>

          <div>
            <label
              htmlFor="region"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Region/State
            </label>
            <input
              type="text"
              id="region"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              placeholder="England, Scotland, Wales, etc."
              maxLength={50}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
            />
          </div>

          <div>
            <label
              htmlFor="testDate"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Theory Test Date
            </label>
            <input
              type="date"
              id="testDate"
              value={testDate}
              onChange={(e) => setTestDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
            />
            <p className="text-xs text-gray-500 mt-1">
              Set your test date to see a countdown and get targeted preparation
              reminders.
            </p>
          </div>

          {message && (
            <div
              className={`p-4 rounded-md ${
                message.type === "success"
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                loading
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                  : "bg-brand-blue text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2"
              }`}
            >
              {loading ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
