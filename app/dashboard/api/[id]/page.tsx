import { Metadata } from "next";
import ApiPageClient from "./api-page";

export const metadata: Metadata = {
  title: "Détails de l'API",
  description: "Gérez et configurez votre API",
};

// Cette fonction est nécessaire pour les routes dynamiques dans Next.js 13+
export async function generateStaticParams() {
  return [];
}

interface PageContext {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageContext) {
  const resolvedParams = await params;
  return <ApiPageClient id={resolvedParams.id} />;
}