"use client";

import { useEffect, useState } from "react";
import { FileText, CalendarDays, PlusCircle, ClipboardList } from "lucide-react";

export default function Page() {
  const [activeSection, setActiveSection] = useState("prescriptions");
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMe();
  }, []);

  // Charger patient connecté
  async function loadMe() {
    const me = await fetch("/api/me").then((r) => r.json());
    if (me?.user?.id) loadPrescriptions(me.user.id);
  }

  // Charger ses ordonnances
  async function loadPrescriptions(patientId: string) {
    setLoading(true);
    const res = await fetch(`/api/prescriptions?patientId=${patientId}`);
    const data = await res.json();
    setPrescriptions(data);
    setLoading(false);
  }

  return (
    <div className="space-y-12 pb-20">

      <h1 className="text-4xl font-bold text-gray-800">Dashboard Patient</h1>

      {/* ---- CARDS MENU ---- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* CARD RDV */}
        <div
          onClick={() => setActiveSection("appointments")}
          className="p-6 bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-2xl shadow-lg hover:shadow-xl active:scale-[0.98] cursor-pointer transition-all duration-300"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Mes rendez-vous</h2>
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <CalendarDays size={26} />
            </div>
          </div>
          <p className="text-sm opacity-90 mt-4">Gérer vos rendez-vous ici.</p>
        </div>

        {/* CARD CRÉER RDV */}
        <div
          onClick={() => setActiveSection("create")}
          className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl border border-blue-100 active:scale-[0.98] cursor-pointer transition-all duration-300"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-blue-700">Créer RDV</h2>
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-700">
              <PlusCircle size={26} />
            </div>
          </div>
          <p className="text-gray-700 mt-4">Réserver un rendez-vous.</p>
        </div>

        {/* CARD ORDONNANCES */}
        <div
          onClick={() => setActiveSection("prescriptions")}
          className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl border border-blue-100 active:scale-[0.98] cursor-pointer transition-all duration-300"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-blue-700">Ordonnances</h2>
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-700">
              <FileText size={26} />
            </div>
          </div>
          <p className="text-gray-700 mt-4">
            Consulter et télécharger vos ordonnances.
          </p>
        </div>

      </div>

      {/* ---- SECTION ORDONNANCES ---- */}
      {activeSection === "prescriptions" && (
        <div className="space-y-6">

          <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <ClipboardList className="text-blue-600" size={30} />
            Mes ordonnances
          </h2>

          {loading ? (
            <p className="text-gray-600 text-lg">Chargement...</p>
          ) : prescriptions.length === 0 ? (
            <p className="text-gray-600 text-lg">Aucune ordonnance trouvée.</p>
          ) : (
            <div className="space-y-6">

              {prescriptions.map((p: any) => (
                <div
                  key={p._id}
                  className="p-6 bg-white rounded-2xl border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300"
                >
                  {/* HEADER */}
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="text-xl font-semibold text-gray-900">
                        {new Date(p.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <a
                      className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition text-sm font-medium"
                      href={`/api/prescriptions/pdf?id=${p._id}`}
                    >
                      Télécharger PDF
                    </a>
                  </div>

                  {/* DOCTOR INFO */}
                  <div className="mt-4">
                    <p className="font-bold text-gray-800">Médecin</p>
                    <p className="text-gray-700">{p.doctorId?.name}</p>
                  </div>

                  {/* MEDICATION LIST */}
                  <div className="mt-6">
                    <p className="font-bold text-gray-800 mb-2">Médicaments prescrits :</p>

                    <div className="grid gap-3">

                      {p.medications.map((m: any, i: number) => (
                        <div
                          key={i}
                          className="p-4 bg-gray-50 rounded-xl border border-gray-200"
                        >
                          <p className="font-semibold text-gray-900">{m.name}</p>

                          <div className="flex flex-wrap gap-3 mt-2">
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm">
                           Dosage :   {m.dosage}
                            </span>
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm">
                            Duration :  {m.duration}
                            </span>
                          </div>
                        </div>
                      ))}

                    </div>
                  </div>

                </div>
              ))}

            </div>
          )}
        </div>
      )}

    </div>
  );
}
