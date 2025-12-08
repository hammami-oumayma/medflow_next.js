import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hashed: string) {
  return bcrypt.compare(password, hashed);
}

export function signToken(payload: any) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("❌ JWT_SECRET manquant dans .env.local");

  return jwt.sign(payload, secret, { expiresIn: "7d" });
}

export function setTokenCookie(res: NextResponse, token: string) {
  res.cookies.set("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    maxAge: 7 * 24 * 60 * 60
  });
}
