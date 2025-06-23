"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface AttendeeRegisterFormProps {
  eventId: string;
  userId: string;
}

export default function AttendeeRegisterForm({ eventId, userId }: AttendeeRegisterFormProps) {
  const [goals, setGoals] = useState("");
  const [keywords, setKeywords] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/attendees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId,
          userId,
          goals,
          keywords,
          priority,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to register for the event.");
      }

      // Redirect to the matchmaking page for this event
      router.push(`/matchmaking/${eventId}?userId=${userId}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 text-black">
      <div className="space-y-4">
        <div>
          <label htmlFor="goals" className="block text-sm font-medium text-gray-700">
            What are you hoping to get out of this event?
          </label>
          <div className="mt-1">
            <textarea
              id="goals"
              name="goals"
              rows={4}
              required
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="e.g., Looking for a co-founder for my new startup in the climate tech space."
            />
          </div>
        </div>

        <div>
          <label htmlFor="keywords" className="block text-sm font-medium text-gray-700">
            Keywords
          </label>
          <div className="mt-1">
            <input
              id="keywords"
              name="keywords"
              type="text"
              required
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="e.g., AI, Climate Tech, Seed Funding"
            />
            <p className="mt-2 text-sm text-gray-500">
              Comma-separated keywords that will help us find the best matches for you.
            </p>
          </div>
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
            How important is networking at this event for you?
          </label>
          <select
            id="priority"
            name="priority"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="pt-5">
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isSubmitting ? "Submitting..." : "Find My Matches"}
          </button>
        </div>
      </div>
    </form>
  );
}
