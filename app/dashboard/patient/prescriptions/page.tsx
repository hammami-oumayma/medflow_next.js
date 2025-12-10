"use client";

import { useEffect, useState } from "react";
import { FileDown, Pill, CalendarDays } from "lucide-react";

export default function PatientPrescriptionsPage() {
  const [patientId, setPatientId] = useState<string | null>(null);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // -------------------- Récupérer utilisateur connecté -------------------- //
  const loadMe = async () => {
    try {
      const res = await fetch("/api/me");
      const data = await res.json();
      setPatientId(data?.user?._id || data?.user?.id || null);
    } catch (e) {
      console.error("loadMe:", e);
    }
  };

  // -------------------- Charger ordonnances patient -------------------- //
  const loadPrescriptions = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/prescriptions?patientId=${id}`);
      const data = await res.json();

      if (Array.isArray(data)) setPrescriptions(data);
      else setPrescriptions([]);
    } catch (err) {
      console.error("loadPrescriptions:", err);
      setPrescriptions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMe();
  }, []);

  useEffect(() => {
    if (patientId) loadPrescriptions(patientId);
  }, [patientId]);

  return (
    <div className="p-8 min-h-screen">

      <h1 className="text-3xl font-bold mb-8">Mes ordonnances</h1>

      {loading && <p className="text-gray-600">Chargement...</p>}

      {!loading && prescriptions.length === 0 && (
        <p className="text-gray-500 text-lg">Aucune ordonnance trouvée.</p>
      )}

      <div className="space-y-6">
        {prescriptions.map((p) => (
          <div
            key={p._id}
            className="bg-white rounded-xl shadow-md border p-6 hover:shadow-lg transition-all"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                Ordonnance du {new Date(p.createdAt).toLocaleDateString()}
              </h2>

              <a
                href={`/api/prescriptions/pdf?id=${p._id}`}
                target="_blank"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg inline-flex items-center gap-2"
              >
                <FileDown size={18} /> Télécharger PDF
              </a>
            </div>

            {/* Médecin */}
            <p className="text-gray-700 mb-2">
              <b>Médecin :</b> {p.doctorId?.name || "Inconnu"}
            </p>

            {/* Médicaments */}
            <div className="mb-2 flex items-center gap-2 text-gray-700">
              <Pill size={18} />
              <span>
                <b>Médicaments :</b> {p.medications?.length || 0}
              </span>
            </div>

            {/* Infos facture */}
            <p className="text-gray-700">
              <b>Montant facture :</b> {p.amount ? `${p.amount} TND` : "—"}
            </p>
            <p className="text-gray-700">
              <b>Statut :</b> {p.status || "—"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
