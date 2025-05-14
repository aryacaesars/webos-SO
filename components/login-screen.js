"use client"

import { useState } from "react"
import { User, Lock } from "lucide-react"

export default function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState("user")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!username || !password) {
      setError("Please enter both username and password")
      return
    }

    // In a real app, you'd validate credentials against a database
    // For this demo, we'll accept any username with password "password"
    if (password === "password") {
      onLogin(username, password)
    } else {
      setError('Invalid credentials. Try password: "password"')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-900 to-black">
      <div className="w-full max-w-md p-8 space-y-8 bg-black bg-opacity-50 backdrop-blur-sm rounded-lg shadow-2xl border border-gray-800">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">WeBOS</h1>
          <p className="mt-2 text-gray-400">Please sign in</p>
        </div>

        {error && <div className="p-3 bg-red-900 bg-opacity-50 text-red-200 rounded-md text-sm">{error}</div>}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div className="flex items-center border-b border-gray-700 py-2">
              <User className="h-5 w-5 text-gray-400 mr-2" />
              <input
                id="username"
                name="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="appearance-none bg-transparent border-none w-full text-white placeholder-gray-500 focus:outline-none focus:ring-0"
                placeholder="Username"
              />
            </div>

            <div className="flex items-center border-b border-gray-700 py-2">
              <Lock className="h-5 w-5 text-gray-400 mr-2" />
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none bg-transparent border-none w-full text-white placeholder-gray-500 focus:outline-none focus:ring-0"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign in
            </button>
          </div>

          <div className="text-center text-xs text-gray-400">
            <p>Hint: Use "password" as the password</p>
          </div>
        </form>
      </div>
    </div>
  )
}
