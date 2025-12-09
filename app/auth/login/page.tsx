"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function submit(e: any) {
    e.preventDefault();
    const res = await fetch("/api/auth?action=login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) return alert(data.error);

    router.push(`/dashboard/${data.role.toLowerCase()}`);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-xl shadow-2xl border border-blue-100 rounded-3xl p-10">
        
        {/* Logo + Title */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full mx-auto bg-blue-600 flex items-center justify-center shadow-lg">
            <span className="text-white text-3xl font-bold">🩺</span>
          </div>
          <h1 className="text-3xl font-bold mt-4 text-gray-800">
            Connexion à la Clinique
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Accédez à votre espace sécurisé
          </p>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="block mb-1 font-medium text-gray-700">Email</label>
            <input
              className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500"
              placeholder="exemple@mail.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Mot de passe
            </label>
            <input
              className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500"
              placeholder="•••••••••"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 transition text-white rounded-xl font-semibold shadow-lg">
            Se connecter
          </button>
        </form>

        {/* Create account */}
        <p className="text-center text-gray-600 text-sm mt-5">
          Pas de compte ?{" "}
          <Link
            href="/auth/register"
            className="text-blue-600 font-semibold hover:underline"
          >
            Créer un compte
          </Link>
        </p>

        <p className="text-center text-gray-500 text-sm mt-6">
          © 2025 Clinique Digitale — Tous droits réservés
        </p>
      </div>
    </div>
  );
}
