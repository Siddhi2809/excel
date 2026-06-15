import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import Report from "@/models/Report";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== "employee") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { clientId, type, data, month } = await req.json();

    if (!clientId || !type || !data || !month) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await dbConnect();

    const report = await Report.create({
      clientId,
      type,
      data,
      month,
      submittedBy: (session.user as any).id,
      status: "unread"
    });

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error("Report submission error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    await dbConnect();

    let query: any = {};
    
    // If client, only show their reports
    if ((session.user as any).role === "client") {
      query.clientId = (session.user as any).clientId;
    }

    if (type) {
      query.type = type;
    }

    const reports = await Report.find(query).sort({ createdAt: -1 });

    return NextResponse.json(reports);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== "client") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { type } = await req.json();

    if (!type) {
      return NextResponse.json({ error: "Missing report type" }, { status: 400 });
    }

    await dbConnect();

    // Mark all unread reports of this type for this client as read
    const result = await Report.updateMany(
      {
        clientId: (session.user as any).clientId,
        type,
        status: "unread",
      },
      { $set: { status: "read" } }
    );

    return NextResponse.json({ updated: result.modifiedCount });
  } catch (error) {
    console.error("Mark read error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
