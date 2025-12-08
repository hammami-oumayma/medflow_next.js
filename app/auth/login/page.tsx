"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const router = useRouter();

  async function submit(e:any){
    e.preventDefault();
    const res = await fetch("/api/auth?action=login", {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({ email,password })
    });
    const data = await res.json();
    if (!res.ok) return alert(data.error);

    router.push(`/dashboard/${data.role.toLowerCase()}`);
  }

  return (
    <form onSubmit={submit} className="max-w-md mx-auto space-y-4 mt-10">
      <input className="w-full p-2 border" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input className="w-full p-2 border" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button className="p-2 bg-blue-600 text-white w-full">Login</button>
    </form>
  );
}
