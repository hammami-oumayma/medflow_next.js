"use client";

import { useState, useEffect } from "react";

type Doctor = {
  _id: string;
  name: string;
  email: string;
};

type Appointment = {
  _id: string;
  patientId: string;
  doctorId: { _id: string; name: string } | string;
  date: string;
  time: string;
  reason: string;
  status: string;
  doctorIdPopulated?: {
    _id: string;
    name: string;
  };
};

export default function Page() {
  const [patientId, setPatientId] = useState<string>("");

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // FORM STATES
  const [doctorId, setDoctorId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");
  const [editId, setEditId] = useState("");

  // ------------------------------------------
  // LOAD USER + DOCTORS
  // ------------------------------------------
  useEffect(() => {
    loadMe();
    loadDoctors();
  }, []);

  async function loadMe() {
    const res = await fetch("/api/me");
    const data = await res.json();
    if (!data.user) return;

    setPatientId(data.user.id);
    loadAppointments(data.user.id);
  }

  async function loadDoctors() {
    const res = await fetch("/api/users?role=DOCTOR");
    const data = await res.json();
    setDoctors(data);
  }

  // ------------------------------------------
  // LOAD APPOINTMENTS
  // ------------------------------------------
  async function loadAppointments(pid: string) {
    const res = await fetch(`/api/appointments?patientId=${pid}`);
    const data = await res.json();

    const formatted = data.map((item: any) => ({
      ...item,
      doctorIdPopulated: item.doctorId,
    }));

    setAppointments(formatted);
  }

  // ------------------------------------------
  // CREATE
  // ------------------------------------------
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

    resetForm();
    loadAppointments(patientId);
  }

  // ------------------------------------------
  // UPDATE
  // ------------------------------------------
  async function updateAppointment() {
    await fetch("/api/appointments", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editId,
        doctorId,
        date,
        time,
        reason,
      }),
    });

    resetForm();
    loadAppointments(patientId);
  }

  // ------------------------------------------
  // DELETE
  // ------------------------------------------
  async function deleteAppointment(id: string) {
    await fetch(`/api/appointments?id=${id}`, {
      method: "DELETE",
    });

    loadAppointments(patientId);
  }

  // ------------------------------------------
  // RESET FORM
  // ------------------------------------------
  function resetForm() {
    setDoctorId("");
    setDate("");
    setTime("");
    setReason("");
    setEditId("");
  }

  // ------------------------------------------
  // UI
  // ------------------------------------------
  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold mb-6">Mes Rendez-vous</h1>

      {/* FORMULAIRE */}
      <section className="p-6 border rounded shadow">
        <h2 className="text-xl font-semibold mb-3">
          {editId ? "Modifier le rendez-vous" : "Réserver un rendez-vous"}
        </h2>

        <form
          onSubmit={editId ? updateAppointment : createAppointment}
          className="grid grid-cols-2 gap-4"
        >
          <select
            value={doctorId}
            onChange={(e) => setDoctorId(e.target.value)}
            className="border p-2 rounded"
            required
          >
            <option value="">Choisir médecin</option>
            {doctors.map((d) => (
              <option key={d._id} value={d._id}>
                {d.name}
              </option>
            ))}
          </select>

          <input
            type="date"
            className="border p-2 rounded"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />

          <input
            type="time"
            className="border p-2 rounded"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />

          {/* AJOUT REASON */}
          <textarea
            className="border p-2 rounded col-span-2"
            placeholder="Raison du rendez-vous"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />

          <button
            type="submit"
            className="col-span-2 bg-indigo-600 text-white p-3 rounded hover:bg-indigo-700"
          >
            {editId ? "Modifier" : "Réserver"}
          </button>
        </form>
      </section>

      {/* LISTE RENDEZ-VOUS */}
      <section className="p-6 border rounded shadow">
        <h2 className="text-xl font-semibold mb-3">Mes rendez-vous</h2>

        <div className="space-y-3">
          {appointments.length === 0 && <p>Aucun rendez-vous.</p>}

          {appointments.map((rdv) => (
            <div
              key={rdv._id}
              className="p-4 border rounded flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">
                  {rdv.date} — {rdv.time}
                </p>

                <p className="text-sm text-gray-600">
                  Médecin : {rdv.doctorIdPopulated?.name ?? "—"}
                </p>

                <p className="text-sm">Motif : {rdv.reason}</p>

                <p className="text-sm text-indigo-600">
                  Statut : {rdv.status}
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  className="text-blue-600"
                  onClick={() => {
                    setEditId(rdv._id);
                    setDoctorId(
                      typeof rdv.doctorId === "string"
                        ? rdv.doctorId
                        : rdv.doctorId._id
                    );
                    setDate(rdv.date);
                    setTime(rdv.time);
                    setReason(rdv.reason);
                  }}
                >
                  Modifier
                </button>

                <button
                  className="text-red-600"
                  onClick={() => deleteAppointment(rdv._id)}
                >
                  Annuler
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
