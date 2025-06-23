"use client";

import { FC, useState } from "react";

interface CreateEventFormProps {
  organizerId: string;
}

const CreateEventForm: FC<CreateEventFormProps> = ({ organizerId }) => {
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventDetails, setEventDetails] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("/api/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: eventName,
        date: eventDate,
        eventDetails,
        logoUrl,
        bannerUrl,
        organizerId,
      }),
    });

    if (response.ok) {
      //Handle success (e.g. redirect or show a success message)
      console.log("Event created successfully");
      //Clear form
      setEventName("");
      setEventDate("");
      setEventDetails("");
      setLogoUrl("");
      setBannerUrl("");
    } else {
      //Handle error
      console.error("Failed to create event");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="eventName" className="block text-sm font-medium text-gray-700">
          Event Name
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="eventName"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            required
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700">
          Event Date
        </label>
        <div className="mt-1">
          <input
            type="datetime-local"
            id="eventDate"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            required
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label htmlFor="eventDetails" className="block text-sm font-medium text-gray-700">
          Event Details
        </label>
        <div className="mt-1">
          <textarea
            id="eventDetails"
            rows={4}
            value={eventDetails}
            onChange={(e) => setEventDetails(e.target.value)}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-700">
          Logo URL
        </label>
        <div className="mt-1">
          <input
            type="url"
            id="logoUrl"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label htmlFor="bannerUrl" className="block text-sm font-medium text-gray-700">
          Banner URL
        </label>
        <div className="mt-1">
          <input
            type="url"
            id="bannerUrl"
            value={bannerUrl}
            onChange={(e) => setBannerUrl(e.target.value)}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create Event
        </button>
      </div>
    </form>
  );
};

export default CreateEventForm;
