"use client"

import { useAuth } from "../stores/auth"
import Link from "next/link"

export default function Header() {
  const { user, logout } = useAuth()

  if (!user) {
    return null
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/30 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
          </Link>

          <Link
            href="/"
            className="flex items-center space-x-2 px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
          >
            <svg className="w-4 h-4 flex justify-between" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span>Início</span>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm text-white/60">Bem-vindo,</p>
            <p className="text-sm font-medium text-blue-400">{user.name}</p>
          </div>

          <button
            onClick={logout}
            className="flex items-center space-x-2 px-4 py-2 text-sm text-white/80 hover:text-white bg-white/5 hover:bg-red-500/20 border border-white/20 hover:border-red-400/50 rounded-lg transition-all duration-300 backdrop-blur-sm group"
          >
            <svg
              className="w-4 h-4 group-hover:text-red-400 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span>Sair</span>
          </button>
        </div>
      </div>
    </header>
  )
}
