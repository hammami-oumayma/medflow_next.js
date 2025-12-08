import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Appointment from "@/models/Appointment";

// ---------------------- GET ----------------------
export async function GET(req: Request) {
  try {
    await dbConnect();

    const url = new URL(req.url);
    const patientId = url.searchParams.get("patientId");
    const doctorId = url.searchParams.get("doctorId");

    const filter: any = {};
    if (patientId) filter.patientId = patientId;
    if (doctorId) filter.doctorId = doctorId;

    const rdvs = await Appointment.find(filter)
      .populate("patientId", "name email role")
      .populate("doctorId", "name email role")
      .lean();

    return NextResponse.json(rdvs);

  } catch (err) {
    console.error("GET /appointments ERROR:", err);
    return NextResponse.json([], { status: 500 });
  }
}

// ---------------------- POST ----------------------
export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    const rdv = await Appointment.create({
      ...body,
      status: body.status || "pending",
      reason: body.reason || "",
    });

    return NextResponse.json(rdv);

  } catch (err) {
    console.error("POST /appointments ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ---------------------- PUT ----------------------
export async function PUT(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    const updated = await Appointment.findByIdAndUpdate(
      body.id,
      body,
      { new: true }
    )
      .populate("patientId", "name email role")
      .populate("doctorId", "name email role");

    return NextResponse.json(updated);

  } catch (err) {
    console.error("PUT /appointments ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ---------------------- DELETE ----------------------
export async function DELETE(req: Request) {
  try {
    await dbConnect();

    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id)
      return NextResponse.json({ error: "id manquant" }, { status: 400 });

    await Appointment.findByIdAndDelete(id);
    return NextResponse.json({ message: "deleted" });

  } catch (err) {
    console.error("DELETE /appointments ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
