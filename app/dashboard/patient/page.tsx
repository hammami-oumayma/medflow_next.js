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

   
    </div>
  );
}
