"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface CreateEventFormProps {
  organizerId: string;
}

export default function CreateEventForm({ organizerId }: CreateEventFormProps) {
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventDetails, setEventDetails] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [twitterUrl, setTwitterUrl] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const socialLinks = {
      twitter: twitterUrl,
      website: websiteUrl,
    };

    try {
      const res = await fetch("/api/events", {
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
          socialLinks,
          organizerId,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Something went wrong");
      }

      const event = await res.json();
      // Redirect to a success page or the new event page
      router.push(`/events/${event.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
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
            id="eventName"
            name="eventName"
            type="text"
            required
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
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
            id="eventDate"
            name="eventDate"
            type="datetime-local"
            required
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
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
            name="eventDetails"
            rows={3}
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
            id="logoUrl"
            name="logoUrl"
            type="url"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label htmlFor="bannerUrl" className="block text-sm font-medium text-gray-700">
          Banner Image URL
        </label>
        <div className="mt-1">
          <input
            id="bannerUrl"
            name="bannerUrl"
            type="url"
            value={bannerUrl}
            onChange={(e) => setBannerUrl(e.target.value)}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label htmlFor="twitterUrl" className="block text-sm font-medium text-gray-700">
          Twitter URL
        </label>
        <div className="mt-1">
          <input
            id="twitterUrl"
            name="twitterUrl"
            type="url"
            value={twitterUrl}
            onChange={(e) => setTwitterUrl(e.target.value)}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label htmlFor="websiteUrl" className="block text-sm font-medium text-gray-700">
          Website URL
        </label>
        <div className="mt-1">
          <input
            id="websiteUrl"
            name="websiteUrl"
            type="url"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {isSubmitting ? "Creating..." : "Create Event"}
        </button>
      </div>
    </form>
  );
}
