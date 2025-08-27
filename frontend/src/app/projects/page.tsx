"use client";
import Guard from "../../components/Guard";
import api from "../../lib/api";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import RequireGestor from "@/./components/RequireGestor";

type Row = {
  id: string; name: string; deadline?: string|null; description?: string|null;
  technologies: string[]; members: Array<{ id: string; name: string; role: "NORMAL"|"GESTOR"; areas: string[] }>;
};

export default function ProjectsPage() {
  const [page, setPage] = useState(1);
  const [perPage] = useState(5);
  const [q, setQ] = useState("");

  const query = useQuery({
    queryKey: ["projects", page, perPage, q],
    queryFn: async () => {
      const { data } = await api.get("/projects", { params: { page, perPage, q: q || undefined } });
      return data as { items: Row[]; page: number; perPage: number; total: number; totalPages: number };
    },
  });

  return (
    <Guard>
      <main className="max-w-4xl mx-auto p-6 space-y-4">
        <div className="flex items-center justify-between">
            <h1 className="text-xl">Projetos</h1>
            <RequireGestor>
                <Link href="/projects/new" className="border px-3 py-1">Novo</Link>
            </RequireGestor>
        </div>

        <div className="flex gap-2">
          <input className="border p-2 flex-1" placeholder="buscar por nome" value={q} onChange={(e)=>setQ(e.target.value)} />
          <button className="border px-3" onClick={()=>query.refetch()}>Buscar</button>
        </div>

        {query.isLoading && <p>Carregando...</p>}
        {query.error && <p>Erro</p>}

        <ul className="space-y-2">
          {query.data?.items?.map(p => (
            <li key={p.id} className="border p-3">
              <div className="font-medium">{p.name}</div>
              <div className="text-sm text-gray-600">Tecnologias: {p.technologies.join(", ")}</div>
              <div className="text-sm text-gray-600">Membros: {p.members.length}</div>
              <Link className="text-blue-600 underline" href={`/projects/${p.id}`}>ver</Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button className="border px-2" disabled={page<=1} onClick={()=>setPage(p=>p-1)}>←</button>
          <span>página {query.data?.page} / {query.data?.totalPages ?? "?"}</span>
          <button className="border px-2" disabled={page>=(query.data?.totalPages ?? 1)} onClick={()=>setPage(p=>p+1)}>→</button>
        </div>
      </main>
    </Guard>
  );
}
