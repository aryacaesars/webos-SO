"use client"

import { useState, useEffect } from "react"
import { ChevronUp, ChevronDown } from "lucide-react"

export default function GrubMenu({ onSelect }) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [countdown, setCountdown] = useState(5)

  const kernels = [
    { version: "6.1.0-1-amd64", name: "WeBOS Linux 6.1.0-1-amd64" },
    { version: "6.1.0-1-amd64-recovery", name: "WeBOS Linux 6.1.0-1-amd64 (recovery mode)" },
    { version: "5.15.0-3-amd64", name: "WeBOS Linux 5.15.0-3-amd64 (legacy)" },
    { version: "5.15.0-3-amd64-recovery", name: "WeBOS Linux 5.15.0-3-amd64 (legacy, recovery mode)" },
  ]

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowUp") {
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev))
        setCountdown(5) // Reset countdown on user interaction
      } else if (e.key === "ArrowDown") {
        setSelectedIndex((prev) => (prev < kernels.length - 1 ? prev + 1 : prev))
        setCountdown(5) // Reset countdown on user interaction
      } else if (e.key === "Enter") {
        onSelect(kernels[selectedIndex].version)
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    // Auto-select after countdown
    const timer = setInterval(() => {
      if (countdown > 0) {
        setCountdown((prev) => prev - 1)
      } else {
        onSelect(kernels[selectedIndex].version)
        clearInterval(timer)
      }
    }, 1000)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      clearInterval(timer)
    }
  }, [selectedIndex, countdown, onSelect, kernels])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white font-mono p-4">
      <div className="w-full max-w-2xl border border-gray-700 rounded p-4 bg-black">
        <div className="text-xl mb-4 text-center text-yellow-500">WeBOS GRUB Bootloader</div>

        <div className="mb-6">
          {kernels.map((kernel, index) => (
            <div key={index} className={`py-2 px-4 ${selectedIndex === index ? "bg-blue-900 text-white" : ""}`}>
              {kernel.name}
              {selectedIndex === index && <span className="ml-2 text-yellow-500">*</span>}
            </div>
          ))}
        </div>

        <div className="text-sm text-gray-400 mt-4">
          <p>
            Use the{" "}
            <span className="inline-flex items-center mx-1">
              <ChevronUp className="h-4 w-4" />
            </span>{" "}
            and{" "}
            <span className="inline-flex items-center mx-1">
              <ChevronDown className="h-4 w-4" />
            </span>{" "}
            keys to select which entry is highlighted.
          </p>
          <p>Press enter to boot the selected OS.</p>
          <p className="mt-2">Booting automatically in {countdown} seconds...</p>
        </div>
      </div>
    </div>
  )
}
