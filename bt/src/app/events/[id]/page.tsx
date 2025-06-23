import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";

interface EventPageProps {
  params: {
    id: string;
  };
}

const EventPage = async ({ params }: EventPageProps) => {
  const event = await prisma.event.findUnique({
    where: {
      id: params.id,
    },
    include: {
      organizer: true,
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
            <Image src={event.bannerUrl} alt={`${event.name} banner`} layout="fill" objectFit="cover" />
          </div>
        )}

        <main className="p-8 bg-white shadow-md rounded-lg -mt-16 mx-4 md:mx-0 relative">
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
              <h1 className="text-4xl font-bold text-gray-900">{event.name}</h1>
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
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    Twitter
                  </a>
                )}
                {socialLinks.website && (
                  <a
                    href={socialLinks.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    Website
                  </a>
                )}
              </div>
            </div>
          )}

          <div className="mt-10 text-center">
            <a
              href={`/events/${event.id}/register`}
              className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-full hover:bg-indigo-700 transition duration-300"
            >
              Join Event & Get Matches
            </a>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EventPage;
