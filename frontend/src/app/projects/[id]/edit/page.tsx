"use client";
import Guard from "@/./components/Guard";
import RequireGestor from "@/./components/RequireGestor";
import api from "@/./lib/api";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";

const Schema = z.object({
  name: z.string().min(2).optional(),
  deadline: z.string().optional(),
  description: z.string().optional(),
  technologies: z.string().optional(),
});
type Form = z.infer<typeof Schema>;

export default function EditProjectPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [err, setErr] = useState<string | null>(null);

  const { data: p, isLoading } = useQuery({
    queryKey: ["project", id],
    queryFn: async () => (await api.get(`/projects/${id}`)).data as any,
  });

  const { register, handleSubmit, setValue, formState: { isSubmitting } } = useForm<Form>({ resolver: zodResolver(Schema) });

  useEffect(() => {
    if (!p) return;
    setValue("name", p.name);
    if (p.deadline) setValue("deadline", String(p.deadline).slice(0,10));
    setValue("description", p.description ?? "");
    setValue("technologies", (p.technologies ?? []).join(", "));
  }, [p, setValue]);

  const onSubmit = async (f: Form) => {
    setErr(null);
    try {
      const payload: any = {};
      if (f.name) payload.name = f.name;
      if (f.deadline) payload.deadline = new Date(f.deadline).toISOString();
      if (f.description !== undefined) payload.description = f.description || null;
      if (f.technologies !== undefined) payload.technologies = f.technologies ? f.technologies.split(",").map(s=>s.trim()).filter(Boolean) : [];
      await api.put(`/projects/${id}`, payload);
      router.push(`/projects/${id}`);
    } catch (e: any) {
      setErr(e?.response?.data?.message ?? "Erro");
    }
  };

  return (
    <Guard>
      <RequireGestor>
        <main className="max-w-xl mx-auto p-6 space-y-3">
          <h1 className="text-xl">Editar projeto</h1>
          {isLoading && <p>Carregando...</p>}
          {p && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
              <input className="w-full border p-2" placeholder="nome" {...register("name")} />
              <input className="w-full border p-2" type="date" {...register("deadline")} />
              <textarea className="w-full border p-2" placeholder="descrição" {...register("description")} />
              <input className="w-full border p-2" placeholder="technologies (csv)" {...register("technologies")} />
              {err && <p className="text-red-600">{err}</p>}
              <button className="bg-black text-white px-4 py-2" disabled={isSubmitting}>Salvar</button>
            </form>
          )}
        </main>
      </RequireGestor>
    </Guard>
  );
}
