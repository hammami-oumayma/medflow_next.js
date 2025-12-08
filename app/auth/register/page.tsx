"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [role,setRole]=useState("PATIENT");
  const router = useRouter();

  async function submit(e:any){
    e.preventDefault();
    const res = await fetch("/api/auth?action=register", {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({ name,email,password,role })
    });
    const data = await res.json();
    if (!res.ok) return alert(data.error);

    router.push(`/dashboard/${data.role.toLowerCase()}`);
  }

  return (
    <form onSubmit={submit} className="max-w-md mx-auto space-y-4 mt-10">
      <input className="w-full p-2 border" placeholder="Nom" value={name} onChange={e=>setName(e.target.value)} />
      <input className="w-full p-2 border" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input className="w-full p-2 border" placeholder="Mot de passe" type="password" value={password} onChange={e=>setPassword(e.target.value)} />

      <select className="w-full p-2 border" value={role} onChange={e=>setRole(e.target.value)}>
        <option value="ADMIN">Admin</option>
        <option value="DOCTOR">Doctor</option>
        <option value="RECEPTION">Réception</option>
        <option value="PATIENT">Patient</option>
      </select>

      <button className="p-2 bg-green-600 text-white w-full">Register</button>
    </form>
  );
}
