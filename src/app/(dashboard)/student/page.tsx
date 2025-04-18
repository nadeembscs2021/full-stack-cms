import Announcements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import EventCalendar from "@/components/EventCalendar";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const StudentPage = async () => {
  const { userId } = auth();

  // Check if user is logged in
  if (!userId) {
    redirect("/sign-in");
  }

  // Get student's class
  const classItem = await prisma.class.findMany({
    where: {
      students: { some: { id: userId } },
    },
  });

  // If no class found, show message
  if (!classItem || classItem.length === 0) {
    return (
      <div className="p-4">
        <div className="bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">No Class Assigned</h1>
          <p>Please contact your administrator to assign you to a class.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 flex gap-4 flex-col xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        <div className="h-full bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Schedule ({classItem[0].name})</h1>
          <BigCalendarContainer type="classId" id={classItem[0].id} />
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        <EventCalendar />
        <Announcements />
      </div>
    </div>
  );
};

export default StudentPage;