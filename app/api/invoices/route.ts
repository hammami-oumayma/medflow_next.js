import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Invoice from "@/models/Invoice";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    const invoice = await Invoice.create(body);

    return NextResponse.json(invoice);
  } catch (err) {
    console.error("INVOICE POST ERROR:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    await dbConnect();

    const url = new URL(req.url);
    const patientId = url.searchParams.get("patientId");

    if (patientId) {
      const invoices = await Invoice.find({ patientId })
        .populate("prescriptionId")
        .populate("doctorId", "name")
        .lean();

      return NextResponse.json(invoices);
    }

    return NextResponse.json([]);

  } catch (err) {
    return NextResponse.json({ error: "Erreur" }, { status: 500 });
  }
}
