import prisma from "@/lib/prisma";
import Matchmaker from "./components/Matchmaker";

export default async function Home() {
  const attendees = await prisma.eventAttendee.findMany({
    include: { user: true },
    orderBy: { user: { name: "asc" } },
  });

  const event = await prisma.event.findFirst();

  if (!event) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <div className="text-center p-8 bg-white shadow-lg rounded-xl">
          <h1 className="text-2xl font-bold text-red-600">Error</h1>
          <p className="text-gray-600 mt-2">No event found. Please seed the database first.</p>
          <code className="mt-4 inline-block bg-gray-100 text-gray-800 px-4 py-2 rounded-md">npx prisma db seed</code>
        </div>
      </main>
    );
  }

  return (
    <main>
      <Matchmaker attendees={attendees} event={event} />
    </main>
  );
}
