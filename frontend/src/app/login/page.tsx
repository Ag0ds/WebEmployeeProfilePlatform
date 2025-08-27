"use client";
// Update the import path below if your 'auth' store is located elsewhere
import { useAuth } from "../../stores/auth";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Schema = z.object({ email: z.string().email(), password: z.string().min(6) });
type Form = z.infer<typeof Schema>;

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [errMsg, setErr] = useState<string | null>(null);
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<Form>({ resolver: zodResolver(Schema) });

  const onSubmit = async (data: Form) => {
    setErr(null);
    try {
      await login(data.email, data.password);
      router.replace("/"); // dashboard
    } catch (e: any) {
      setErr(e?.response?.data?.message ?? "Erro ao entrar");
    }
  };

  return (
    <main className="max-w-sm mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">Entrar</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <input className="w-full border p-2" placeholder="email" {...register("email")} />
        <input className="w-full border p-2" type="password" placeholder="senha" {...register("password")} />
        {errMsg && <p className="text-red-600">{errMsg}</p>}
        <button className="w-full bg-black text-white p-2" disabled={isSubmitting}>Entrar</button>
      </form>
      <div className="mt-4 text-sm text-gray-600">
        (Use <b>gestor@empresa.com</b> / <b>admin123</b> do seed)
      </div>
    </main>
  );
}
