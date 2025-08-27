"use client";
import Guard from "@/./components/Guard";
import RequireGestor from "@/./components/RequireGestor";
import api from "@/./lib/api";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";

const AreaNames = ["FRONTEND","BACKEND","INFRA","DESIGN","REQUISITOS","GESTAO"] as const;
const Schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  age: z.coerce.number().int().positive().optional(),
  regime: z.string().optional(),
  areaNames: z.array(z.enum(AreaNames)).optional(),
});
type Form = z.infer<typeof Schema>;

export default function NewCollaboratorPage() {
  const router = useRouter();
  const [err, setErr] = useState<string | null>(null);
  const { data: areas } = useQuery({
    queryKey: ["areas"],
    queryFn: async () => (await api.get("/areas")).data as Array<{ id: string; name: string }>,
  });

  const { register, handleSubmit, formState: { isSubmitting } } = useForm({ resolver: zodResolver(Schema) });

  const onSubmit = async (f: Form) => {
    setErr(null);
    try {
      await api.post("/collaborators", f);
      router.push("/collaborators");
    } catch (e: any) {
      setErr(e?.response?.data?.message ?? "Erro");
    }
  };

  const names = areas?.map(a => a.name) ?? AreaNames;

  return (
    <Guard>
      <RequireGestor>
        <main className="max-w-xl mx-auto p-6 space-y-3">
          <h1 className="text-xl">Novo colaborador</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
            <input className="w-full border p-2" placeholder="nome" {...register("name")} />
            <input className="w-full border p-2" placeholder="email" {...register("email")} />
            <input className="w-full border p-2" type="password" placeholder="senha" {...register("password")} />
            <input className="w-full border p-2" placeholder="idade (opcional)" {...register("age")} />
            <input className="w-full border p-2" placeholder="regime (opcional)" {...register("regime")} />

            <fieldset className="border p-2">
              <legend>Áreas</legend>
              <div className="grid grid-cols-2 gap-2">
                {names.map(n => (
                  <label key={n} className="flex items-center gap-2">
                    <input type="checkbox" value={n} {...register("areaNames")} />
                    <span>{n}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            {err && <p className="text-red-600">{err}</p>}
            <button className="bg-black text-white px-4 py-2" disabled={isSubmitting}>Salvar</button>
          </form>
        </main>
      </RequireGestor>
    </Guard>
  );
}
