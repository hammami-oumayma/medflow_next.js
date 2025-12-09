"use client";

import { useState, useEffect } from "react";
import { UserPlus, User } from "lucide-react";

export default function PatientsPage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [newPatient, setNewPatient] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    loadPatients();
  }, []);

  async function loadPatients() {
    const res = await fetch("/api/patients");
    setPatients(await res.json());
  }

  async function createPatient(e: any) {
    e.preventDefault();

    await fetch("/api/patients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPatient),
    });

    setNewPatient({ name: "", email: "", password: "" });
    loadPatients();
  }

  return (
    <div className="space-y-10">

      {/* TITLE */}
      <div className="flex items-center gap-3">
         <h1 className="text-4xl font-bold text-gray-800"> 🧑‍⚕️Gestion des Patients</h1>
      </div>

      {/* FORM */}
      <form
        onSubmit={createPatient}
        className="bg-white p-8 rounded-2xl shadow-lg space-y-6 border border-gray-100"
      >
        <div className="flex items-center gap-2 mb-3">
          <UserPlus className="text-blue-600" />
          <h2 className="text-xl font-semibold">Enregistrer un Patient</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Nom */}
          <div className="flex flex-col space-y-1.5">
            <label className="font-medium text-gray-700">Nom</label>
            <input
              className="rounded-xl px-4 py-3 bg-gray-100 focus:bg-white focus:ring-4 focus:ring-blue-200 outline-none transition-all"
              placeholder="Nom du patient"
              value={newPatient.name}
              onChange={(e) =>
                setNewPatient({ ...newPatient, name: e.target.value })
              }
              required
            />
          </div>

          {/* Email */}
          <div className="flex flex-col space-y-1.5">
            <label className="font-medium text-gray-700">Email</label>
            <input
              className="rounded-xl px-4 py-3 bg-gray-100 focus:bg-white focus:ring-4 focus:ring-blue-200 outline-none transition-all"
              placeholder="Email"
              value={newPatient.email}
              onChange={(e) =>
                setNewPatient({ ...newPatient, email: e.target.value })
              }
              required
            />
          </div>

          {/* Mot de passe */}
          <div className="flex flex-col space-y-1.5">
            <label className="font-medium text-gray-700">Mot de passe</label>
            <input
              type="password"
              className="rounded-xl px-4 py-3 bg-gray-100 focus:bg-white focus:ring-4 focus:ring-blue-200 outline-none transition-all"
              placeholder="Mot de passe"
              value={newPatient.password}
              onChange={(e) =>
                setNewPatient({ ...newPatient, password: e.target.value })
              }
              required
            />
          </div>

        </div>

        {/* BUTTON */}
        <button
          className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-md hover:shadow-lg"
        >
          Ajouter
        </button>
      </form>

      {/* LISTE */}
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <User className="text-blue-600" /> Liste des Patients
        </h2>

        <div className="space-y-4">
          {patients.map((p) => (
            <div
              key={p._id}
              className="p-4 rounded-xl flex items-center gap-4 hover:shadow-lg transition bg-gray-50"
            >
              {/* Avatar */}
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                {p.name?.charAt(0).toUpperCase()}
              </div>

              {/* Infos */}
              <div>
                <p className="font-semibold text-lg">{p.name}</p>
                <p className="text-gray-600">{p.email}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
