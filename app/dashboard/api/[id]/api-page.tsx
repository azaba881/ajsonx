"use client";

import ApiClient from "./client";

export default function ApiPageClient({
  id,
}: {
  id: string;
}) {
  return (
    <div className="flex-1 flex flex-col gap-4 p-4 md:gap-8 md:p-6">
      <ApiClient id={id} />
    </div>
  );
} 