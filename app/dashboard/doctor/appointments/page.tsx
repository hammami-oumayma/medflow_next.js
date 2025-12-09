"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [doctorId, setDoctorId] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<any[]>([]);

  // ---- Récupérer médecin connecté ----
  const loadMe = async () => {
    const res = await fetch("/api/me");
    const data = await res.json();

    if (data?.user?._id || data?.user?.id) {
      setDoctorId(data.user._id || data.user.id);
    }
  };

  // ---- Récupérer rendez-vous ----
  const loadAppointments = async (id: string) => {
    const res = await fetch(`/api/appointments?doctorId=${id}`, {
      cache: "no-store",
    });

    const data = await res.json();
    setAppointments(Array.isArray(data) ? data : []);
  };

  // ---- Ajouter à l'agenda ----
  const addToAgenda = async (app: any) => {
    if (!doctorId) return;

    await fetch("/api/agenda", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        doctorId,
        appointmentId: app._id,
      }),
    });

    alert("Ajouté à l'agenda !");
  };

  useEffect(() => {
    loadMe();
  }, []);

  useEffect(() => {
    if (doctorId) {
      loadAppointments(doctorId);
    }
  }, [doctorId]);

  if (!doctorId) return <p>Chargement médecin...</p>;

  return (
    <div className="p-8 bg-white min-h-screen">

      {/* ---- TITRE ---- */}
      <h2 className="text-3xl font-bold text-gray-900 mb-8">
          🧑‍⚕️ Tous les rendez-vous
      </h2>

      {/* ---- SI VIDE ---- */}
      {appointments.length === 0 && (
        <p className="text-gray-600">Aucun rendez-vous pour le moment.</p>
      )}

      {/* ---- LISTE rendez-vous ---- */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {appointments.map((app) => (
          <div
            key={app._id}
            className="bg-white shadow-md p-6 rounded-xl border hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              👤 {app.patientId?.name}
            </h3>

            <p className="text-gray-700"><b>Date :</b> {app.date}</p>
            <p className="text-gray-700"><b>Heure :</b> {app.time}</p>
            <p className="text-gray-700"><b>Status :</b> {app.status}</p>
            <p className="text-gray-700"><b>Raison :</b> {app.reason || "—"}</p>

            <button
              onClick={() => addToAgenda(app)}
              className="w-full mt-4 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
            >
              ➕ Ajouter à l'agenda
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
