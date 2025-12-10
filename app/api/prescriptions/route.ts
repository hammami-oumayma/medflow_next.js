import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Prescription from "@/models/Prescription";
import Invoice from "@/models/Invoice";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();

    const newPrescription = await Prescription.create({
      patientId: body.patientId,
      doctorId: body.doctorId,
      medicines: body.medicines,
      notes: body.notes,

      // 🟩 AJOUT
      amount: body.amount ?? 0,
      status: body.status ?? "non-payée",
    });

    return NextResponse.json(newPrescription, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}


export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const url = new URL(req.url);
    const doctorId = url.searchParams.get("doctorId");

    const query: any = {};
    if (doctorId) query.doctorId = doctorId;

    const prescriptions = await Prescription.find(query)
      .populate("patientId", "name")
      .populate("doctorId", "name");

    return NextResponse.json(prescriptions);
  } catch (error) {
    console.error("Error fetching prescriptions:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
