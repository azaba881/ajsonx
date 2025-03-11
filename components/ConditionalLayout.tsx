"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard"); // Vérifie si on est dans /dashboard

  return (
    <>
      {!isDashboard && <Navbar />}
      <main className="relative overflow-hidden">{children}</main>
      {!isDashboard && <Footer />}
    </>
  );
}
