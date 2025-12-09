"use client";

import { useState, useEffect } from "react";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [searchUser, setSearchUser] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    const res = await fetch("/api/users");
    const data = await res.json();
    setUsers(data);
  }

  async function deleteUser(id: string) {
    await fetch("/api/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    loadUsers();
  }

  const filteredUsers = users.filter((u: any) =>
    u.name.toLowerCase().includes(searchUser.toLowerCase())
  );

  return (
    <div className="space-y-12">

      <h1 className="text-3xl font-bold text-gray-800">
        👥 Gestion des utilisateurs
      </h1>

      {/* -------- CARD -------- */}
      <section className="bg-white p-8 rounded-2xl shadow space-y-6">

        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-800">📋 Liste des utilisateurs</h2>

          <input
            className="border border-gray-300 rounded-xl px-4 py-2 w-64 focus:ring-2 focus:ring-blue-500 outline-none transition"
            placeholder="🔍 Rechercher…"
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
          />
        </div>

        {/* -------- TABLE -------- */}
        <div className="overflow-hidden rounded-xl border border-gray-200">
          <table className="w-full text-left">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-4">Nom</th>
                <th className="p-4">Email</th>
                <th className="p-4">Rôle</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((u: any, index: number) => (
                <tr
                  key={u._id}
                  className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} border-t`}
                >
                  <td className="p-4 font-medium">{u.name}</td>
                  <td className="p-4">{u.email}</td>
                  <td className="p-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => deleteUser(u._id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition"
                    >
                      🗑️ Supprimer
                    </button>
                  </td>
                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center p-6 text-gray-500">
                    Aucun utilisateur trouvé...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </section>
    </div>
  );
}
