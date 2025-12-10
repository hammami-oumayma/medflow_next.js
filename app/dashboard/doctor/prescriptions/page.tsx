// /app/prescriptions/page.jsx
"use client";

import { useEffect, useState } from "react";
import { FileDown, User, Pill } from "lucide-react";

export default function PrescriptionsPage() {
  const [doctorId, setDoctorId] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadMe = async () => {
    try {
      const res = await fetch("/api/me");
      const data = await res.json();
      setDoctorId(data?.user?._id || data?.user?.id || null);
    } catch (err) {
      console.error("loadMe:", err);
    }
  };

  const loadPrescriptions = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/prescriptions?doctorId=${id}`);
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

  useEffect(() => { loadMe(); }, []);
  useEffect(() => { if (doctorId) loadPrescriptions(doctorId); }, [doctorId]);

  return (
    <div className="p-10 min-h-screen bg-gray-50">
      <h1 className="text-4xl font-bold mb-10 text-gray-800">📄 Ordonnances</h1>

      {loading && <p>Chargement...</p>}
      {!loading && prescriptions.length === 0 && <p className="text-gray-600 text-lg">Aucune ordonnance trouvée.</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {prescriptions.map((p) => (
          <div key={p._id} className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <User size={22} />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">{p.patientId?.name || "Patient inconnu"}</h2>
            </div>

            <div className="mt-4 flex items-center gap-2 text-gray-700">
              <Pill size={18} />
              <span><b>Médicaments :</b> {Array.isArray(p.medications) ? p.medications.length : 0}</span>
            </div>

            <div className="mt-4 text-sm text-gray-600">
              <div><b>Date :</b> {new Date(p.createdAt).toLocaleString()}</div>
     <p><b>Montant facture :</b> {p.amount ? p.amount + " TND" : "—"}</p>
<p><b>Statut :</b> {p.status || "—"}</p>

              </div>

            <a href={`/api/prescriptions/pdf?id=${p._id}`} target="_blank" rel="noreferrer" className="mt-6 inline-flex w-full btn-primary items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg">
              <FileDown size={18} /> Télécharger PDF
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
