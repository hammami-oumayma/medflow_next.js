"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, CalendarDays, Home, UserCircle, LogOut } from "lucide-react";

export default function ReceptionLayout({ children }: any) {
  const pathname = usePathname();

  const menu = [
    {
      label: "Dashboard",
      href: "/dashboard/reception",
      icon: <Home size={20} />,
    },
    {
      label: "Patients",
      href: "/dashboard/reception/patients",
      icon: <Users size={20} />,
    },
    {
      label: "Rendez-vous",
      href: "/dashboard/reception/appointments",
      icon: <CalendarDays size={20} />,
    },
       {
          label: "Profil",
          href: "/dashboard/patient/profil",
          icon: <UserCircle size={20} />,
        },
          {
      label: "Logout",
      href: "/api/logout",
      icon: <LogOut size={20} />,
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* ===== SIDEBAR ===== */}
      <aside className="w-64 bg-blue-700 text-white p-6 space-y-8 shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Medflow App</h2>

        <nav className="space-y-3">
          {menu.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
                  active
                    ? "bg-white text-blue-700 font-semibold shadow"
                    : "hover:bg-blue-600"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-1 w-full p-6 md:p-10">{children}</main>
    </div>
  );
}
