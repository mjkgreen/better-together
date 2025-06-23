"use client";

import { useState } from "react";

interface SeedAttendeesButtonProps {
  eventId: string;
}

const SeedAttendeesButton = ({ eventId }: SeedAttendeesButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSeedAttendees = async () => {
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch(`/api/events/${eventId}/seed`, {
        method: "POST",
      });

      const data = await response.json();

      if (response.ok) {
        if (data.totalAttempted) {
          setMessage(`✅ ${data.message} (${data.count}/${data.totalAttempted} attempted)`);
        } else {
          setMessage(`✅ ${data.message} (${data.count} attendees)`);
        }

        // Reload the page after a short delay to show the success message
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        setMessage(`❌ ${data.error || "Failed to seed attendees"}`);
      }
    } catch (error) {
      setMessage("❌ Network error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Only show in development mode
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  return (
    <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <h3 className="text-sm font-medium text-yellow-800 mb-2">Demo Mode</h3>
      <button
        onClick={handleSeedAttendees}
        disabled={isLoading}
        className="bg-yellow-600 text-white font-medium py-2 px-4 rounded hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300"
      >
        {isLoading ? "Adding Attendees..." : "Add Demo Attendees"}
      </button>
      {message && <p className="mt-2 text-sm text-yellow-700">{message}</p>}
    </div>
  );
};

export default SeedAttendeesButton;
