"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import BootSequence from "@/components/boot-sequence"
import GrubMenu from "@/components/grub-menu"
import LoginScreen from "@/components/login-screen"
import Desktop from "@/components/desktop"

export default function SimulationPage() {
  const router = useRouter()
  const [stage, setStage] = useState("boot") // boot, grub, booting, login, desktop
  const [selectedKernel, setSelectedKernel] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Initial boot sequence
    const timer = setTimeout(() => {
      setStage("grub")
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const handleKernelSelect = (kernel) => {
    setSelectedKernel(kernel)
    setStage("booting")

    // Simulate kernel boot
    setTimeout(() => {
      setStage("login")
    }, 4000)
  }

  const handleLogin = (username, password) => {
    // Simple authentication (in a real app, this would be more secure)
    if (password === "password") {
      setUser({ username })
      setStage("desktop")
    }
  }

  const handleLogout = () => {
    setUser(null)
    setStage("login")
  }

  const handleRestart = () => {
    setStage("boot")
    setTimeout(() => {
      setStage("grub")
    }, 3000)
  }

  const handleShutdown = () => {
    setStage("boot")
    setTimeout(() => {
      router.push("/")
    }, 2000)
  }

  return (
    <main className="flex min-h-screen flex-col bg-black text-white">
      {stage === "boot" && <BootSequence />}
      {stage === "grub" && <GrubMenu onSelect={handleKernelSelect} />}
      {stage === "booting" && <BootSequence kernel={selectedKernel} />}
      {stage === "login" && <LoginScreen onLogin={handleLogin} />}
      {stage === "desktop" && (
        <Desktop user={user} onLogout={handleLogout} onRestart={handleRestart} onShutdown={handleShutdown} />
      )}
    </main>
  )
}
