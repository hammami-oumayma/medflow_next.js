"use client";

import { useEffect, useState } from "react";

export default function Page() {
  // -------------------- STATES --------------------
  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);

  // Patient form
  const [newPatient, setNewPatient] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Appointment form
  const [form, setForm] = useState({
    patientId: "",
    doctorId: "",
    date: "",
    time: "",
  });
  const [editId, setEditId] = useState("");

  // -------------------- LOAD DATA --------------------
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

    const formatted = data.map((item: any) => ({
      ...item,
      doctor: item.doctorId,
    }));

    setAppointments(formatted);
  }

  // -------------------- CREATE PATIENT --------------------
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

  // -------------------- CREATE / UPDATE APPOINTMENT --------------------
  async function submitAppointment(e: any) {
    e.preventDefault();

    const payload = editId ? { id: editId, ...form } : form;

    await fetch("/api/appointments", {
      method: editId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    resetForm();
    loadAppointments();
  }

  function resetForm() {
    setEditId("");
    setForm({ patientId: "", doctorId: "", date: "", time: "" });
  }

  // -------------------- DELETE APPOINTMENT --------------------
  async function deleteAppointment(id: string) {
    await fetch(`/api/appointments?id=${id}`, { method: "DELETE" });
    loadAppointments();
  }

  // -------------------- UI --------------------
  return (
    <div className="space-y-12 p-6">
      {/* TITLE */}
      <h1 className="text-3xl font-bold">Dashboard Réception</h1>

      {/* ==========================================================
          1) ENREGISTREMENT PATIENTS
      ========================================================== */}
      <section className="p-6 border rounded shadow space-y-4">
        <h2 className="text-xl font-semibold">Enregistrer un patient</h2>

        <form onSubmit={createPatient} className="grid grid-cols-3 gap-4">
          <input
            className="border p-2 rounded"
            placeholder="Nom"
            value={newPatient.name}
            onChange={(e) =>
              setNewPatient({ ...newPatient, name: e.target.value })
            }
            required
          />
          <input
            className="border p-2 rounded"
            placeholder="Email"
            value={newPatient.email}
            onChange={(e) =>
              setNewPatient({ ...newPatient, email: e.target.value })
            }
            required
          />
          <input
            className="border p-2 rounded"
            type="password"
            placeholder="Mot de passe"
            value={newPatient.password}
            onChange={(e) =>
              setNewPatient({ ...newPatient, password: e.target.value })
            }
            required
          />

          <button className="col-span-3 bg-green-600 text-white p-3 rounded">
            Ajouter patient
          </button>
        </form>

        {/* LISTE PATIENTS */}
        <h3 className="text-lg font-semibold">Liste des patients</h3>
        <ul className="space-y-2">
          {patients.map((p) => (
            <li key={p._id} className="p-3 border rounded">
              {p.name} — {p.email}
            </li>
          ))}
        </ul>
      </section>

      {/* ==========================================================
          2) GESTION RENDEZ-VOUS
      ========================================================== */}
      <section className="p-6 border rounded shadow space-y-4">
        <h2 className="text-xl font-semibold">
          {editId ? "Modifier un rendez-vous" : "Créer un rendez-vous"}
        </h2>

        <form onSubmit={submitAppointment} className="grid grid-cols-2 gap-4">
          <select
            required
            className="border p-2 rounded"
            value={form.patientId}
            onChange={(e) =>
              setForm({ ...form, patientId: e.target.value })
            }
          >
            <option value="">Choisir patient</option>
            {patients.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>

          <select
            required
            className="border p-2 rounded"
            value={form.doctorId}
            onChange={(e) =>
              setForm({ ...form, doctorId: e.target.value })
            }
          >
            <option value="">Choisir médecin</option>
            {doctors.map((d) => (
              <option key={d._id} value={d._id}>
                {d.name}
              </option>
            ))}
          </select>

          <input
            required
            type="date"
            className="border p-2 rounded"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />

          <input
            required
            type="time"
            className="border p-2 rounded"
            value={form.time}
            onChange={(e) => setForm({ ...form, time: e.target.value })}
          />

          <button className="col-span-2 bg-indigo-600 text-white p-3 rounded">
            {editId ? "Modifier" : "Créer"}
          </button>
        </form>

        {/* LISTE RDV */}
        <h3 className="text-lg font-semibold">Liste des rendez-vous</h3>

        <div className="space-y-3">
          {appointments.map((a) => (
            <div
              key={a._id}
              className="p-4 border rounded flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">
                  {a.date} — {a.time}
                </p>
                <p className="text-sm text-gray-600">
                  Patient : {a.patientId?.name}
                </p>
                <p className="text-sm text-gray-600">
                  Médecin : {a.doctor?.name}
                </p>
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
                  className="text-blue-600"
                >
                  Modifier
                </button>

                <button
                  onClick={() => deleteAppointment(a._id)}
                  className="text-red-600"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
