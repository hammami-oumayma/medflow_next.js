import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Prescription from "@/models/Prescription";
import { PDFDocument, StandardFonts } from "pdf-lib";

export async function GET(req: Request) {
  try {
    await dbConnect();

    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id)
      return NextResponse.json({ error: "ID manquant" }, { status: 400 });

    const prescription = await Prescription.findById(id)
      .populate("doctorId")
      .populate("patientId")
      .lean();

    if (!prescription)
      return NextResponse.json(
        { error: "Prescription introuvable" },
        { status: 404 }
      );

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    let y = 750;

    page.drawText("Ordonnance Médicale", { x: 180, y, size: 20, font });
    y -= 40;

    page.drawText(`Médecin : ${prescription.doctorId?.name ?? ""}`, {
      x: 50, y, size: 14, font
    });

    y -= 20;

    page.drawText(`Patient : ${prescription.patientId?.name ?? ""}`, {
      x: 50, y, size: 14, font
    });

    y -= 40;
    page.drawText("Prescription :", { x: 50, y, size: 16, font });
    y -= 30;

    prescription.medications.forEach((med: any) => {
      page.drawText(`• ${med.name} — ${med.dosage} — ${med.duration}`, {
        x: 50, y, size: 14, font
      });
      y -= 20;
    });

    const pdfBytes = await pdfDoc.save();

    return new NextResponse(Buffer.from(pdfBytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=prescription_${id}.pdf`
      }
    });
  } catch (error) {
    console.error("PDF ERROR:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
