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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-lg"
            style={{
              background: "linear-gradient(to right, #4F46E5, #7C3AED)",
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
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading event details...</h2>
          <p className="text-gray-600">Preparing your registration experience</p>
        </div>
      </div>
    );
  }

  if (!event) {
    notFound();
  }

  const brandingHeader = (
    <div className="relative">
      {event.bannerUrl && (
        <div className="h-32 md:h-48 bg-gray-200 relative">
          <Image src={event.bannerUrl} alt={`${event.name} banner`} fill className="w-full h-full object-cover" />
          {/* Gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

          {/* Custom color accent bar */}
          <div
            className="absolute bottom-0 left-0 w-full h-2"
            style={{
              background: `linear-gradient(to right, ${event.primaryColor || "#4F46E5"}, ${
                event.secondaryColor || "#7C3AED"
              })`,
            }}
          ></div>
        </div>
      )}

      {/* Logo-only header for events without banner */}
      {!event.bannerUrl && (
        <div className="bg-white py-12 relative">
          <div
            className="absolute bottom-0 left-0 w-full h-1"
            style={{
              background: `linear-gradient(to right, ${event.primaryColor || "#4F46E5"}, ${
                event.secondaryColor || "#7C3AED"
              })`,
            }}
          ></div>
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
              className="rounded-full border-4 border-white bg-white shadow-lg"
            />
          )}
        </div>
      </div>
    </div>
  );

  // Step 1: Sign up or find the user
  if (!attendee) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {brandingHeader}
        <div className="pt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="text-center text-3xl font-extrabold text-gray-900">Register for {event.name}</h2>
          <p className="mt-2 text-center text-sm text-gray-600">First, let's find or create your profile.</p>
        </div>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-xl rounded-xl border border-gray-100 sm:px-10 relative overflow-hidden">
            {/* Subtle brand accent */}
            <div
              className="absolute top-0 left-0 w-full h-1"
              style={{
                background: `linear-gradient(to right, ${event.primaryColor || "#4F46E5"}, ${
                  event.secondaryColor || "#7C3AED"
                })`,
              }}
            ></div>
            <AttendeeSignUpForm onSignUpSuccess={setAttendee} />
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Fill out event-specific goals
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {brandingHeader}
      <div className="pt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Your Goals for {event.name}</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Tell us what you're looking for to get matched with the right people.
        </p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white py-8 px-4 shadow-xl rounded-xl border border-gray-100 sm:px-10 relative overflow-hidden">
          {/* Subtle brand accent */}
          <div
            className="absolute top-0 left-0 w-full h-1"
            style={{
              background: `linear-gradient(to right, ${event.primaryColor || "#4F46E5"}, ${
                event.secondaryColor || "#7C3AED"
              })`,
            }}
          ></div>
          <AttendeeRegisterForm eventId={event.id} userId={attendee.id} />
        </div>
      </div>
    </div>
  );
};

export default EventRegisterPage;
