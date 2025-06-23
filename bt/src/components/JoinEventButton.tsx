"use client";

interface JoinEventButtonProps {
  eventId: string;
  primaryColor?: string;
  secondaryColor?: string;
}

export default function JoinEventButton({ eventId, primaryColor, secondaryColor }: JoinEventButtonProps) {
  return (
    <a
      href={`/events/${eventId}/register`}
      className="text-white font-bold py-3 px-8 rounded-full transition duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 inline-block"
      style={{
        background: `linear-gradient(to right, ${primaryColor || "#4F46E5"}, ${secondaryColor || "#7C3AED"})`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.filter = "brightness(0.9)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.filter = "brightness(1)";
      }}
    >
      Join Event & Get Matches
    </a>
  );
}
