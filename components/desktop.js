"use client"

import { useState, useEffect, useRef } from "react"
import {
  TerminalIcon,
  Folder,
  Settings,
  Power,
  LogOut,
  RefreshCw,
  X,
  Maximize2,
  Minimize2,
  Clock,
  Wifi,
  Volume2,
  Calendar,
  Search,
} from "lucide-react"
import Terminal from "./terminal"
import FileExplorer from "./file-explorer"
import { useFileSystem } from "@/lib/use-file-system"

export default function Desktop({ user, onLogout, onRestart, onShutdown }) {
  const [time, setTime] = useState(new Date())
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false)
  const [openApps, setOpenApps] = useState([])
  const [activeAppId, setActiveAppId] = useState(null)
  const [isSystemMenuOpen, setIsSystemMenuOpen] = useState(false)
  const startMenuRef = useRef(null)
  const systemMenuRef = useRef(null)
  const { fileSystem } = useFileSystem()

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    const handleClickOutside = (event) => {
      if (startMenuRef.current && !startMenuRef.current.contains(event.target)) {
        setIsStartMenuOpen(false)
      }
      if (systemMenuRef.current && !systemMenuRef.current.contains(event.target)) {
        setIsSystemMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      clearInterval(timer)
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const openApp = (app) => {
    // Check if app is already open
    const existingApp = openApps.find((a) => a.type === app.type)
    if (existingApp) {
      setActiveAppId(existingApp.id)
    } else {
      const newApp = { ...app, id: Date.now() }
      setOpenApps([...openApps, newApp])
      setActiveAppId(newApp.id)
    }
    setIsStartMenuOpen(false)
  }

  const closeApp = (id) => {
    setOpenApps(openApps.filter((app) => app.id !== id))
    if (activeAppId === id) {
      const remainingApps = openApps.filter((app) => app.id !== id)
      setActiveAppId(remainingApps.length > 0 ? remainingApps[remainingApps.length - 1].id : null)
    }
  }

  const bringToFront = (id) => {
    setActiveAppId(id)
  }

  const apps = [
    {
      type: "terminal",
      title: "Terminal",
      icon: <TerminalIcon className="h-5 w-5" />,
      content: <Terminal />,
    },
    {
      type: "fileExplorer",
      title: "File Explorer",
      icon: <Folder className="h-5 w-5" />,
      content: <FileExplorer fileSystem={fileSystem} />,
    },
    {
      type: "settings",
      title: "Settings",
      icon: <Settings className="h-5 w-5" />,
      content: (
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">System Settings</h2>
          <p>This is a placeholder for system settings.</p>
        </div>
      ),
    },
  ]

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-900 to-purple-900 overflow-hidden">
      {/* Desktop */}
      <div className="flex-1 relative">
        {/* Desktop Icons */}
        <div className="absolute top-4 left-4 flex flex-col space-y-6">
          {apps.map((app, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center w-20 h-20 rounded hover:bg-white/10 cursor-pointer"
              onClick={() => openApp(app)}
            >
              <div className="w-10 h-10 flex items-center justify-center bg-blue-700 rounded-lg mb-1">{app.icon}</div>
              <span className="text-xs text-center text-white">{app.title}</span>
            </div>
          ))}
        </div>

        {/* Open Applications */}
        {openApps.map((app) => (
          <div
            key={app.id}
            className={`absolute rounded-lg overflow-hidden shadow-lg border border-gray-700 bg-gray-900 text-white
                      ${activeAppId === app.id ? "z-10" : "z-0"}`}
            style={{
              width: "80%",
              height: "70%",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
            onClick={() => bringToFront(app.id)}
          >
            {/* Window Title Bar */}
            <div className="flex items-center justify-between bg-gray-800 px-4 py-2">
              <div className="flex items-center">
                {app.icon}
                <span className="ml-2 text-sm">{app.title}</span>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-1 hover:bg-gray-700 rounded">
                  <Minimize2 className="h-4 w-4" />
                </button>
                <button className="p-1 hover:bg-gray-700 rounded">
                  <Maximize2 className="h-4 w-4" />
                </button>
                <button
                  className="p-1 hover:bg-red-700 rounded"
                  onClick={(e) => {
                    e.stopPropagation()
                    closeApp(app.id)
                  }}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Window Content */}
            <div className="h-[calc(100%-2.5rem)] overflow-auto">{app.content}</div>
          </div>
        ))}
      </div>

      {/* Taskbar */}
      <div className="h-12 bg-gray-900 border-t border-gray-800 flex items-center px-4">
        {/* Start Button */}
        <div className="relative" ref={startMenuRef}>
          <button
            className={`flex items-center justify-center h-8 w-8 rounded-full ${isStartMenuOpen ? "bg-blue-600" : "hover:bg-gray-700"}`}
            onClick={() => setIsStartMenuOpen(!isStartMenuOpen)}
          >
            <span className="text-white font-bold">W</span>
          </button>

          {/* Start Menu */}
          {isStartMenuOpen && (
            <div className="absolute bottom-12 left-0 w-64 bg-gray-900 border border-gray-700 rounded-lg shadow-xl overflow-hidden">
              {/* User Info */}
              <div className="p-4 bg-gray-800 flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                  {user?.username.charAt(0).toUpperCase()}
                </div>
                <div className="ml-3">
                  <div className="text-sm font-medium">{user?.username}</div>
                  <div className="text-xs text-gray-400">Logged in</div>
                </div>
              </div>

              {/* Apps List */}
              <div className="p-2">
                <div className="text-xs text-gray-400 px-2 py-1">Applications</div>
                {apps.map((app, index) => (
                  <div
                    key={index}
                    className="flex items-center px-3 py-2 rounded hover:bg-gray-800 cursor-pointer"
                    onClick={() => openApp(app)}
                  >
                    <div className="w-6 h-6 flex items-center justify-center bg-blue-700 rounded mr-3">{app.icon}</div>
                    <span className="text-sm">{app.title}</span>
                  </div>
                ))}
              </div>

              {/* System Actions */}
              <div className="border-t border-gray-700 p-2">
                <div
                  className="flex items-center px-3 py-2 rounded hover:bg-gray-800 cursor-pointer"
                  onClick={onLogout}
                >
                  <LogOut className="h-5 w-5 mr-3 text-gray-400" />
                  <span className="text-sm">Log out</span>
                </div>
                <div
                  className="flex items-center px-3 py-2 rounded hover:bg-gray-800 cursor-pointer"
                  onClick={onRestart}
                >
                  <RefreshCw className="h-5 w-5 mr-3 text-gray-400" />
                  <span className="text-sm">Restart</span>
                </div>
                <div
                  className="flex items-center px-3 py-2 rounded hover:bg-gray-800 cursor-pointer"
                  onClick={onShutdown}
                >
                  <Power className="h-5 w-5 mr-3 text-gray-400" />
                  <span className="text-sm">Shut down</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Open Apps */}
        <div className="flex-1 flex items-center ml-4 space-x-1">
          {openApps.map((app) => (
            <div
              key={app.id}
              className={`flex items-center px-3 py-1 rounded cursor-pointer
                        ${activeAppId === app.id ? "bg-gray-700" : "hover:bg-gray-800"}`}
              onClick={() => bringToFront(app.id)}
            >
              {app.icon}
              <span className="ml-2 text-xs">{app.title}</span>
            </div>
          ))}
        </div>

        {/* System Tray */}
        <div className="flex items-center space-x-4">
          <Search className="h-4 w-4 text-gray-400" />
          <div className="relative" ref={systemMenuRef}>
            <div
              className="flex items-center space-x-4 px-2 py-1 rounded hover:bg-gray-800 cursor-pointer"
              onClick={() => setIsSystemMenuOpen(!isSystemMenuOpen)}
            >
              <Wifi className="h-4 w-4 text-gray-400" />
              <Volume2 className="h-4 w-4 text-gray-400" />
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-gray-400 mr-1" />
                <span className="text-xs">{time.toLocaleTimeString()}</span>
              </div>
            </div>

            {/* System Menu */}
            {isSystemMenuOpen && (
              <div className="absolute bottom-12 right-0 w-80 bg-gray-900 border border-gray-700 rounded-lg shadow-xl p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-medium">System Controls</h3>
                  <div className="text-xs text-gray-400">
                    {time.toLocaleDateString()} {time.toLocaleTimeString()}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs">Volume</span>
                      <Volume2 className="h-4 w-4 text-gray-400" />
                    </div>
                    <input type="range" className="w-full" />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs">Brightness</span>
                      <span className="text-xs">100%</span>
                    </div>
                    <input type="range" className="w-full" value="100" />
                  </div>

                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <Wifi className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-xs">Connected</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-xs">{time.toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
