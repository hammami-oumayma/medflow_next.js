"use client";

import { useEffect, useState } from "react";
import { CalendarDays, UserCircle, Clock, FileText } from "lucide-react";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    loadMe();
  }, []);

  async function loadMe() {
    const me = await fetch("/api/me").then((r) => r.json());
    loadAppointments(me.user.id);
  }

  async function loadAppointments(pid: string) {
    const res = await fetch(`/api/appointments?patientId=${pid}`);
    const data = await res.json();
    setAppointments(data);
  }

  return (
    <div className="space-y-10">
      
      {/* ---- TITLE ---- */}
      <div className="flex items-center gap-4">
        <h1 className="text-4xl font-bold text-gray-900"> 📅 Mes rendez-vous</h1>
      </div>

      {/* ---- LISTE ---- */}
      <div className="space-y-6">
        {appointments.map((rdv: any) => (
          <div
            key={rdv._id}
            className="p-7 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <Clock className="text-blue-600" size={26} />
                <p className="text-2xl font-semibold text-gray-800">
                  {rdv.date} — {rdv.time}
                </p>
              </div>

              {/* BADGE STATUS */}
              <span
                className={`px-4 py-1.5 rounded-full text-base font-semibold ${
                  rdv.status === "CONFIRMED"
                    ? "bg-green-100 text-green-700"
                    : rdv.status === "PENDING"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {rdv.status}
              </span>
            </div>

            {/* Docteur */}
            <div className="flex items-center gap-3 text-gray-700 mt-1">
              <UserCircle size={24} className="text-blue-500" />
              <p className="text-lg font-medium">
                Médecin :{" "}
                <span className="text-gray-900 font-semibold">
                  {rdv.doctorId?.name}
                </span>
              </p>
            </div>

            {/* Raison */}
            <div className="mt-4 flex items-start gap-3 text-gray-700">
              <FileText size={22} className="text-gray-400 mt-1" />
              <p className="text-lg leading-relaxed">
                <span className="font-semibold text-gray-800">Raison :</span>{" "}
                {rdv.reason}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
