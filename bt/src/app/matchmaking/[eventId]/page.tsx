import Matchmaker from "@/components/Matchmaker";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

interface MatchmakingPageProps {
  params: {
    eventId: string;
  };
}

const MatchmakingPage = async ({ params }: MatchmakingPageProps) => {
  const { eventId } = params;

  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!event) {
    notFound();
  }

  // For the MVP, we are using a hardcoded user (Bob) who we just registered.
  // In a real app, you'd get the logged-in user's ID.
  const user = await prisma.user.findFirst({
    where: { email: "bob@example.com" },
  });

  if (!user) {
    // This case should ideally not be hit if the seed script has been run
    // and the user was registered on the previous page.
    return <div>Current user not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Your Top Matches for {event.name}</h1>
          <p className="mt-4 text-lg text-gray-500">Based on your goals, here are the top people you should meet.</p>
        </div>
        <div className="mt-12">
          <Matchmaker event={event} user={user} />
        </div>
      </div>
    </div>
  );
};

export default MatchmakingPage;
