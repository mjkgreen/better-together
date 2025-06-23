"use client";

import { useSearchParams, notFound } from "next/navigation";
import { useEffect, useState } from "react";
import Matchmaker from "@/components/Matchmaker";
import { Event, User } from "../../../../generated/prisma/client";

interface MatchmakingPageProps {
  params: {
    eventId: string;
  };
}

const MatchmakingPage = ({ params }: MatchmakingPageProps) => {
  const { eventId } = params;
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

  const [event, setEvent] = useState<Event | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;
      try {
        // Fetch event and user details in parallel
        const [eventRes, userRes] = await Promise.all([fetch(`/api/events/${eventId}`), fetch(`/api/users/${userId}`)]);

        if (!eventRes.ok) throw new Error("Event not found");
        if (!userRes.ok) throw new Error("User not found");

        const eventData = await eventRes.json();
        const userData = await userRes.json();

        setEvent(eventData);
        setUser(userData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [eventId, userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-lg"
            style={{
              background:
                event?.primaryColor && event?.secondaryColor
                  ? `linear-gradient(to right, ${event.primaryColor}, ${event.secondaryColor})`
                  : "linear-gradient(to right, #4F46E5, #7C3AED)",
            }}
          >
            <svg className="w-8 h-8 text-white animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading your matches...</h2>
          <p className="text-gray-600">Finding the perfect connections for you</p>
        </div>
      </div>
    );
  }

  if (!event || !user) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Event Banner */}
      {event.bannerUrl && (
        <div className="relative h-48 sm:h-64 w-full">
          <img src={event.bannerUrl} alt={`${event.name} banner`} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

          {/* Custom Color Accent */}
          <div
            className="absolute bottom-0 left-0 w-full h-2"
            style={{
              background: `linear-gradient(to right, ${event.primaryColor || "#4F46E5"}, ${
                event.secondaryColor || "#7C3AED"
              })`,
            }}
          ></div>

          {/* Event Logo Overlay */}
          {event.logoUrl && (
            <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6">
              <img
                src={event.logoUrl}
                alt={`${event.name} logo`}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-4 border-white shadow-lg bg-white object-contain p-1"
              />
            </div>
          )}

          {/* Event Title Overlay */}
          <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 text-right">
            <h1 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">{event.name}</h1>
            <p className="text-white/90 text-sm sm:text-base mt-1">
              {new Date(event.date).toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      )}

      {/* Logo-only header for events without banner */}
      {!event.bannerUrl && (
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 py-8 relative overflow-hidden">
          {/* Custom Color Accent */}
          <div
            className="absolute bottom-0 left-0 w-full h-1"
            style={{
              background: `linear-gradient(to right, ${event.primaryColor || "#4F46E5"}, ${
                event.secondaryColor || "#7C3AED"
              })`,
            }}
          ></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center space-x-6">
              {event.logoUrl && (
                <img
                  src={event.logoUrl}
                  alt={`${event.name} logo`}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl shadow-lg bg-white object-contain p-2 border border-gray-200"
                />
              )}
              <div className="text-center">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">{event.name}</h1>
                <p className="text-gray-600 text-lg mt-2">
                  {new Date(event.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Matchmaker Component */}
      <Matchmaker event={event} user={user} />
    </div>
  );
};

export default MatchmakingPage;
