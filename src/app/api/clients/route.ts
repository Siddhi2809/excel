import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Only logged in employees can see the list of clients
    if (!session || (session.user as any).role !== "employee") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Find all users with role 'client'
    const clients = await User.find({ role: "client" })
      .select("_id name email clientId")
      .sort({ createdAt: -1 });

    return NextResponse.json(clients);
  } catch (error) {
    console.error("Fetch clients error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Only logged in employees can create clients
    if (!session || (session.user as any).role !== "employee") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, email, password, clientId } = await req.json();

    if (!name || !email || !password || !clientId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists with this email" },
        { status: 409 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create the client user
    const newClient = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "client",
      clientId: clientId.trim().toUpperCase(),
    });

    return NextResponse.json(
      {
        message: "Client created successfully",
        client: {
          id: newClient._id.toString(),
          name: newClient.name,
          email: newClient.email,
          role: newClient.role,
          clientId: newClient.clientId,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create client error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
