import CreateEventForm from "./components/CreateEventForm";
import prisma from "@/lib/prisma";

const CreateEventPage = async () => {
  const organizer = await prisma.user.findFirst({
    where: {
      email: "alice@example.com",
    },
  });

  if (!organizer) {
    return <div>Organizer not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create a new event</h2>
        <p className="mt-2 text-center text-sm text-gray-600">Fill in the details below to get started.</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <CreateEventForm organizerId={organizer.id} />
        </div>
      </div>
    </div>
  );
};

export default CreateEventPage;
