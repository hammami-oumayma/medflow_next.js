"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import {
  CalendarDays,
  FileText,
  ClipboardList,
  LayoutDashboard,
  UserCircle,
  LogOut,
} from "lucide-react";

export default function DoctorLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard/doctor", icon: <LayoutDashboard size={20} /> },
    { name: "Rendez-vous", path: "/dashboard/doctor/appointments", icon: <CalendarDays size={20} /> },
    { name: "Agenda", path: "/dashboard/doctor/agenda", icon: <ClipboardList size={20} /> },
    { name: "Ordonnances", path: "/dashboard/doctor/prescriptions", icon: <FileText size={20} /> },
    { name: "Profil", path: "/dashboard/doctor/profil", icon: <UserCircle size={20} /> },

    // 🔥 Logout ajouté
    { name: "Logout", path: "/api/logout", icon: <LogOut size={20} /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-blue-700 text-white p-6 space-y-8">
        <h2 className="text-2xl font-bold mb-6">Medflow App</h2>

        <nav className="space-y-3">
          {menuItems.map((item) => {
            const active = pathname === item.path;

            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                  active ? "bg-white text-blue-700 font-semibold shadow" : "hover:bg-blue-600"
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      <main className="flex-1 w-full p-6 md:p-10">{children}</main>
    </div>
  );
}
