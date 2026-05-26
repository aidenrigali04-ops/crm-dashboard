"use client";

import { useRouter } from "next/navigation";

interface Props {
  leadId: string;
  children: React.ReactNode;
}

export function LeadRow({ leadId, children }: Props) {
  const router = useRouter();

  return (
    <tr
      className="hover:bg-zinc-800/30 transition-colors cursor-pointer group"
      onClick={() => router.push(`/leads/${leadId}`)}
    >
      {children}
    </tr>
  );
}
