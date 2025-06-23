"use client";

import { useState, useEffect } from "react";
import type { Event, User } from "../../generated/prisma/client";

interface MatchmakerProps {
  user: User;
  event: Event;
}

interface Match {
  name: string;
  role?: string;
  company?: string;
  reason: string;
  matchScore: number;
}

export default function Matchmaker({ user, event }: MatchmakerProps) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start loading immediately
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const findMatches = async () => {
      setIsLoading(true);
      setError(null);
      setMatches([]);

      try {
        const response = await fetch("/api/match", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, eventId: event.id }),
        });

        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.details || "Failed to fetch matches.");
        }

        const data = await response.json();
        setMatches(data.matches);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };

    findMatches();
  }, [user.id, event.id]);

  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50";
    if (score >= 60) return "text-blue-600 bg-blue-50";
    if (score >= 40) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="w-full max-w-6xl mx-auto p-6 lg:p-8">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            AI Networking Agent
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover your perfect connections at <span className="font-semibold text-indigo-600">{event.name}</span>
          </p>
          <div className="mt-4 text-sm text-gray-500">
            {new Date(event.date).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </header>

        {/* Results Area */}
        <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-red-700 font-medium">{error}</span>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
                <svg
                  className="animate-spin w-8 h-8 text-indigo-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
              <p className="text-xl font-medium text-gray-600">Analyzing connections...</p>
              <p className="text-gray-500 mt-2">
                Our AI is finding your perfect matches for{" "}
                <span className="font-semibold text-indigo-600">{event.name}</span>
              </p>
            </div>
          )}

          {/* Results */}
          {!isLoading && !error && matches.length > 0 && (
            <div>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Your Recommended Connections</h2>
                <p className="text-gray-600">Based on your goals and interests, here are your top matches</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {matches.map((match, index) => (
                  <div
                    key={index}
                    className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">{getInitials(match.name)}</span>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">{match.name}</h3>
                          <p className="text-gray-600 font-medium">{match.role}</p>
                          <p className="text-indigo-600 text-sm font-medium">{match.company}</p>
                        </div>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-bold ${getMatchScoreColor(match.matchScore)}`}
                      >
                        {match.matchScore}%
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                        <svg
                          className="w-4 h-4 mr-2 text-indigo-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                          />
                        </svg>
                        Why you should connect
                      </h4>
                      <p className="text-gray-700 leading-relaxed">{match.reason}</p>
                    </div>

                    <div className="flex gap-2">
                      <button className="flex-1 bg-indigo-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-200 text-sm">
                        Add to Contacts
                      </button>
                      <button className="flex-1 border border-indigo-600 text-indigo-600 font-medium py-2 px-4 rounded-lg hover:bg-indigo-50 transition-colors duration-200 text-sm">
                        Generate Intro
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {matches.length > 0 && (
                <div className="text-center mt-12">
                  <p className="text-gray-600 mb-4">Want to save these connections or generate intro messages?</p>
                  <button className="bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-3 px-8 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                    Save All to My Rolodex
                  </button>
                </div>
              )}
            </div>
          )}

          {!isLoading && !error && matches.length === 0 && (
            <div className="text-center py-16">
              <p className="text-xl font-medium text-gray-600">No matches found.</p>
              <p className="text-gray-500 mt-2">We couldn't find any suitable matches for you at this time.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
