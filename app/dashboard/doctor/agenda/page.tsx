// /app/agenda/page.jsx
"use client";

import { useEffect, useState } from "react";

export default function AgendaPage() {
  const [doctorId, setDoctorId] = useState(null);
  const [agenda, setAgenda] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [medications, setMedications] = useState([{ name: "", dosage: "", duration: "" }]);
  const [loadingSave, setLoadingSave] = useState(false);

  // ---------------------- Charger médecin connecté ----------------------
  const loadMe = async () => {
    try {
      const res = await fetch("/api/me");
      const data = await res.json();
      setDoctorId(data?.user?._id || data?.user?.id || null);
    } catch (err) {
      console.error("loadMe error", err);
    }
  };

  // ---------------------- Charger agenda ----------------------
  const loadAgenda = async (id) => {
    try {
      const res = await fetch(`/api/agenda?doctorId=${id}`, { cache: "no-store" });
      const data = await res.json();
      setAgenda(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("loadAgenda error", err);
      setAgenda([]);
    }
  };

  useEffect(() => { loadMe(); }, []);
  useEffect(() => { if (doctorId) loadAgenda(doctorId); }, [doctorId]);

  // ---------------------- Supprimer agenda ----------------------
  const removeAgenda = async (id) => {
    try {
      await fetch(`/api/agenda?id=${id}`, { method: "DELETE" });
      loadAgenda(doctorId);
    } catch (err) {
      console.error("removeAgenda error", err);
      alert("Erreur suppression agenda");
    }
  };

  // ---------------------- Prix de la facture ----------------------
  const calculateAmount = (meds) => {
    const base = 20;
    const perMed = 10;
    return base + meds.length * perMed;
  };

const createPrescription = async () => {
  if (!doctorId) return alert("Médecin non identifié.");
  if (!selectedPatient || !selectedPatient._id) return alert("Choisir un patient.");
  if (!medications.length) return alert("Ajouter un médicament.");

  for (const m of medications) {
    if (!m.name || !m.dosage) {
      return alert("Nom et dosage requis pour chaque médicament.");
    }
  }

  setLoadingSave(true);

  try {
    const res = await fetch("/api/prescriptions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        doctorId,
        patientId: selectedPatient._id,
        medicines: medications,
        price: calculateAmount(medications),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data?.error || "Erreur création ordonnance");
      return;
    }

    alert("Ordonnance créée et facture générée !");
    setSelectedPatient(null);
    setMedications([{ name: "", dosage: "", duration: "" }]);
    loadAgenda(doctorId);

  } catch (err) {
    console.error("createPrescription error", err);
    alert("Erreur serveur.");
  } finally {
    setLoadingSave(false);
  }
};

  // ---------------------- Gestion Médicaments ----------------------
  const updateMedication = (index, field, value) => {
    const copy = [...medications];
    copy[index][field] = value;
    setMedications(copy);
  };

  const addMedication = () =>
    setMedications([...medications, { name: "", dosage: "", duration: "" }]);

  const removeMedication = (i) =>
    setMedications(medications.filter((_, idx) => idx !== i));

  // ---------------------- Render ----------------------
  if (!doctorId) return <p className="p-6">Chargement médecin...</p>;

  return (
    <div className="min-h-screen p-10 bg-white">
      <h1 className="text-3xl font-bold text-black mb-8">📅 Agenda du Médecin</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agenda.map((item) => (
          <div key={item._id} className="bg-white shadow-md rounded-xl p-6 border border-gray-100">
            <p className="font-semibold text-lg">👤 {item?.appointmentId?.patientId?.name}</p>
            <p className="text-gray-700 mt-2">📅 <b>Date :</b> {item?.appointmentId?.date}</p>
            <p className="text-gray-700">⏰ <b>Heure :</b> {item?.appointmentId?.time}</p>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => removeAgenda(item._id)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Retirer
              </button>

              <button
                onClick={() => setSelectedPatient(item?.appointmentId?.patientId)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Créer ordonnance
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedPatient && (
        <div className="mt-10 bg-white shadow-lg border border-gray-100 p-6 rounded-xl max-w-3xl">
          <h3 className="text-2xl font-bold text-black mb-6">
            Nouvelle ordonnance — {selectedPatient.name}
          </h3>

          <div className="space-y-4">
            {medications.map((m, i) => (
              <div key={i} className="grid grid-cols-12 gap-3 items-center">
                <input
                  className="col-span-5 p-3 bg-gray-50 rounded-lg"
                  placeholder="Médicament"
                  value={m.name}
                  onChange={(e) => updateMedication(i, "name", e.target.value)}
                />
                <input
                  className="col-span-3 p-3 bg-gray-50 rounded-lg"
                  placeholder="Dosage"
                  value={m.dosage}
                  onChange={(e) => updateMedication(i, "dosage", e.target.value)}
                />
                <input
                  className="col-span-3 p-3 bg-gray-50 rounded-lg"
                  placeholder="Durée"
                  value={m.duration}
                  onChange={(e) => updateMedication(i, "duration", e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removeMedication(i)}
                  className="col-span-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg"
                >
                  ✕
                </button>
              </div>
            ))}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={addMedication}
                className="px-4 py-2 bg-gray-100 rounded-lg"
              >
                + Ajouter médicament
              </button>

              <div className="ml-auto flex items-center gap-3">
                <button
                  onClick={() => {
                    setSelectedPatient(null);
                    setMedications([{ name: "", dosage: "", duration: "" }]);
                  }}
                  className="px-5 py-3 bg-gray-300 rounded-lg"
                >
                  Annuler
                </button>

                <button
                  onClick={createPrescription}
                  disabled={loadingSave}
                  className={`px-5 py-3 rounded-lg text-white font-semibold ${
                    loadingSave
                      ? "bg-blue-300 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {loadingSave ? "Enregistrement..." : "Enregistrer & Facturer"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
