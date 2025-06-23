"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function JoinEventPage() {
  const [eventUrl, setEventUrl] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleJoin = () => {
    setError("");
    try {
      const url = new URL(eventUrl);
      // Expected format: http://localhost:3000/events/EVENT_ID
      const pathSegments = url.pathname.split("/");
      if (pathSegments.length >= 3 && pathSegments[1] === "events") {
        const eventId = pathSegments[2];
        if (eventId) {
          router.push(`/events/${eventId}/register`);
          return;
        }
      }
      setError("Invalid event URL. Please paste the full event page URL.");
    } catch (e) {
      setError("Invalid URL format. Please paste the full event page URL.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Join an Event</h2>
        <p className="mt-2 text-center text-sm text-gray-600">Paste the event page URL below to get started.</p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <div>
              <label htmlFor="eventUrl" className="block text-sm font-medium text-gray-700">
                Event Page URL
              </label>
              <div className="mt-1">
                <input
                  id="eventUrl"
                  name="eventUrl"
                  type="url"
                  required
                  value={eventUrl}
                  onChange={(e) => setEventUrl(e.target.value)}
                  className="appearance-none block w-full px-3 text-black py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="https://example.com/events/..."
                />
              </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div>
              <button
                onClick={handleJoin}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Join Event
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
