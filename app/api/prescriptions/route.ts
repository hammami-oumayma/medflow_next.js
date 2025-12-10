import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Prescription from "@/models/Prescription";

// ---------------------- POST - Créer une ordonnance ----------------------
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();

    const newPrescription = await Prescription.create({
      patientId: body.patientId,
      doctorId: body.doctorId,
      medications: body.medications,    // IMPORTANT : "medications", pas medicines
      notes: body.notes,
      amount: body.amount ?? 0,
      status: body.status ?? "non-payée",
    });

    return NextResponse.json(newPrescription, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}

// ---------------------- GET - Lister ordonnances ----------------------
export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const url = new URL(req.url);
    const patientId = url.searchParams.get("patientId");
    const doctorId = url.searchParams.get("doctorId");

    const query: any = {};

    if (patientId) query.patientId = patientId;
    if (doctorId) query.doctorId = doctorId;

    if (!patientId && !doctorId)
      return NextResponse.json(
        { error: "Aucun paramètre fourni (patientId ou doctorId)" },
        { status: 400 }
      );

    const prescriptions = await Prescription.find(query)
      .populate("patientId", "name")
      .populate("doctorId", "name")
      .sort({ createdAt: -1 });

    return NextResponse.json(prescriptions);
  } catch (error) {
    console.error("Error fetching prescriptions:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
