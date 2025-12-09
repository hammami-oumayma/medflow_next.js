"use client";

import { useState, useEffect } from "react";

export default function CreateAppointmentPage() {
  const [patientId, setPatientId] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [doctorId, setDoctorId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");

  useEffect(() => {
    loadMe();
    loadDoctors();
  }, []);

  async function loadMe() {
    const res = await fetch("/api/me");
    const data = await res.json();
    setPatientId(data.user.id);
  }

  async function loadDoctors() {
    const res = await fetch("/api/users?role=DOCTOR");
    const data = await res.json();
    setDoctors(data);
  }

  async function createAppointment(e: any) {
    e.preventDefault();

    await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        patientId,
        doctorId,
        date,
        time,
        reason,
      }),
    });

    alert("Rendez-vous créé !");
    setDoctorId("");
    setDate("");
    setTime("");
    setReason("");
  }

  return (
    <div className="space-y-8">

      <h1 className="text-3xl font-bold text-gray-800">🆕 Créer un rendez-vous</h1>

      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">

        <form onSubmit={createAppointment} className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* MÉDECIN */}
          <div className="relative">
            <label className="text-sm font-medium text-gray-700">Médecin</label>
            <select
              className="mt-1 w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              required
            >
              <option value="">Choisir médecin</option>
              {doctors.map((d: any) => (
                <option key={d._id} value={d._id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* DATE */}
          <div>
            <label className="text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              className="mt-1 w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          {/* HEURE */}
          <div>
            <label className="text-sm font-medium text-gray-700">Heure</label>
            <input
              type="time"
              className="mt-1 w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>

          {/* RAISON */}
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700">Raison du rendez-vous</label>
            <textarea
              className="mt-1 w-full p-3 border border-gray-300 rounded-xl h-32 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="Décrire brièvement la raison du rendez-vous"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
          </div>

          {/* BOUTON */}
          <button
            className="md:col-span-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold p-4 rounded-xl shadow-md transition-all"
          >
            Réserver le rendez-vous
          </button>

        </form>
      </div>
    </div>
  );
}
