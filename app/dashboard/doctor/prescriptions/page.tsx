"use client";

import { useEffect, useState } from "react";
import { FileDown, User, Pill } from "lucide-react"; // icônes modernes

export default function Page() {
  const [doctorId, setDoctorId] = useState<string | null>(null);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);

  const loadMe = async () => {
    const res = await fetch("/api/me");
    const data = await res.json();
    setDoctorId(data?.user?._id || data?.user?.id);
  };

  const loadPrescriptions = async (id: string) => {
    const res = await fetch(`/api/prescriptions?doctorId=${id}`);
    setPrescriptions(await res.json());
  };

  useEffect(() => { loadMe(); }, []);
  useEffect(() => { if (doctorId) loadPrescriptions(doctorId); }, [doctorId]);

  return (
    <div className="p-10 min-h-screen bg-gray-50">
      <h1 className="text-4xl font-bold mb-10 text-gray-800">
        📄 Ordonnances
      </h1>

      {prescriptions.length === 0 && (
        <p className="text-gray-600 text-lg">Aucune ordonnance trouvée.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {prescriptions.map((p) => (
          <div
            key={p._id}
            className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition-all"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <User size={22} />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">
                {p.patientId?.name}
              </h2>
            </div>

            <div className="mt-4 flex items-center gap-2 text-gray-700">
              <Pill size={18} />
              <span>
                <b>Médicaments :</b> {p.medications.length}
              </span>
            </div>

            <a
              href={`/api/prescriptions/pdf?id=${p._id}`}
              target="_blank"
              className="mt-6 w-full btn-primary flex items-center justify-center gap-2"
            >
              <FileDown size={18} />
              Télécharger PDF
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
