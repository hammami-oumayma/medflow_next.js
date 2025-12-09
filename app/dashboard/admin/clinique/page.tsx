"use client";

import { useState, useEffect } from "react";

export default function Page() {
  const [clinicName, setClinicName] = useState("");
  const [clinicAddress, setClinicAddress] = useState("");
  const [clinicPhone, setClinicPhone] = useState("");
  const [clinicEmail, setClinicEmail] = useState("");

  const [clinics, setClinics] = useState([]);
  const [searchClinic, setSearchClinic] = useState("");

  useEffect(() => {
    loadClinics();
  }, []);

  async function loadClinics() {
    const res = await fetch("/api/clinics");
    const data = await res.json();
    setClinics(data);
  }

  async function createClinic(e: any) {
    e.preventDefault();

    const res = await fetch("/api/clinics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: clinicName,
        address: clinicAddress,
        phone: clinicPhone,
        email: clinicEmail,
      }),
    });

    if (res.ok) {
      setClinicName("");
      setClinicAddress("");
      setClinicPhone("");
      setClinicEmail("");
      loadClinics();
    }
  }

  async function deleteClinic(id: string) {
    await fetch("/api/clinics", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    loadClinics();
  }

  const filteredClinics = clinics.filter((c: any) =>
    c.name.toLowerCase().includes(searchClinic.toLowerCase())
  );

  return (
    <div className="space-y-12">
      
      <h1 className="text-4xl font-bold text-gray-800">🏥 Gestion des cliniques</h1>

      {/* ----- FORM ----- */}
      <section className="card">
        <h2 className="card-title">Créer une clinique</h2>

        <form onSubmit={createClinic} className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <input className="input" placeholder="Nom de la clinique" value={clinicName} onChange={(e) => setClinicName(e.target.value)} />
          <input className="input" placeholder="Adresse" value={clinicAddress} onChange={(e) => setClinicAddress(e.target.value)} />
          <input className="input" placeholder="Téléphone" value={clinicPhone} onChange={(e) => setClinicPhone(e.target.value)} />
          <input className="input" placeholder="Email" value={clinicEmail} onChange={(e) => setClinicEmail(e.target.value)} />

          <button className="btn-primary col-span-full">➕ Ajouter la clinique</button>
        </form>
      </section>

      {/* ----- LIST ----- */}
      <section className="card">
        <h2 className="card-title">Liste des cliniques</h2>

        <input className="input mt-4" placeholder="🔍 Rechercher..." value={searchClinic} onChange={(e) => setSearchClinic(e.target.value)} />

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-8">
          {filteredClinics.map((c: any) => (
            <div className="item-card" key={c._id}>
              <p className="font-semibold text-xl">{c.name}</p>
              <p className="text-gray-600">{c.address}</p>
              <p className="text-gray-600">{c.phone}</p>
              <p className="text-gray-600">{c.email}</p>

              <button className="delete-btn" onClick={() => deleteClinic(c._id)}>
                🗑️ Supprimer
              </button>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
