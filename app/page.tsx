"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-100 to-blue-200 px-4">

      {/* ==== IMAGE LARGE MODERNE ==== */}
      <div className="mb-10">
        <Image
          src="/welcome.png"     // 👉 Mets ton image ici
          alt="Welcome illustration"
          width={420}
          height={420}
          className="drop-shadow-2xl"
        />
      </div>

      {/* ==== TITRE ==== */}
      <h1 className="text-5xl font-extrabold text-blue-700 mb-3 tracking-tight text-center">
        Welcome
      </h1>

      {/* ==== SOUS-TEXTE ==== */}
      <p className="text-gray-700 text-lg max-w-xl text-center mb-10 leading-relaxed">
        Bienvenue dans votre espace médical digital.  
        Accédez à vos services rapidement et en toute sécurité.
      </p>

      {/* ==== BOUTON CONTINUE LARGE ==== */}
      <button
        onClick={() => router.push("/auth/login")}
        className="
          px-20 py-4
          bg-blue-600 text-white
          rounded-full
          font-semibold text-lg
          shadow-xl
          hover:bg-blue-700 hover:scale-105
          transition-all duration-200
        "
      >
        Continue
      </button>
    </div>
  );
}
