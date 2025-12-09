import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Prescription from "@/models/Prescription";


export async function GET(req: Request) {
  try {
    await dbConnect();

    const url = new URL(req.url);
    const patientId = url.searchParams.get("patientId");
    const doctorId = url.searchParams.get("doctorId");

    if (patientId) {
      const data = await Prescription.find({ patientId })
        .populate("doctorId", "name")
        .lean();

      return NextResponse.json(data);
    }

    if (doctorId) {
      const data = await Prescription.find({ doctorId })
        .populate("patientId", "name")
        .lean();

      return NextResponse.json(data);
    }

    return NextResponse.json([]);

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}


export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    const newPrescription = await Prescription.create(body);
    return NextResponse.json(newPrescription);

  } catch (err) {
    console.error("PRESCRIPTION POST ERROR:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await dbConnect();
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    await Prescription.findByIdAndDelete(id);

    return NextResponse.json({ message: "Supprimé" });

  } catch (err) {
    return NextResponse.json({ error: "Erreur" }, { status: 500 });
  }
}
