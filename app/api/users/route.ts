import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

// CREATE USER
export async function POST(req: Request) {
  await dbConnect();
  const data = await req.json();

  const hashed = await bcrypt.hash(data.password, 10);

  const user = await User.create({
    ...data,
    password: hashed,
  });

  return NextResponse.json(user);
}

// LIST + SEARCH + FILTER BY ROLE
export async function GET(req: Request) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search");
  const role = searchParams.get("role");

  let query: any = {};

  // 🔍 Recherche par nom
  if (search) {
    query.name = { $regex: search, $options: "i" };
  }

  // 🎯 Filtre seulement un rôle (ex: DOCTOR)
  if (role) {
    query.role = role;
  }

  const users = await User.find(query);

  return NextResponse.json(users);
}

// DELETE USER
export async function DELETE(req: Request) {
  await dbConnect();
  const { id } = await req.json();

  await User.findByIdAndDelete(id);

  return NextResponse.json({ message: "Deleted" });
}
