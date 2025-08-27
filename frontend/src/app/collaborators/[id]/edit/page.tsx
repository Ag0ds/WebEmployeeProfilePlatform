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

const AreaNames = ["FRONTEND","BACKEND","INFRA","DESIGN","REQUISITOS","GESTAO"] as const;
const Schema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  age: z.number().int().positive().nullable().optional(),
  regime: z.union([z.string(), z.null()]).optional(),
  role: z.enum(["NORMAL","GESTOR"]).optional(),
  areaNames: z.array(z.enum(AreaNames)).optional(),
});
type Form = z.infer<typeof Schema>;

export default function EditCollaboratorPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [err, setErr] = useState<string | null>(null);

  const { data: collab, isLoading } = useQuery({
    queryKey: ["collaborator", id],
    queryFn: async () => (await api.get(`/collaborators/${id}`)).data as any,
  });
  const { data: areas } = useQuery({
    queryKey: ["areas"],
    queryFn: async () => (await api.get("/areas")).data as Array<{ id: string; name: string }>,
  });

  const { register, handleSubmit, setValue, formState: { isSubmitting } } = useForm<Form>({ resolver: zodResolver(Schema) });

  useEffect(() => {
    if (!collab) return;
    setValue("name", collab.name);
    setValue("email", collab.email);
    setValue("age", collab.age ?? null);
    setValue("regime", collab.regime ?? null);
    setValue("areaNames", collab.areas ?? []);
  }, [collab, setValue]);

  const onSubmit = async (f: Form) => {
    setErr(null);
    try {
      await api.put(`/collaborators/${id}`, f);
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
          <h1 className="text-xl">Editar colaborador</h1>
          {isLoading && <p>Carregando...</p>}
          {collab && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
              <input className="w-full border p-2" placeholder="nome" {...register("name")} />
              <input className="w-full border p-2" placeholder="email" {...register("email")} />
              <input className="w-full border p-2" type="password" placeholder="nova senha (opcional)" {...register("password")} />
              <input className="w-full border p-2" placeholder="idade (ou deixe em branco)" {...register("age")} />
              <input className="w-full border p-2" placeholder="regime (ou deixe em branco)" {...register("regime")} />

              <fieldset className="border p-2">
                <legend>Áreas</legend>
                <div className="grid grid-cols-2 gap-2">
                  {names.map(n => (
                    <label key={n} className="flex items-center gap-2">
                      <input type="checkbox" value={n} {...register("areaNames")} defaultChecked={collab.areas?.includes(n)} />
                      <span>{n}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              {err && <p className="text-red-600">{err}</p>}
              <button className="bg-black text-white px-4 py-2" disabled={isSubmitting}>Salvar</button>
            </form>
          )}
        </main>
      </RequireGestor>
    </Guard>
  );
}
