"use client"
import Guard from "../../../components/Guard"
import RequireGestor from "../../../components/RequireGestor"
import api from "../../../lib/api"
import { useQuery } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState } from "react"

const AreaNames = ["FRONTEND", "BACKEND", "INFRA", "DESIGN", "REQUISITOS", "GESTAO"] as const
const Schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  age: z.coerce.number().int().positive().optional(),
  regime: z.string().optional(),
  areaNames: z.array(z.enum(AreaNames)).optional(),
})
type Form = z.infer<typeof Schema>

export default function NewCollaboratorPage() {
  const router = useRouter()
  const [err, setErr] = useState<string | null>(null)
  const { data: areas } = useQuery({
    queryKey: ["areas"],
    queryFn: async () => (await api.get("/areas")).data as Array<{ id: string; name: string }>,
  })

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({ resolver: zodResolver(Schema) })

  const onSubmit = async (f: Form) => {
    setErr(null)
    try {
      await api.post("/collaborators", f)
      router.push("/collaborators")
    } catch (e: any) {
      setErr(e?.response?.data?.message ?? "Erro")
    }
  }

  const names = areas?.map((a) => a.name) ?? AreaNames

  return (
    <Guard>
      <RequireGestor>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
          <main className="max-w-xl mx-auto p-6 space-y-6">
            <h1 className="text-2xl font-bold text-white">Novo colaborador</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <input
                className="w-full bg-gray-800/50 backdrop-blur-sm border border-gray-600/30 text-white placeholder-gray-400 p-3 rounded-lg focus:border-blue-500/50 focus:outline-none transition-all duration-300"
                placeholder="Nome"
                {...register("name")}
              />
              <input
                className="w-full bg-gray-800/50 backdrop-blur-sm border border-gray-600/30 text-white placeholder-gray-400 p-3 rounded-lg focus:border-blue-500/50 focus:outline-none transition-all duration-300"
                placeholder="Email"
                {...register("email")}
              />
              <input
                className="w-full bg-gray-800/50 backdrop-blur-sm border border-gray-600/30 text-white placeholder-gray-400 p-3 rounded-lg focus:border-blue-500/50 focus:outline-none transition-all duration-300"
                type="password"
                placeholder="Senha"
                {...register("password")}
              />
              <input
                className="w-full bg-gray-800/50 backdrop-blur-sm border border-gray-600/30 text-white placeholder-gray-400 p-3 rounded-lg focus:border-blue-500/50 focus:outline-none transition-all duration-300"
                placeholder="Idade (opcional)"
                {...register("age")}
              />
              <input
                className="w-full bg-gray-800/50 backdrop-blur-sm border border-gray-600/30 text-white placeholder-gray-400 p-3 rounded-lg focus:border-blue-500/50 focus:outline-none transition-all duration-300"
                placeholder="Regime (opcional)"
                {...register("regime")}
              />

              <fieldset className="bg-gray-800/30 backdrop-blur-sm border border-gray-600/30 p-4 rounded-lg">
                <legend className="text-blue-300 font-semibold px-2">Áreas</legend>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  {names.map((n) => (
                    <label
                      key={n}
                      className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        value={n}
                        {...register("areaNames")}
                        className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <span>{n}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              {err && <p className="text-red-400 bg-red-900/20 border border-red-500/30 p-3 rounded-lg">{err}</p>}

              <button
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02]"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Salvando..." : "Salvar"}
              </button>
            </form>
          </main>
        </div>
      </RequireGestor>
    </Guard>
  )
}
