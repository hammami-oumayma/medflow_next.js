"use client";

import { useEffect, useState } from "react";
import { CalendarPlus, CalendarCheck } from "lucide-react";

export default function AppointmentsPage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);

  const [form, setForm] = useState({
    patientId: "",
    doctorId: "",
    date: "",
    time: "",
  });

  const [editId, setEditId] = useState("");

  useEffect(() => {
    loadPatients();
    loadDoctors();
    loadAppointments();
  }, []);

  async function loadPatients() {
    const res = await fetch("/api/patients");
    setPatients(await res.json());
  }

  async function loadDoctors() {
    const res = await fetch("/api/users?role=DOCTOR");
    setDoctors(await res.json());
  }

  async function loadAppointments() {
    const res = await fetch("/api/appointments?all=true");
    const data = await res.json();

    setAppointments(
      data.map((d: any) => ({
        ...d,
        doctor: d.doctorId,
      }))
    );
  }

  async function submitForm(e: any) {
    e.preventDefault();

    await fetch("/api/appointments", {
      method: editId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editId ? { id: editId, ...form } : form),
    });

    setForm({ patientId: "", doctorId: "", date: "", time: "" });
    setEditId("");
    loadAppointments();
  }

  async function deleteAppointment(id: string) {
    await fetch(`/api/appointments?id=${id}`, { method: "DELETE" });
    loadAppointments();
  }

  return (
    <div className="space-y-10">

      {/* TITLE */}
      <div className="flex items-center gap-3">
          <h1 className="text-4xl font-bold text-gray-800">
          📅 Gestion des Rendez-vous
        </h1>
      </div>

      {/* FORM */}
      <form
        onSubmit={submitForm}
        className="bg-white p-8 rounded-2xl shadow-lg space-y-6 border border-gray-100"
      >
        <div className="flex items-center gap-2 mb-3">
          <CalendarPlus className="text-blue-600" />
          <h2 className="text-xl font-semibold">
            {editId ? "Modifier le rendez-vous" : "Créer un rendez-vous"}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Patient */}
          <div className="flex flex-col space-y-1.5">
            <label className="font-medium text-gray-700">Patient</label>
            <select
              className="rounded-xl px-4 py-3 bg-gray-100 focus:bg-white focus:ring-4 focus:ring-blue-200 outline-none transition-all"
              value={form.patientId}
              onChange={(e) => setForm({ ...form, patientId: e.target.value })}
              required
            >
              <option value="">Choisir patient</option>
              {patients.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Doctor */}
          <div className="flex flex-col space-y-1.5">
            <label className="font-medium text-gray-700">Médecin</label>
            <select
              className="rounded-xl px-4 py-3 bg-gray-100 focus:bg-white focus:ring-4 focus:ring-blue-200 outline-none transition-all"
              value={form.doctorId}
              onChange={(e) => setForm({ ...form, doctorId: e.target.value })}
              required
            >
              <option value="">Choisir médecin</option>
              {doctors.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div className="flex flex-col space-y-1.5">
            <label className="font-medium text-gray-700">Date</label>
            <input
              type="date"
              className="rounded-xl px-4 py-3 bg-gray-100 focus:bg-white focus:ring-4 focus:ring-blue-200 outline-none transition-all"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
            />
          </div>

          {/* Time */}
          <div className="flex flex-col space-y-1.5">
            <label className="font-medium text-gray-700">Heure</label>
            <input
              type="time"
              className="rounded-xl px-4 py-3 bg-gray-100 focus:bg-white focus:ring-4 focus:ring-blue-200 outline-none transition-all"
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
              required
            />
          </div>
        </div>

        {/* BUTTON */}
        <button className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-md hover:shadow-lg">
          {editId ? "Modifier" : "Créer"}
        </button>
      </form>

      {/* LISTE RDV */}
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <CalendarCheck className="text-blue-600" /> Liste des Rendez-vous
        </h2>

        <div className="space-y-4">
          {appointments.map((a) => (
            <div
              key={a._id}
              className="p-5 rounded-xl bg-gray-50 hover:shadow-md transition flex justify-between items-center"
            >
              <div>
                <p className="font-semibold text-lg text-gray-800">
                  📅 {a.date} — {a.time}
                </p>
                <p className="text-gray-600">Patient : {a.patientId?.name}</p>
                <p className="text-gray-600">Médecin : {a.doctor?.name}</p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setEditId(a._id);
                    setForm({
                      patientId: a.patientId._id,
                      doctorId: a.doctor._id,
                      date: a.date,
                      time: a.time,
                    });
                  }}
                  className="text-blue-600 font-medium hover:underline"
                >
                  Modifier
                </button>

                <button
                  onClick={() => deleteAppointment(a._id)}
                  className="text-red-600 font-medium hover:underline"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
