"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "./ImageUpload";

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
  const [primaryColor, setPrimaryColor] = useState("#4F46E5"); // Default indigo-600
  const [secondaryColor, setSecondaryColor] = useState("#7C3AED"); // Default purple-600
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
          primaryColor,
          secondaryColor,
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
    <form onSubmit={handleSubmit} className="space-y-6 text-black">
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
        <ImageUpload
          currentImageUrl={logoUrl}
          onImageUpload={setLogoUrl}
          label="Event Logo"
          width={128}
          height={128}
          maxSize={5}
        />
      </div>

      <div>
        <ImageUpload
          currentImageUrl={bannerUrl}
          onImageUpload={setBannerUrl}
          label="Event Banner"
          width={400}
          height={200}
          maxSize={5}
        />
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

      {/* Brand Colors Section */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Brand Colors</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="primaryColor" className="block text-sm font-medium text-gray-700 mb-2">
              Primary Color
            </label>
            <div className="flex items-center space-x-3">
              <input
                id="primaryColor"
                name="primaryColor"
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="h-10 w-20 rounded-lg border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="#4F46E5"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Used for buttons, links, and primary accents</p>
          </div>

          <div>
            <label htmlFor="secondaryColor" className="block text-sm font-medium text-gray-700 mb-2">
              Secondary Color
            </label>
            <div className="flex items-center space-x-3">
              <input
                id="secondaryColor"
                name="secondaryColor"
                type="color"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="h-10 w-20 rounded-lg border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="#7C3AED"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Used for gradients and secondary accents</p>
          </div>
        </div>

        {/* Color Preview */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Preview</h4>
          <div className="flex items-center space-x-4">
            <button
              type="button"
              style={{ backgroundColor: primaryColor }}
              className="px-4 py-2 text-white font-medium rounded-lg shadow-sm"
            >
              Primary Button
            </button>
            <button
              type="button"
              style={{
                background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`,
              }}
              className="px-4 py-2 text-white font-medium rounded-lg shadow-sm"
            >
              Gradient Button
            </button>
            <div style={{ backgroundColor: secondaryColor }} className="w-8 h-8 rounded-full"></div>
          </div>
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
