"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("PATIENT");
  const router = useRouter();

  async function submit(e: any) {
    e.preventDefault();
    const res = await fetch("/api/auth?action=register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });

    const data = await res.json();
    if (!res.ok) return alert(data.error);

    router.push(`/auth/login`);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-xl shadow-2xl border border-blue-100 rounded-3xl p-10">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full mx-auto bg-blue-600 flex items-center justify-center shadow-lg">
            <span className="text-white text-3xl font-bold">🩺</span>
          </div>
          <h1 className="text-3xl font-bold mt-4 text-gray-800">
            Créer un compte
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Rejoignez la plateforme de la clinique
          </p>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="space-y-5">

          <div>
            <label className="block mb-1 font-medium text-gray-700">Nom complet</label>
            <input
              className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500"
              placeholder="Votre nom"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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
            <label className="block mb-1 font-medium text-gray-700">Mot de passe</label>
            <input
              className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500"
              placeholder="•••••••••"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">Rôle</label>
            <select
              className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="PATIENT">Patient</option>
              <option value="DOCTOR">Docteur</option>
              <option value="RECEPTION">Réception</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 transition text-white rounded-xl font-semibold shadow-lg">
            Créer le compte
          </button>
        </form>

        {/* Login link */}
        <p className="text-center text-gray-600 text-sm mt-5">
          Vous avez déjà un compte ?{" "}
          <Link
            href="/auth/login"
            className="text-blue-600 font-semibold hover:underline"
          >
            Se connecter
          </Link>
        </p>

      </div>
    </div>
  );
}
