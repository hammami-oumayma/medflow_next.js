import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
  try {
    const cookie = req.headers.get("cookie") || "";

    // chercher le cookie "token"
    const match = cookie.match(/token=([^;]+)/);
    if (!match) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const token = match[1];

    // vérifier JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    return NextResponse.json(
      { user: decoded },
      { status: 200 }
    );

  } catch (err) {
    console.error("JWT ERROR:", err);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
