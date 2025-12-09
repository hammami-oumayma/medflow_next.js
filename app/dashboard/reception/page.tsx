"use client";

export default function Page() {
  return (
    <div className="space-y-12">

      <h1 className="text-4xl font-bold text-gray-800">Dashboard Receptioniste</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* ---- CARD 1 ---- */}
        <div className="p-6 bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Total Rendez-vous</h2>
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-xl">
              📅
            </div>
          </div>
          <p className="text-4xl font-bold mt-4">12</p>
        </div>

        {/* ---- CARD 2 ---- */}
        <div className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-blue-100">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-blue-700">Total patients</h2>
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-xl text-blue-700">
              🧑‍⚕️
            </div>
          </div>
          <p className="text-4xl font-bold mt-4 text-gray-800">48</p>
        </div>

        {/* ---- CARD 3 ---- */}
        <div className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-blue-100">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-blue-700">Total Ordonnances</h2>
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-xl text-blue-700">
              📝
            </div>
          </div>
          <p className="text-4xl font-bold mt-4 text-gray-800">31</p>
        </div>

      </div>
    </div>
  );
}
