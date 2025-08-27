"use client";
import Guard from "../../components/Guard";
import api from "../../lib/api";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../stores/auth";
import { useState } from "react";
import Link from "next/link";
import RequireGestor from "@/./components/RequireGestor";

type Item = {
  id: string; name: string; email: string; age?: number|null;
  role: "NORMAL"|"GESTOR"; areas: string[]; regime?: string|null;
};

export default function CollaboratorsPage() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [perPage] = useState(5);
  const [q, setQ] = useState("");

  const qkey = ["collaborators", page, perPage, q];
  const query = useQuery({
    queryKey: qkey,
    queryFn: async () => {
      const { data } = await api.get("/collaborators", { params: { page, perPage, q: q || undefined } });
      return data as { items: Item[]; page: number; perPage: number; total: number; totalPages: number };
    },
  });

  return (
    <Guard>
      <main className="max-w-4xl mx-auto p-6 space-y-4">
        <div className="flex items-center justify-between">
            <h1 className="text-xl">Colaboradores</h1>
            <RequireGestor>
                <Link href="/collaborators/new" className="border px-3 py-1">Novo</Link>
            </RequireGestor>
        </div>

        <div className="flex gap-2">
          <input className="border p-2 flex-1" placeholder="buscar por nome/email" value={q} onChange={(e)=>setQ(e.target.value)} />
          <button className="border px-3" onClick={()=>query.refetch()}>Buscar</button>
        </div>

        {query.isLoading && <p>Carregando...</p>}
        {query.error && <p>Erro</p>}

        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Nome</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Role</th>
              <th className="p-2 text-left">Áreas</th>
              {user?.role === "GESTOR" && <th className="p-2 text-left">Regime</th>}
              {user?.role === "GESTOR" && <th className="p-2 text-left">Ações</th>}
            </tr>
          </thead>
          <tbody>
            {query.data?.items?.map(c => (
              <tr key={c.id} className="border-t">
                <td className="p-2">{c.name}</td>
                <td className="p-2">{c.email}</td>
                <td className="p-2">{c.role}</td>
                <td className="p-2">{c.areas.join(", ")}</td>
                {user?.role === "GESTOR" && <td className="p-2">{c.regime ?? "-"}</td>}
                {user?.role === "GESTOR" && (
                    <td className="p-2 space-x-2">
                        <Link className="underline" href={`/collaborators/${c.id}/edit`}>Editar</Link>
                        <button
                        className="text-red-600 underline"
                        onClick={async () => {
                            if (!confirm("Excluir colaborador?")) return;
                            try {
                              await api.delete(`/collaborators/${c.id}`);
                              query.refetch();
                            } catch (e: any) {
                              alert(e?.response?.data?.message ?? "Erro ao excluir");
                            }
                        }}
                        >
                        Excluir
                        </button>
                    </td>
                    )}
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex items-center gap-2">
          <button className="border px-2" disabled={page<=1} onClick={()=>setPage(p=>p-1)}>←</button>
          <span>página {query.data?.page} / {query.data?.totalPages ?? "?"}</span>
          <button className="border px-2" disabled={page>=(query.data?.totalPages ?? 1)} onClick={()=>setPage(p=>p+1)}>→</button>
        </div>
      </main>
    </Guard>
  );
}
