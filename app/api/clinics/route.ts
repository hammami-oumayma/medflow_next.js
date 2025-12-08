import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Clinic from "@/models/Clinic";

// GET ALL CLINICS
export async function GET() {
  await dbConnect();

  const clinics = await Clinic.find();
  return NextResponse.json(clinics);
}

// CREATE CLINIC
export async function POST(req: Request) {
  await dbConnect();

  const { name, address, phone, email } = await req.json();

  if (!name) {
    return NextResponse.json(
      { error: "Le nom de la clinique est obligatoire" },
      { status: 400 }
    );
  }

  const clinic = await Clinic.create({ name, address, phone, email });
  return NextResponse.json(clinic);
}

// UPDATE CLINIC
export async function PUT(req: Request) {
  await dbConnect();

  const { id, name, address, phone, email } = await req.json();

  if (!id) {
    return NextResponse.json(
      { error: "ID requis pour modifier" },
      { status: 400 }
    );
  }

  const updated = await Clinic.findByIdAndUpdate(
    id,
    { name, address, phone, email },
    { new: true }
  );

  return NextResponse.json(updated);
}

// DELETE CLINIC
export async function DELETE(req: Request) {
  await dbConnect();

  const { id } = await req.json();

  if (!id) {
    return NextResponse.json(
      { error: "ID requis pour supprimer" },
      { status: 400 }
    );
  }

  await Clinic.findByIdAndDelete(id);

  return NextResponse.json({ success: true });
}
