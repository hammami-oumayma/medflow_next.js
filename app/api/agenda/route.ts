import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Agenda from "@/models/Agenda";
import Appointment from "@/models/Appointment";

export async function GET(req: Request) {
  try {
    await dbConnect();

    const url = new URL(req.url);
    const doctorId = url.searchParams.get("doctorId");

    if (!doctorId) return NextResponse.json([]);

    const agenda = await Agenda.find({ doctorId })
      .populate({
        path: "appointmentId",
        select: "date time patientId status reason",
        populate: {
          path: "patientId",
          select: "name email",
        },
      })
      .lean();

    return NextResponse.json(agenda);
  } catch (err) {
    console.error("AGENDA GET ERROR:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { doctorId, appointmentId } = await req.json();

    const appointment = await Appointment.findById(appointmentId);

    const saved = await Agenda.create({
      doctorId,
      appointmentId,
      date: appointment.date,
      time: appointment.time,
    });

    return NextResponse.json(saved, { status: 201 });
  } catch (err) {
    console.error("AGENDA POST ERROR:", err);
    return NextResponse.json({ error: "Erreur" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await dbConnect();

    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    await Agenda.findByIdAndDelete(id);

    return NextResponse.json({ message: "Supprimé" });
  } catch (err) {
    return NextResponse.json({ error: "Erreur" }, { status: 500 });
  }
}
