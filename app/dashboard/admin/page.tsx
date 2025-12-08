"use client";

import { useState, useEffect } from "react";

export default function Page() {
  // FORM CLINIQUE
  const [clinicName, setClinicName] = useState("");
  const [clinicAddress, setClinicAddress] = useState("");
  const [clinicPhone, setClinicPhone] = useState("");
  const [clinicEmail, setClinicEmail] = useState("");

  // DATA
  const [clinics, setClinics] = useState([]);
  const [users, setUsers] = useState([]);

  // SEARCH
  const [searchClinic, setSearchClinic] = useState("");
  const [searchUser, setSearchUser] = useState("");

  // LOAD DATA
  useEffect(() => {
    loadClinics();
    loadUsers();
  }, []);

  async function loadClinics() {
    const res = await fetch("/api/clinics");
    const data = await res.json();
    setClinics(data);
  }

  async function loadUsers() {
    const res = await fetch("/api/users");
    const data = await res.json();
    setUsers(data);
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
    const res = await fetch("/api/clinics", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) loadClinics();
  }

  async function deleteUser(id: string) {
    const res = await fetch("/api/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) loadUsers();
  }

  // FILTERING
  const filteredClinics = clinics.filter((c: any) =>
    c.name.toLowerCase().includes(searchClinic.toLowerCase())
  );

  const filteredUsers = users.filter((u: any) =>
    u.name.toLowerCase().includes(searchUser.toLowerCase())
  );

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold mb-6">Dashboard Admin</h1>

      {/* ----------------------------- CREATE CLINIC ----------------------------- */}
      <section className="p-6 border rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Créer une clinique</h2>

        <form onSubmit={createClinic} className="grid grid-cols-2 gap-4">
          <input type="text" placeholder="Nom clinique" className="border p-2 rounded"
            value={clinicName} onChange={(e) => setClinicName(e.target.value)} required />

          <input type="text" placeholder="Adresse" className="border p-2 rounded"
            value={clinicAddress} onChange={(e) => setClinicAddress(e.target.value)} required />

          <input type="text" placeholder="Téléphone" className="border p-2 rounded"
            value={clinicPhone} onChange={(e) => setClinicPhone(e.target.value)} required />

          <input type="email" placeholder="Email" className="border p-2 rounded"
            value={clinicEmail} onChange={(e) => setClinicEmail(e.target.value)} required />

          <button type="submit"
            className="col-span-2 bg-indigo-600 text-white p-3 rounded hover:bg-indigo-700">
            Ajouter la clinique
          </button>
        </form>
      </section>

      {/* ----------------------------- LIST CLINICS + SEARCH ----------------------------- */}
      <section className="p-6 border rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Liste des cliniques</h2>

        <input
          type="text"
          placeholder="🔍 Chercher une clinique..."
          className="border p-2 rounded w-full mb-4"
          value={searchClinic}
          onChange={(e) => setSearchClinic(e.target.value)}
        />

        <div className="space-y-3">
          {filteredClinics.length === 0 && <p>Aucune clinique trouvée.</p>}

          {filteredClinics.map((c: any) => (
            <div key={c._id} className="p-4 border rounded flex justify-between items-center">
              <div>
                <p className="font-semibold">{c.name}</p>
                <p className="text-sm text-gray-600">{c.address}</p>
                <p className="text-sm text-gray-600">{c.phone}</p>
                <p className="text-sm text-gray-600">{c.email}</p>
              </div>

              <button onClick={() => deleteClinic(c._id)}
                className="text-red-600 hover:text-red-800">
                Supprimer
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ----------------------------- LIST USERS + SEARCH ----------------------------- */}
      <section className="p-6 border rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Gestion des utilisateurs</h2>

        <input
          type="text"
          placeholder="🔍 Chercher un utilisateur..."
          className="border p-2 rounded w-full mb-4"
          value={searchUser}
          onChange={(e) => setSearchUser(e.target.value)}
        />

        <div className="space-y-3">
          {filteredUsers.length === 0 && <p>Aucun utilisateur trouvé.</p>}

          {filteredUsers.map((u: any) => (
            <div key={u._id} className="p-4 border rounded flex justify-between items-center">
              <div>
                <p className="font-semibold">{u.name} — {u.role}</p>
                <p className="text-sm text-gray-600">{u.email}</p>
              </div>

              <button onClick={() => deleteUser(u._id)}
                className="text-red-600 hover:text-red-800">
                Supprimer
              </button>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
