import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import AttendeeRegisterForm from "@/components/AttendeeRegisterForm";

interface EventRegisterPageProps {
  params: {
    id: string;
  };
}

const EventRegisterPage = async ({ params }: EventRegisterPageProps) => {
  const event = await prisma.event.findUnique({
    where: {
      id: params.id,
    },
  });

  if (!event) {
    notFound();
  }

  // For the MVP, we'll find a mock user to register.
  // In a real app, this would be the logged-in user.
  const userToRegister = await prisma.user.findFirst({
    where: {
      email: "bob@example.com", // Using Bob as the test attendee
    },
  });

  if (!userToRegister) {
    return <div>User to register not found. Please seed the database.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Join {event.name}</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Tell us what you're looking for to get matched with the right people.
        </p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <AttendeeRegisterForm eventId={event.id} userId={userToRegister.id} />
        </div>
      </div>
    </div>
  );
};

export default EventRegisterPage;
