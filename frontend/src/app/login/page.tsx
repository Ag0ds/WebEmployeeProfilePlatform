"use client"
import { useAuth } from "../../stores/auth"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState } from "react"

const Schema = z.object({ email: z.string().email(), password: z.string().min(6) })
type Form = z.infer<typeof Schema>

export default function LoginPage() {
  const { login } = useAuth()
  const router = useRouter()
  const [errMsg, setErr] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<Form>({ resolver: zodResolver(Schema) })

  const onSubmit = async (data: Form) => {
    setErr(null)
    try {
      await login(data.email, data.password)
      router.replace("/")
    } catch (e: any) {
      setErr(e?.response?.data?.message ?? "Erro ao entrar")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center p-4">
      <main className="w-full max-w-md">
        <div className="backdrop-blur-xl bg-black/20 border border-white/10 rounded-2xl p-8 shadow-2xl">
          <h1 className="text-3xl font-bold text-white mb-8 text-center">
            <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Entrar</span>
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <input
                className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                placeholder="Email"
                {...register("email")}
              />
              <input
                className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                type="password"
                placeholder="Senha"
                {...register("password")}
              />
            </div>

            {errMsg && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-red-400 text-sm">{errMsg}</p>
              </div>
            )}

            <button
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold py-4 px-6 rounded-xl backdrop-blur-sm border border-blue-500/20 shadow-lg hover:shadow-blue-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <div className="mt-6 p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
            <p className="text-sm text-gray-300 text-center">Credenciais de demonstração:</p>
            <p className="text-sm text-center mt-2">
              <span className="text-blue-400 font-mono">gestor@empresa.com</span>
              {" / "}
              <span className="text-blue-400 font-mono">admin123</span>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
