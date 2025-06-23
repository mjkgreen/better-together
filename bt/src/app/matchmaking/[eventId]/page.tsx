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
    return <div>Loading matches...</div>;
  }

  if (!event || !user) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Your Top Matches for {event.name}</h1>
          <p className="mt-4 text-lg text-gray-500">Based on your goals, here are the top people you should meet.</p>
        </div>
        <div className="mt-12">
          <Matchmaker event={event} user={user} />
        </div>
      </div>
    </div>
  );
};

export default MatchmakingPage;
