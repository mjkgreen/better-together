import prisma from "@/lib/prisma";
import Matchmaker from "@/components/Matchmaker";

export default async function Home() {
  // Fetch a specific user to generate matches for. In a real app, this would be the logged-in user.
  const user = await prisma.user.findFirst({
    where: { email: "bob@example.com" }, // Using a mock user for the MVP
  });

  const event = await prisma.event.findFirst();

  if (!event || !user) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <div className="text-center p-8 bg-white shadow-lg rounded-xl">
          <h1 className="text-2xl font-bold text-red-600">Error</h1>
          <p className="text-gray-600 mt-2">No event or user found. Please seed the database first.</p>
          <code className="mt-4 inline-block bg-gray-100 text-gray-800 px-4 py-2 rounded-md">npx prisma db seed</code>
        </div>
      </main>
    );
  }

  return (
    <main>
      <Matchmaker user={user} event={event} />
    </main>
  );
}
