import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  // Make sure the user is logged in
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Parse the form data from the request body
  const body = await req.json();
  const { company, role, status, jobType, location, salary, jobUrl, notes } = body;

  // Company and role are required
  if (!company || !role) {
    return NextResponse.json({ error: "Company and role are required" }, { status: 400 });
  }

  // Look up the user in the database using their email from the session
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Create the new job application and link it to this user
  const application = await prisma.jobApplication.create({
    data: {
      company,
      role,
      status: status || "Applied",
      jobType: jobType || null,
      location: location || null,
      salary: salary || null,
      jobUrl: jobUrl || null,
      notes: notes || null,
      userId: user.id,
    },
  });

  return NextResponse.json(application, { status: 201 });
}
