"use client";
import Guard from "@/./components/Guard";
import RequireGestor from "@/./components/RequireGestor";
import api from "@/./lib/api";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

const Schema = z.object({
  name: z.string().min(2),
  deadline: z.string().optional(),
  description: z.string().optional(),
  technologies: z.string().optional(),
});
type Form = z.infer<typeof Schema>;

export default function NewProjectPage() {
  const router = useRouter();
  const [err, setErr] = useState<string | null>(null);
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<Form>({ resolver: zodResolver(Schema) });

  const onSubmit = async (f: Form) => {
    setErr(null);
    try {
      const payload: any = {
        name: f.name,
        description: f.description || null,
        technologies: f.technologies ? f.technologies.split(",").map(s=>s.trim()).filter(Boolean) : [],
      };
      if (f.deadline) payload.deadline = new Date(f.deadline).toISOString();
      const { data } = await api.post("/projects", payload);
      router.push(`/projects/${data.id}`);
    } catch (e: any) {
      setErr(e?.response?.data?.message ?? "Erro");
    }
  };

  return (
    <Guard>
      <RequireGestor>
        <main className="max-w-xl mx-auto p-6 space-y-3">
          <h1 className="text-xl">Novo projeto</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
            <input className="w-full border p-2" placeholder="nome" {...register("name")} />
            <input className="w-full border p-2" type="date" placeholder="deadline" {...register("deadline")} />
            <textarea className="w-full border p-2" placeholder="descrição" {...register("description")} />
            <input className="w-full border p-2" placeholder="technologies (csv: ex. react,node,pg)" {...register("technologies")} />
            {err && <p className="text-red-600">{err}</p>}
            <button className="bg-black text-white px-4 py-2" disabled={isSubmitting}>Salvar</button>
          </form>
        </main>
      </RequireGestor>
    </Guard>
  );
}
