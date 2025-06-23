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
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Results Area - Event Branded */}
      <div className="bg-white/90 backdrop-blur-lg shadow-2xl rounded-3xl p-6 sm:p-8 border border-white/20 relative overflow-hidden">
        {/* Subtle Event Logo Watermark */}
        {event.logoUrl && (
          <div className="absolute top-4 right-4 opacity-5">
            <img src={event.logoUrl} alt="" className="w-32 h-32 object-contain" />
          </div>
        )}

        {/* Custom Color Accent */}
        <div
          className="absolute top-0 left-0 w-full h-1 rounded-t-3xl"
          style={{
            background: `linear-gradient(to right, ${event.primaryColor || "#4F46E5"}, ${
              event.secondaryColor || "#7C3AED"
            })`,
          }}
        ></div>
        {/* Error Display */}
        {error && (
          <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl p-6 mb-8 shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-800 mb-1">Something went wrong</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-20">
            <div className="relative mb-8">
              {event.logoUrl ? (
                <div className="relative">
                  <img
                    src={event.logoUrl}
                    alt={`${event.name} loading`}
                    className="w-20 h-20 rounded-3xl shadow-lg bg-white object-contain p-2 mx-auto animate-pulse"
                  />
                  <div
                    className="absolute inset-0 border-4 rounded-3xl opacity-30"
                    style={{ borderColor: event.primaryColor || "#4F46E5" }}
                  ></div>
                </div>
              ) : (
                <div>
                  <div
                    className="inline-flex items-center justify-center w-20 h-20 rounded-3xl shadow-lg"
                    style={{
                      background: `linear-gradient(to right, ${event.primaryColor || "#4F46E5"}, ${
                        event.secondaryColor || "#7C3AED"
                      })`,
                    }}
                  >
                    <svg
                      className="animate-spin w-10 h-10 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </div>
                  <div
                    className="absolute -inset-1 rounded-3xl blur opacity-20 animate-pulse"
                    style={{
                      background: `linear-gradient(to right, ${event.primaryColor || "#4F46E5"}, ${
                        event.secondaryColor || "#7C3AED"
                      })`,
                    }}
                  ></div>
                </div>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">Analyzing connections...</h2>
            <p className="text-gray-600 text-lg max-w-md mx-auto leading-relaxed">
              Our AI is finding your perfect matches for{" "}
              <span
                className="font-bold text-white px-2 py-1 rounded-lg"
                style={{ backgroundColor: event.primaryColor || "#4F46E5" }}
              >
                {event.name}
              </span>
            </p>
            <div className="mt-8 flex justify-center space-x-2">
              <div
                className="w-2 h-2 rounded-full animate-bounce"
                style={{ backgroundColor: event.primaryColor || "#4F46E5" }}
              ></div>
              <div
                className="w-2 h-2 rounded-full animate-bounce"
                style={{
                  backgroundColor: event.secondaryColor || "#7C3AED",
                  animationDelay: "0.1s",
                }}
              ></div>
              <div
                className="w-2 h-2 rounded-full animate-bounce"
                style={{
                  backgroundColor: event.primaryColor || "#4F46E5",
                  animationDelay: "0.2s",
                }}
              ></div>
            </div>
          </div>
        )}

        {/* Results */}
        {!isLoading && !error && matches.length > 0 && (
          <div>
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">Your Recommended Connections</h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Based on your goals and interests, here are your top matches
              </p>
              <div className="mt-4 inline-flex items-center bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-2 rounded-full border border-green-200">
                <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-green-700 font-medium text-sm">{matches.length} matches found</span>
              </div>
            </div>

            {/* Dynamic Grid Layout Based on Match Count */}
            {matches.length === 4 ? (
              // 4 matches: 2x2 grid
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {matches.map((match, index) => (
                  <div
                    key={index}
                    className="group bg-white/80 backdrop-blur-sm shadow-lg rounded-3xl p-7 border border-gray-100 hover:shadow-2xl hover:scale-105 transition-all duration-300 hover:bg-white"
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-start space-x-4">
                        <div className="relative">
                          <div
                            className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
                            style={{
                              background: `linear-gradient(to bottom right, ${event.primaryColor || "#4F46E5"}, ${
                                event.secondaryColor || "#7C3AED"
                              })`,
                            }}
                          >
                            <span className="text-white font-bold text-lg">{getInitials(match.name)}</span>
                          </div>
                          <div
                            className="absolute -inset-1 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity"
                            style={{
                              background: `linear-gradient(to bottom right, ${event.primaryColor || "#4F46E5"}, ${
                                event.secondaryColor || "#7C3AED"
                              })`,
                            }}
                          ></div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-800 mb-1">{match.name}</h3>
                          <p className="text-gray-600 font-semibold mb-1">{match.role}</p>
                          <p
                            className="text-white text-sm font-bold px-2 py-1 rounded-lg inline-block"
                            style={{ backgroundColor: event.primaryColor || "#4F46E5" }}
                          >
                            {match.company}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`px-4 py-2 rounded-2xl text-sm font-bold shadow-sm ${getMatchScoreColor(
                          match.matchScore
                        )}`}
                      >
                        {match.matchScore}% match
                      </div>
                    </div>

                    <div className="mb-8">
                      <h4 className="font-bold text-gray-800 mb-3 flex items-center">
                        <div
                          className="w-6 h-6 rounded-lg flex items-center justify-center mr-3"
                          style={{
                            background: `linear-gradient(to right, ${event.primaryColor || "#4F46E5"}, ${
                              event.secondaryColor || "#7C3AED"
                            })`,
                          }}
                        >
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                            />
                          </svg>
                        </div>
                        Why you should connect
                      </h4>
                      <p className="text-gray-700 leading-relaxed text-sm">{match.reason}</p>
                    </div>

                    <div className="flex gap-3">
                      <button
                        className="flex-1 text-white font-bold py-3 px-4 rounded-2xl transition-all duration-200 text-sm shadow-lg hover:shadow-xl transform hover:scale-105"
                        style={{
                          background: `linear-gradient(to right, ${event.primaryColor || "#4F46E5"}, ${
                            event.secondaryColor || "#7C3AED"
                          })`,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.filter = "brightness(0.9)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.filter = "brightness(1)";
                        }}
                      >
                        Add to Contacts
                      </button>
                      <button
                        className="flex-1 border-2 font-bold py-3 px-4 rounded-2xl transition-all duration-200 text-sm"
                        style={{
                          borderColor: event.primaryColor || "#4F46E5",
                          color: event.primaryColor || "#4F46E5",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = event.primaryColor || "#4F46E5";
                          e.currentTarget.style.color = "white";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                          e.currentTarget.style.color = event.primaryColor || "#4F46E5";
                        }}
                      >
                        Generate Intro
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : matches.length === 5 ? (
              // 5 matches: 3-2 layout (3 on top, 2 centered below)
              <div className="flex flex-col items-center space-y-8">
                {/* First row: 3 cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                  {matches.slice(0, 3).map((match, index) => (
                    <div
                      key={index}
                      className="group bg-white/80 backdrop-blur-sm shadow-lg rounded-3xl p-7 border border-gray-100 hover:shadow-2xl hover:scale-105 transition-all duration-300 hover:bg-white"
                    >
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-start space-x-4">
                          <div className="relative">
                            <div
                              className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
                              style={{
                                background: `linear-gradient(to bottom right, ${event.primaryColor || "#4F46E5"}, ${
                                  event.secondaryColor || "#7C3AED"
                                })`,
                              }}
                            >
                              <span className="text-white font-bold text-lg">{getInitials(match.name)}</span>
                            </div>
                            <div
                              className="absolute -inset-1 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity"
                              style={{
                                background: `linear-gradient(to bottom right, ${event.primaryColor || "#4F46E5"}, ${
                                  event.secondaryColor || "#7C3AED"
                                })`,
                              }}
                            ></div>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-800 mb-1">{match.name}</h3>
                            <p className="text-gray-600 font-semibold mb-1">{match.role}</p>
                            <p
                              className="text-white text-sm font-bold px-2 py-1 rounded-lg inline-block"
                              style={{ backgroundColor: event.primaryColor || "#4F46E5" }}
                            >
                              {match.company}
                            </p>
                          </div>
                        </div>
                        <div
                          className={`px-4 py-2 rounded-2xl text-sm font-bold shadow-sm ${getMatchScoreColor(
                            match.matchScore
                          )}`}
                        >
                          {match.matchScore}% match
                        </div>
                      </div>

                      <div className="mb-8">
                        <h4 className="font-bold text-gray-800 mb-3 flex items-center">
                          <div
                            className="w-6 h-6 rounded-lg flex items-center justify-center mr-3"
                            style={{
                              background: `linear-gradient(to right, ${event.primaryColor || "#4F46E5"}, ${
                                event.secondaryColor || "#7C3AED"
                              })`,
                            }}
                          >
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                              />
                            </svg>
                          </div>
                          Why you should connect
                        </h4>
                        <p className="text-gray-700 leading-relaxed text-sm">{match.reason}</p>
                      </div>

                      <div className="flex gap-3">
                        <button
                          className="flex-1 text-white font-bold py-3 px-4 rounded-2xl transition-all duration-200 text-sm shadow-lg hover:shadow-xl transform hover:scale-105"
                          style={{
                            background: `linear-gradient(to right, ${event.primaryColor || "#4F46E5"}, ${
                              event.secondaryColor || "#7C3AED"
                            })`,
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.filter = "brightness(0.9)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.filter = "brightness(1)";
                          }}
                        >
                          Add to Contacts
                        </button>
                        <button
                          className="flex-1 border-2 font-bold py-3 px-4 rounded-2xl transition-all duration-200 text-sm"
                          style={{
                            borderColor: event.primaryColor || "#4F46E5",
                            color: event.primaryColor || "#4F46E5",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = event.primaryColor || "#4F46E5";
                            e.currentTarget.style.color = "white";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "transparent";
                            e.currentTarget.style.color = event.primaryColor || "#4F46E5";
                          }}
                        >
                          Generate Intro
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Second row: 2 cards centered */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-3xl mx-auto">
                  {matches.slice(3, 5).map((match, index) => (
                    <div
                      key={index + 3}
                      className="group bg-white/80 backdrop-blur-sm shadow-lg rounded-3xl p-7 border border-gray-100 hover:shadow-2xl hover:scale-105 transition-all duration-300 hover:bg-white"
                    >
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-start space-x-4">
                          <div className="relative">
                            <div
                              className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
                              style={{
                                background: `linear-gradient(to bottom right, ${event.primaryColor || "#4F46E5"}, ${
                                  event.secondaryColor || "#7C3AED"
                                })`,
                              }}
                            >
                              <span className="text-white font-bold text-lg">{getInitials(match.name)}</span>
                            </div>
                            <div
                              className="absolute -inset-1 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity"
                              style={{
                                background: `linear-gradient(to bottom right, ${event.primaryColor || "#4F46E5"}, ${
                                  event.secondaryColor || "#7C3AED"
                                })`,
                              }}
                            ></div>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-800 mb-1">{match.name}</h3>
                            <p className="text-gray-600 font-semibold mb-1">{match.role}</p>
                            <p
                              className="text-white text-sm font-bold px-2 py-1 rounded-lg inline-block"
                              style={{ backgroundColor: event.primaryColor || "#4F46E5" }}
                            >
                              {match.company}
                            </p>
                          </div>
                        </div>
                        <div
                          className={`px-4 py-2 rounded-2xl text-sm font-bold shadow-sm ${getMatchScoreColor(
                            match.matchScore
                          )}`}
                        >
                          {match.matchScore}% match
                        </div>
                      </div>

                      <div className="mb-8">
                        <h4 className="font-bold text-gray-800 mb-3 flex items-center">
                          <div
                            className="w-6 h-6 rounded-lg flex items-center justify-center mr-3"
                            style={{
                              background: `linear-gradient(to right, ${event.primaryColor || "#4F46E5"}, ${
                                event.secondaryColor || "#7C3AED"
                              })`,
                            }}
                          >
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                              />
                            </svg>
                          </div>
                          Why you should connect
                        </h4>
                        <p className="text-gray-700 leading-relaxed text-sm">{match.reason}</p>
                      </div>

                      <div className="flex gap-3">
                        <button
                          className="flex-1 text-white font-bold py-3 px-4 rounded-2xl transition-all duration-200 text-sm shadow-lg hover:shadow-xl transform hover:scale-105"
                          style={{
                            background: `linear-gradient(to right, ${event.primaryColor || "#4F46E5"}, ${
                              event.secondaryColor || "#7C3AED"
                            })`,
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.filter = "brightness(0.9)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.filter = "brightness(1)";
                          }}
                        >
                          Add to Contacts
                        </button>
                        <button
                          className="flex-1 border-2 font-bold py-3 px-4 rounded-2xl transition-all duration-200 text-sm"
                          style={{
                            borderColor: event.primaryColor || "#4F46E5",
                            color: event.primaryColor || "#4F46E5",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = event.primaryColor || "#4F46E5";
                            e.currentTarget.style.color = "white";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "transparent";
                            e.currentTarget.style.color = event.primaryColor || "#4F46E5";
                          }}
                        >
                          Generate Intro
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              // Default layout for other amounts (1, 2, 3, 6+)
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {matches.map((match, index) => (
                  <div
                    key={index}
                    className="group bg-white/80 backdrop-blur-sm shadow-lg rounded-3xl p-7 border border-gray-100 hover:shadow-2xl hover:scale-105 transition-all duration-300 hover:bg-white"
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-start space-x-4">
                        <div className="relative">
                          <div
                            className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
                            style={{
                              background: `linear-gradient(to bottom right, ${event.primaryColor || "#4F46E5"}, ${
                                event.secondaryColor || "#7C3AED"
                              })`,
                            }}
                          >
                            <span className="text-white font-bold text-lg">{getInitials(match.name)}</span>
                          </div>
                          <div
                            className="absolute -inset-1 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity"
                            style={{
                              background: `linear-gradient(to bottom right, ${event.primaryColor || "#4F46E5"}, ${
                                event.secondaryColor || "#7C3AED"
                              })`,
                            }}
                          ></div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-800 mb-1">{match.name}</h3>
                          <p className="text-gray-600 font-semibold mb-1">{match.role}</p>
                          <p
                            className="text-white text-sm font-bold px-2 py-1 rounded-lg inline-block"
                            style={{ backgroundColor: event.primaryColor || "#4F46E5" }}
                          >
                            {match.company}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`px-4 py-2 rounded-2xl text-sm font-bold shadow-sm ${getMatchScoreColor(
                          match.matchScore
                        )}`}
                      >
                        {match.matchScore}% match
                      </div>
                    </div>

                    <div className="mb-8">
                      <h4 className="font-bold text-gray-800 mb-3 flex items-center">
                        <div
                          className="w-6 h-6 rounded-lg flex items-center justify-center mr-3"
                          style={{
                            background: `linear-gradient(to right, ${event.primaryColor || "#4F46E5"}, ${
                              event.secondaryColor || "#7C3AED"
                            })`,
                          }}
                        >
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                            />
                          </svg>
                        </div>
                        Why you should connect
                      </h4>
                      <p className="text-gray-700 leading-relaxed text-sm">{match.reason}</p>
                    </div>

                    <div className="flex gap-3">
                      <button
                        className="flex-1 text-white font-bold py-3 px-4 rounded-2xl transition-all duration-200 text-sm shadow-lg hover:shadow-xl transform hover:scale-105"
                        style={{
                          background: `linear-gradient(to right, ${event.primaryColor || "#4F46E5"}, ${
                            event.secondaryColor || "#7C3AED"
                          })`,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.filter = "brightness(0.9)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.filter = "brightness(1)";
                        }}
                      >
                        Add to Contacts
                      </button>
                      <button
                        className="flex-1 border-2 font-bold py-3 px-4 rounded-2xl transition-all duration-200 text-sm"
                        style={{
                          borderColor: event.primaryColor || "#4F46E5",
                          color: event.primaryColor || "#4F46E5",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = event.primaryColor || "#4F46E5";
                          e.currentTarget.style.color = "white";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                          e.currentTarget.style.color = event.primaryColor || "#4F46E5";
                        }}
                      >
                        Generate Intro
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {matches.length > 0 && (
              <div className="text-center mt-16 bg-gradient-to-r from-emerald-50 to-green-50 rounded-3xl p-8 border border-emerald-200 relative overflow-hidden">
                {/* Event Logo in Action Section */}
                {event.logoUrl && (
                  <div className="absolute top-4 left-4 opacity-10">
                    <img src={event.logoUrl} alt="" className="w-16 h-16 object-contain" />
                  </div>
                )}
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Ready to take action?</h3>
                <p className="text-gray-600 mb-6 text-lg">
                  Save these connections from{" "}
                  <span
                    className="font-semibold text-white px-2 py-1 rounded"
                    style={{ backgroundColor: event.primaryColor || "#4F46E5" }}
                  >
                    {event.name}
                  </span>{" "}
                  and generate personalized intro messages
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    className="text-white font-bold py-4 px-8 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                    style={{
                      background: `linear-gradient(to right, ${event.primaryColor || "#4F46E5"}, ${
                        event.secondaryColor || "#7C3AED"
                      })`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.filter = "brightness(0.9)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.filter = "brightness(1)";
                    }}
                  >
                    <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Save All to My Rolodex
                  </button>
                  <button
                    className="border-2 font-bold py-4 px-8 rounded-2xl transition-all duration-200"
                    style={{
                      borderColor: event.primaryColor || "#4F46E5",
                      color: event.primaryColor || "#4F46E5",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = event.primaryColor || "#4F46E5";
                      e.currentTarget.style.color = "white";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = event.primaryColor || "#4F46E5";
                    }}
                  >
                    <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    Generate All Intros
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {!isLoading && !error && matches.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-4">No matches found</h3>
            <p className="text-gray-500 text-lg max-w-md mx-auto leading-relaxed">
              We couldn't find any suitable connections for you at this event right now. Try updating your interests or
              check back later!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
