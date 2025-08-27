import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import Providers from "./providers"
import Header from "../components/Header"

export const metadata: Metadata = {
  title: "Employee Platform",
  description: "Raw UI",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Providers>
          <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black overflow-x-hidden">
            <Header />
            <main className="pt-20">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  )
}
