"use client";

import { useState, useEffect } from "react";

export default function BootSequence({ kernel }) {
  const [bootMessages, setBootMessages] = useState([]);

  useEffect(() => {
    const messages = [
      "Starting WeBOS...",
      "Initializing hardware detection...",
      "Detecting CPU: Intel Core i7 (virtual)...",
      "Detecting Memory: 16GB (virtual)...",
      "Detecting Storage: 512GB SSD (virtual)...",
      "Initializing BIOS...",
      "Checking hardware integrity...",
      "Loading bootloader...",
      "Bootloader: GRUB 2.06 detected...",
      "Loading Linux kernel...",
      kernel
        ? `Booting Linux kernel ${kernel}...`
        : "Preparing boot sequence...",
      "Initializing RAM disk...",
      "Mounting root filesystem...",
      "Checking filesystem integrity...",
      "Starting system modules...",
      "Loading device drivers...",
      "Initializing network interfaces...",
      "Starting system services...",
      "Launching system logger...",
      "Starting network services...",
      "Configuring hostname and DNS...",
      "Initializing graphical interface...",
      "Starting desktop environment...",
      "Finalizing boot process...",
      "WeBOS is ready to use. Welcome!",
    ];

    let index = 0;
    const interval = setInterval(() => {
      if (index < messages.length) {
        setBootMessages((prev) => [...prev, messages[index]]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 300);

    return () => clearInterval(interval);
  }, [kernel]);

  return (
    <div className="flex flex-col items-start justify-start p-4 font-mono text-sm text-green-500 bg-black min-h-screen w-full">
      <div className="mb-4">
        <pre className="text-yellow-500">
          {`
██╗    ██╗███████╗██████╗  ██████╗ ███████╗
██║    ██║██╔════╝██╔══██╗██╔═══██╗██╔════╝
██║ █╗ ██║█████╗  ██████╔╝██║   ██║███████╗
██║███╗██║██╔══╝  ██╔══██╗██║   ██║╚════██║
╚███╔███╔╝███████╗██████╔╝╚██████╔╝███████║
 ╚══╝╚══╝ ╚══════╝╚═════╝  ╚═════╝ ╚══════╝

`}
        </pre>
      </div>

      {bootMessages.map((message, index) => (
        <div key={index} className="py-1">
          {message}
        </div>
      ))}

      {bootMessages.length === 0 && (
        <div className="animate-pulse">Initializing boot sequence...</div>
      )}
    </div>
  );
}
