"use client";

import { useState } from "react";
import CreateEventForm from "@/components/CreateEventForm";
import OrganizerSignUpForm from "@/components/OrganizerSignUpForm";
import { User } from "../../../../generated/prisma/client";

const CreateEventPage = () => {
  const [organizer, setOrganizer] = useState<User | null>(null);

  if (!organizer) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Become an Organizer</h2>
          <p className="mt-2 text-center text-sm text-gray-600">First, let's create your organizer profile.</p>
        </div>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <OrganizerSignUpForm onSignUpSuccess={setOrganizer} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create a new event</h2>
        <p className="mt-2 text-center text-sm text-gray-600">Fill in the details below to get started.</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <CreateEventForm organizerId={organizer.id} />
        </div>
      </div>
    </div>
  );
};

export default CreateEventPage;
