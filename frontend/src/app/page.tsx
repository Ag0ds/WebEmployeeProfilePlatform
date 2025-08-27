"use client";
import Guard from "./../components/Guard";
import { useAuth } from "./../stores/auth";
import Link from "next/link";

export default function HomePage() {
  const { user, logout } = useAuth();
  return (
    <Guard>
      <main className="max-w-3xl mx-auto p-6 space-y-4">
        <header className="flex items-center justify-between">
          <h1 className="text-xl">Olá, {user?.name}</h1>
          <button className="text-sm underline" onClick={logout}>Sair</button>
        </header>
        <nav className="space-x-4">
          <Link href="/areas" className="underline">Áreas</Link>
          <Link href="/collaborators" className="underline">Colaboradores</Link>
          <Link href="/projects" className="underline">Projetos</Link>
        </nav>
      </main>
    </Guard>
  );
}
