import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import {
  hashPassword,
  verifyPassword,
  signToken,
  setTokenCookie
} from "@/lib/auth";

export async function POST(req: Request) {
  try {
    await dbConnect();

    // Lire le body sans crash
    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
    }

    const url = new URL(req.url);
    const action = url.searchParams.get("action");

    // REGISTER
    if (action === "register") {
      const { name, email, password, role } = body;

      const exist = await User.findOne({ email });
      if (exist)
        return NextResponse.json(
          { error: "Email existe déjà" },
          { status: 409 }
        );

      const hashed = await hashPassword(password);
      const user = await User.create({
        name,
        email,
        password: hashed,
        role
      });

      const token = signToken({ id: user._id, role: user.role });

      const res = NextResponse.json({
        message: "Compte créé",
        role: user.role
      });

      setTokenCookie(res, token);
      return res;
    }

    // LOGIN
    if (action === "login") {
      const { email, password } = body;

      const user = await User.findOne({ email });
      if (!user)
        return NextResponse.json(
          { error: "Email incorrect" },
          { status: 401 }
        );

      const ok = await verifyPassword(password, user.password);
      if (!ok)
        return NextResponse.json(
          { error: "Mot de passe incorrect" },
          { status: 401 }
        );

      const token = signToken({ id: user._id, role: user.role });

      const res = NextResponse.json({
        message: "Connecté",
        role: user.role
      });

      setTokenCookie(res, token);

      return res;
    }

    return NextResponse.json({ error: "Action inconnue" }, { status: 400 });
  } catch (err: any) {
    console.error("🔥 ERREUR API AUTH :", err);
    return NextResponse.json(
      { error: "Erreur serveur : " + err.message },
      { status: 500 }
    );
  }
}
