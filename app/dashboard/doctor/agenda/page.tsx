"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [doctorId, setDoctorId] = useState<string | null>(null);
  const [agenda, setAgenda] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  const [medications, setMedications] = useState([
    { name: "", dosage: "", duration: "" },
  ]);

  const loadMe = async () => {
    const res = await fetch("/api/me");
    const data = await res.json();
    setDoctorId(data?.user?._id || data?.user?.id);
  };

  const loadAgenda = async (id: string) => {
    const res = await fetch(`/api/agenda?doctorId=${id}`, { cache: "no-store" });
    const data = await res.json();
    setAgenda(Array.isArray(data) ? data : []);
  };

  useEffect(() => { loadMe(); }, []);
  useEffect(() => { if (doctorId) loadAgenda(doctorId); }, [doctorId]);

  const removeAgenda = async (id: string) => {
    await fetch(`/api/agenda?id=${id}`, { method: "DELETE" });
    if (doctorId) loadAgenda(doctorId);
  };

  const createPrescription = async () => {
    if (!doctorId || !selectedPatient)
      return alert("Choisir un patient");

    await fetch("/api/prescriptions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        doctorId,
        patientId: selectedPatient._id,
        medications,
      }),
    });

    alert("Ordonnance créée !");
    setSelectedPatient(null);
    setMedications([{ name: "", dosage: "", duration: "" }]);
  };

  if (!doctorId) return <p>Chargement...</p>;

  return (
    <div className="min-h-screen p-10 bg-white">
      <h1 className="text-3xl font-bold text-black mb-8">
          📅 Agenda du Médecin
      </h1>

      {/* GRID AGENDA */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agenda.map((item) => (
          <div
            key={item._id}
            className="bg-white shadow-md rounded-xl p-6 border border-gray-200"
          >
            <p className="font-semibold text-lg flex items-center gap-2">
              👤 {item.appointmentId?.patientId?.name}
            </p>

            <p className="text-gray-700 mt-2">
              📅 <b>Date :</b> {item.appointmentId?.date}
            </p>

            <p className="text-gray-700">
              ⏰ <b>Heure :</b> {item.appointmentId?.time}
            </p>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => removeAgenda(item._id)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Retirer
              </button>

              <button
                onClick={() => setSelectedPatient(item.appointmentId?.patientId)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Créer ordonnance
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* FORMULAIRE ORDONNANCE */}
      {selectedPatient && (
        <div className="mt-10 bg-white shadow-lg border border-gray-200 p-6 rounded-xl max-w-xl">
          <h3 className="text-2xl font-bold text-black mb-6">
            Nouvelle ordonnance — {selectedPatient?.name}
          </h3>

          {medications.map((m, i) => (
            <div key={i} className="grid grid-cols-3 gap-4 mb-4">
              <input
                className="p-3 rounded-lg border border-gray-300 shadow-sm"
                placeholder="Médicament"
                value={m.name}
                onChange={(e) => {
                  const copy = [...medications];
                  copy[i].name = e.target.value;
                  setMedications(copy);
                }}
              />

              <input
                className="p-3 rounded-lg border border-gray-300 shadow-sm"
                placeholder="Dosage"
                value={m.dosage}
                onChange={(e) => {
                  const copy = [...medications];
                  copy[i].dosage = e.target.value;
                  setMedications(copy);
                }}
              />

              <input
                className="p-3 rounded-lg border border-gray-300 shadow-sm"
                placeholder="Durée"
                value={m.duration}
                onChange={(e) => {
                  const copy = [...medications];
                  copy[i].duration = e.target.value;
                  setMedications(copy);
                }}
              />
            </div>
          ))}

          <button
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            onClick={() =>
              setMedications([
                ...medications,
                { name: "", dosage: "", duration: "" },
              ])
            }
          >
            + Ajouter médicament
          </button>

          <div className="mt-6 flex gap-4">
            <button
              className="px-5 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              onClick={createPrescription}
            >
              Enregistrer
            </button>

            <button
              className="px-5 py-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
              onClick={() => setSelectedPatient(null)}
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
