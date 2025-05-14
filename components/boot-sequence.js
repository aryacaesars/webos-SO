"use client"

import { useState, useEffect } from "react"

export default function BootSequence({ kernel }) {
  const [bootMessages, setBootMessages] = useState([])

  useEffect(() => {
    const messages = [
      "Starting WeBOS...",
      "Initializing hardware detection...",
      "CPU: Intel Core i7 (virtual)",
      "Memory: 16GB (virtual)",
      "Loading system modules...",
      "Mounting virtual filesystems...",
      "Starting system services...",
      kernel ? `Booting Linux kernel ${kernel}...` : "Preparing boot sequence...",
      "Starting network services...",
      "Starting desktop environment...",
    ]

    let index = 0
    const interval = setInterval(() => {
      if (index < messages.length) {
        setBootMessages((prev) => [...prev, messages[index]])
        index++
      } else {
        clearInterval(interval)
      }
    }, 300)

    return () => clearInterval(interval)
  }, [kernel])

  return (
    <div className="flex flex-col items-start justify-start p-4 font-mono text-sm text-green-500 bg-black min-h-screen w-full">
      <div className="mb-4">
        <pre className="text-yellow-500">
          {`
 __      __      _____ ____   ___  ____  
 \\ \\    / /     | ____|  _ \\ / _ \\/ ___| 
  \\ \\/\\/ /_____| |__  | |_) | | | \\___ \\ 
   \\  /\\/_______|___ \\|  _ <| |_| |___) |
    \\/          |_____|_| \\_\\\\___/|____/ 
                                         
`}
        </pre>
      </div>

      {bootMessages.map((message, index) => (
        <div key={index} className="py-1">
          {message}
        </div>
      ))}

      {bootMessages.length === 0 && <div className="animate-pulse">Initializing boot sequence...</div>}
    </div>
  )
}
