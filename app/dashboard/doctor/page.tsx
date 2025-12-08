"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [doctorId, setDoctorId] = useState<string | null>(null);

  const [appointments, setAppointments] = useState<any[]>([]);
  const [agenda, setAgenda] = useState<any[]>([]);

  // ---------------- Récupérer le médecin connecté ----------------
  const loadMe = async () => {
    const res = await fetch("/api/me");
    const data = await res.json();

    if (data?.user?._id || data?.user?.id) {
      setDoctorId(data.user._id || data.user.id);
    }
  };

  // ---------------- FETCH APPOINTMENTS ----------------
  const loadAppointments = async (id: string) => {
    const res = await fetch(`/api/appointments?doctorId=${id}`, {
      cache: "no-store",
    });

    const data = await res.json();
    setAppointments(Array.isArray(data) ? data : []);
  };

  // ---------------- FETCH AGENDA ----------------
  const loadAgenda = async (id: string) => {
    const res = await fetch(`/api/agenda?doctorId=${id}`, {
      cache: "no-store",
    });

    const data = await res.json();
    setAgenda(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    loadMe();
  }, []);

  useEffect(() => {
    if (doctorId) {
      loadAppointments(doctorId);
      loadAgenda(doctorId);
    }
  }, [doctorId]);

  // ---------------- ADD TO AGENDA ----------------
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

    loadAgenda(doctorId);
  };

  // ---------------- REMOVE FROM AGENDA ----------------
  const removeAgenda = async (id: string) => {
    await fetch(`/api/agenda?id=${id}`, { method: "DELETE" });
    if (doctorId) loadAgenda(doctorId);
  };

  if (!doctorId) return <p>Chargement médecin...</p>;

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">Dashboard Médecin</h1>

      {/* --------------------- RENDEZ-VOUS --------------------- */}
      <h2 className="text-xl font-semibold mb-3">Tous les rendez-vous</h2>

      {appointments.length === 0 && <p>Aucun rendez-vous.</p>}

      {appointments.map((app) => (
        <div key={app._id} className="border shadow p-4 my-3 w-[450px]">
          <p><b>Patient :</b> {app.patientId?.name}</p>
          <p><b>Date :</b> {app.date}</p>
          <p><b>Heure :</b> {app.time}</p>
          <p><b>Status :</b> {app.status}</p>
          <p><b>Reason :</b> {app.reason || "—"}</p>

          <button
            onClick={() => addToAgenda(app)}
            className="px-3 py-1 bg-blue-600 text-white mt-3 rounded"
          >
            Ajouter à l'agenda
          </button>
        </div>
      ))}

      {/* --------------------- AGENDA --------------------- */}
      <h2 className="text-xl font-semibold mt-8 mb-3">Agenda du médecin</h2>

      {agenda.length === 0 && <p>Aucun élément dans l’agenda.</p>}

      {agenda.map((item) => (
        <div key={item._id} className="border shadow p-4 my-3 w-[450px]">
          <p><b>Patient :</b> {item.appointmentId?.patientId?.name}</p>
          <p><b>Date :</b> {item.appointmentId?.date}</p>
          <p><b>Heure :</b> {item.appointmentId?.time}</p>
          <p><b>Status :</b> {item.appointmentId?.status}</p>
          <p><b>Reason :</b> {item.appointmentId?.reason || "—"}</p>

          <button
            onClick={() => removeAgenda(item._id)}
            className="px-3 py-1 bg-red-600 text-white mt-3 rounded"
          >
            Retirer
          </button>
        </div>
      ))}
    </div>
  );
}
