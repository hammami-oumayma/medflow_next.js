import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";

// ---------------------- GET ALL PATIENTS ----------------------
export async function GET() {
  try {
    await dbConnect();
    const patients = await User.find({ role: "PATIENT" }).lean();

    return NextResponse.json(patients);
  } catch (err) {
    console.error("GET /patients ERROR", err);
    return NextResponse.json([], { status: 500 });
  }
}

// ---------------------- CREATE PATIENT ----------------------
export async function POST(req: Request) {
  try {
    await dbConnect();
    const { name, email, password } = await req.json();

    const exists = await User.findOne({ email });
    if (exists)
      return NextResponse.json(
        { error: "Email déjà utilisé" },
        { status: 400 }
      );

    const patient = await User.create({
      name,
      email,
      password, // tu peux hasher si tu veux
      role: "PATIENT",
    });

    return NextResponse.json(patient);
  } catch (err) {
    console.error("POST /patients ERROR", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
