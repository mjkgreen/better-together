import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import CopyLinkButton from "@/components/CopyLinkButton";
import SeedAttendeesButton from "@/components/SeedAttendeesButton";
import JoinEventButton from "@/components/JoinEventButton";

interface EventPageProps {
  params: {
    id: string;
  };
}

const EventPage = async ({ params }: EventPageProps) => {
  const { id } = await params;
  const event = await prisma.event.findUnique({
    where: {
      id: id,
    },
    include: {
      organizer: true,
      attendees: {
        include: {
          user: true,
        },
      },
    },
  });

  if (!event) {
    notFound();
  }

  const socialLinks = event.socialLinks as { twitter?: string; website?: string } | null;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {event.bannerUrl && (
          <div className="relative h-64 w-full rounded-b-lg overflow-hidden">
            <Image src={event.bannerUrl} alt={`${event.name} banner`} fill className="object-cover" />
          </div>
        )}

        <main className="p-8 bg-white shadow-md rounded-lg -mt-16 mx-4 md:mx-0 relative overflow-hidden">
          {/* Custom Color Accent */}
          <div
            className="absolute top-0 left-0 w-full h-1"
            style={{
              background: `linear-gradient(to right, ${event.primaryColor || "#4F46E5"}, ${
                event.secondaryColor || "#7C3AED"
              })`,
            }}
          ></div>
          <div className="flex items-start">
            {event.logoUrl && (
              <div className="flex-shrink-0 mr-6">
                <Image
                  src={event.logoUrl}
                  alt={`${event.name} logo`}
                  width={128}
                  height={128}
                  className="rounded-lg border-4 border-white"
                />
              </div>
            )}
            <div className="flex-grow">
              <div className="flex items-center">
                <h1 className="text-4xl font-bold text-gray-900">{event.name}</h1>
                <CopyLinkButton />
              </div>
              <p className="text-lg text-gray-500 mt-1">Organized by {event.organizer.name}</p>
              <p className="text-md text-gray-600 mt-2">
                {new Date(event.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                })}
              </p>
            </div>
          </div>

          {event.eventDetails && (
            <div className="mt-8 border-t pt-6">
              <h2 className="text-2xl font-semibold text-gray-800">About this event</h2>
              <p className="mt-2 text-gray-600 whitespace-pre-wrap">{event.eventDetails}</p>
            </div>
          )}

          {(socialLinks?.twitter || socialLinks?.website) && (
            <div className="mt-8 border-t pt-6">
              <h2 className="text-2xl font-semibold text-gray-800">Follow us</h2>
              <div className="flex space-x-4 mt-2">
                {socialLinks.twitter && (
                  <a
                    href={socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium hover:underline transition-colors"
                    style={{ color: event.primaryColor || "#4F46E5" }}
                  >
                    Twitter
                  </a>
                )}
                {socialLinks.website && (
                  <a
                    href={socialLinks.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium hover:underline transition-colors"
                    style={{ color: event.primaryColor || "#4F46E5" }}
                  >
                    Website
                  </a>
                )}
              </div>
            </div>
          )}

          {event.attendees.length > 0 && (
            <div className="mt-8 border-t pt-6">
              <h2 className="text-2xl font-semibold text-gray-800">Attendees ({event.attendees.length})</h2>
              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {event.attendees.map((attendee) => (
                  <div key={attendee.id} className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                    {attendee.user.name}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-10 text-center">
            <JoinEventButton
              eventId={event.id}
              primaryColor={event.primaryColor || undefined}
              secondaryColor={event.secondaryColor || undefined}
            />
          </div>

          <SeedAttendeesButton eventId={event.id} />
        </main>
      </div>
    </div>
  );
};

export default EventPage;
