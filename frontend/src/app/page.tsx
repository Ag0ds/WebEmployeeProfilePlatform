"use client"

import Guard from "../components/Guard"
import { useAuth } from "../stores/auth"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function HomePage() {
  const { user, logout } = useAuth()
  const [currentSection, setCurrentSection] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll(".nav-section")
      const scrollPosition = window.scrollY + window.innerHeight / 2

      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect()
        const sectionTop = window.scrollY + rect.top
        const sectionBottom = sectionTop + rect.height

        if (scrollPosition >= sectionTop && scrollPosition <= sectionBottom) {
          setCurrentSection(index)
        }
      })
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (index: number) => {
    const section = document.querySelector(`.nav-section:nth-child(${index + 1})`)
    section?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <Guard>
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black overflow-x-hidden">
        <header className="fixed top-0 left-0 right-0 z-50 p-6 flex items-center justify-between backdrop-blur-md bg-black/20 border-b border-white/10">
          <h1 className="text-xl font-semibold text-white">
            Olá, <span className="text-blue-400">{user?.name}</span>
          </h1>
          <button
            className="px-4 py-2 text-sm text-white/80 hover:text-white transition-colors duration-300 border border-white/20 rounded-lg hover:border-blue-400/50 backdrop-blur-sm bg-white/5"
            onClick={logout}
          >
            Sair
          </button>
        </header>

        <section className="nav-section min-h-screen flex items-center justify-center relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-transparent"></div>
          <Link
            href="/areas"
            className="group relative z-10 w-full max-w-2xl mx-6 h-96 flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur-xl border border-blue-400/20 rounded-3xl transform rotate-3 group-hover:rotate-6 transition-all duration-500 group-hover:scale-105"></div>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl transform -rotate-1 group-hover:-rotate-3 transition-all duration-500"></div>
            <div className="relative z-10 text-center p-8">
              <div className="w-16 h-16 mx-auto mb-6 bg-blue-500/20 rounded-full flex items-center justify-center border border-blue-400/30">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h2 className="text-4xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors duration-300">
                Áreas
              </h2>
              <p className="text-white/70 text-lg">Gerencie e organize as áreas do seu projeto</p>
            </div>
          </Link>
        </section>

        <section className="nav-section min-h-screen flex items-center justify-center relative">
          <div className="absolute inset-0 bg-gradient-to-bl from-purple-900/20 to-transparent"></div>
          <Link
            href="/collaborators"
            className="group relative z-10 w-full max-w-2xl mx-6 h-96 flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-gradient-to-bl from-purple-500/10 to-blue-600/5 backdrop-blur-xl border border-purple-400/20 rounded-3xl transform -rotate-2 group-hover:-rotate-4 transition-all duration-500 group-hover:scale-105"></div>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl transform rotate-2 group-hover:rotate-4 transition-all duration-500"></div>
            <div className="relative z-10 text-center p-8">
              <div className="w-16 h-16 mx-auto mb-6 bg-purple-500/20 rounded-full flex items-center justify-center border border-purple-400/30">
                <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
              </div>
              <h2 className="text-4xl font-bold text-white mb-4 group-hover:text-purple-300 transition-colors duration-300">
                Colaboradores
              </h2>
              <p className="text-white/70 text-lg">Administre sua equipe e colaboradores</p>
            </div>
          </Link>
        </section>

        <section className="nav-section min-h-screen flex items-center justify-center relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-green-900/20 to-transparent"></div>
          <Link
            href="/projects"
            className="group relative z-10 w-full max-w-2xl mx-6 h-96 flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-green-500/10 to-blue-600/5 backdrop-blur-xl border border-green-400/20 rounded-3xl transform rotate-1 group-hover:rotate-2 transition-all duration-500 group-hover:scale-105"></div>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl transform -rotate-3 group-hover:-rotate-5 transition-all duration-500"></div>
            <div className="relative z-10 text-center p-8">
              <div className="w-16 h-16 mx-auto mb-6 bg-green-500/20 rounded-full flex items-center justify-center border border-green-400/30">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  />
                </svg>
              </div>
              <h2 className="text-4xl font-bold text-white mb-4 group-hover:text-green-300 transition-colors duration-300">
                Projetos
              </h2>
              <p className="text-white/70 text-lg">Controle e monitore todos os seus projetos</p>
            </div>
          </Link>
        </section>

        <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-50 space-y-3">
          {[0, 1, 2].map((index) => (
            <button
              key={index}
              onClick={() => scrollToSection(index)}
              className={`w-3 h-3 rounded-full border transition-all duration-300 ${
                currentSection === index
                  ? "bg-blue-400 border-blue-400 scale-125"
                  : "bg-transparent border-white/30 hover:border-white/60"
              }`}
            />
          ))}
        </div>
      </div>
    </Guard>
  )
}
