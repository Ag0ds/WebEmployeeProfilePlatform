"use client";
import Guard from "../../components/Guard";
import api from "../../lib/api";
import { useQuery } from "@tanstack/react-query";

export default function AreasPage() {
  const q = useQuery({
    queryKey: ["areas"],
    queryFn: async () => (await api.get("/areas")).data as Array<{ id: string; name: string }>,
  });

  return (
    <Guard>
      <main className="max-w-3xl mx-auto p-6">
        <h1 className="text-xl mb-4">Áreas</h1>
        {q.isLoading && <p>Carregando...</p>}
        {q.error && <p>Erro</p>}
        <ul className="list-disc pl-6">
          {q.data?.map((a) => <li key={a.id}>{a.name}</li>)}
        </ul>
      </main>
    </Guard>
  );
}
