"use client";

import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import AttendeeRegisterForm from "@/components/AttendeeRegisterForm";
import AttendeeSignUpForm from "@/components/AttendeeSignUpForm";
import { Event, User } from "../../../../../generated/prisma/client";

interface EventRegisterPageProps {
  params: {
    id: string;
  };
}

const EventRegisterPage = ({ params }: EventRegisterPageProps) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [attendee, setAttendee] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`/api/events/${params.id}`);
        if (!res.ok) throw new Error("Event not found");
        const eventData = await res.json();
        setEvent(eventData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!event) {
    notFound();
  }

  const brandingHeader = (
    <div className="relative">
      {event.bannerUrl && (
        <div className="h-32 md:h-48 bg-gray-200">
          <Image
            src={event.bannerUrl}
            alt={`${event.name} banner`}
            layout="fill"
            objectFit="cover"
            className="w-full h-full"
          />
        </div>
      )}
      <div className="max-w-md mx-auto sm:max-w-2xl -mt-16 sm:-mt-20 lg:-mt-24 relative z-10">
        <div className="flex justify-center">
          {event.logoUrl && (
            <Image
              src={event.logoUrl}
              alt={`${event.name} logo`}
              width={128}
              height={128}
              className="rounded-full border-4 z=50 border-white bg-white"
            />
          )}
        </div>
      </div>
    </div>
  );

  // Step 1: Sign up or find the user
  if (!attendee) {
    return (
      <div className="min-h-screen bg-gray-50">
        {brandingHeader}
        <div className="pt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="text-center text-3xl font-extrabold text-gray-900">Register for {event.name}</h2>
          <p className="mt-2 text-center text-sm text-gray-600">First, let's find or create your profile.</p>
        </div>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-md rounded-lg sm:px-10">
            <AttendeeSignUpForm onSignUpSuccess={setAttendee} />
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Fill out event-specific goals
  return (
    <div className="min-h-screen bg-gray-50">
      {brandingHeader}
      <div className="pt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Your Goals for {event.name}</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Tell us what you're looking for to get matched with the right people.
        </p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white py-8 px-4 shadow-md rounded-lg sm:px-10">
          <AttendeeRegisterForm eventId={event.id} userId={attendee.id} />
        </div>
      </div>
    </div>
  );
};

export default EventRegisterPage;
