import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Medical App",
  description: "Application médicale avec Next.js et MongoDB",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="bg-gray-100 min-h-screen">
        <header className="w-full bg-white shadow-sm p-4 mb-6">
          <nav className="flex justify-between items-center max-w-5xl mx-auto">
            <h1 className="text-xl font-semibold text-indigo-600">Medical App</h1>

            <div className="flex items-center gap-4">
              <a href="/" className="text-gray-700 hover:text-indigo-600">Accueil</a>
              <a href="/auth/login" className="text-gray-700 hover:text-indigo-600">Login</a>
              <a href="/auth/register" className="text-gray-700 hover:text-indigo-600">Register</a>

              {/* 🚀 LOGOUT SIMPLE */}
              <a href="/api/logout" className="text-red-600 hover:text-red-800">
                Logout
              </a>
            </div>
          </nav>
        </header>

        <main className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow">
          {children}
        </main>
      </body>
    </html>
  );
}
