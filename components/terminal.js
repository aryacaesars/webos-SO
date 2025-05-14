"use client"

import { useState, useEffect, useRef } from "react"
import { useFileSystem } from "@/lib/use-file-system"

export default function Terminal() {
  const [input, setInput] = useState("")
  const [history, setHistory] = useState([])
  const [commandHistory, setCommandHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const inputRef = useRef(null)
  const terminalRef = useRef(null)
  const {
    currentDirectory,
    setCurrentDirectory,
    fileSystem,
    createDirectory,
    createFile,
    deleteItem,
    readFile,
    writeFile,
    changePermissions,
  } = useFileSystem()

  useEffect(() => {
    // Focus input when terminal is clicked
    const handleClick = () => {
      inputRef.current?.focus()
    }

    terminalRef.current?.addEventListener("click", handleClick)

    // Initial welcome message
    setHistory([
      { type: "output", content: "WeBOS Terminal v1.0" },
      { type: "output", content: 'Type "help" for a list of commands.' },
    ])

    return () => {
      terminalRef.current?.removeEventListener("click", handleClick)
    }
  }, [])

  useEffect(() => {
    // Scroll to bottom when history changes
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [history])

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleCommand()
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      navigateHistory(-1)
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      navigateHistory(1)
    } else if (e.key === "Tab") {
      e.preventDefault()
      handleTabCompletion()
    }
  }

  const navigateHistory = (direction) => {
    if (commandHistory.length === 0) return

    const newIndex = historyIndex + direction
    if (newIndex >= -1 && newIndex < commandHistory.length) {
      setHistoryIndex(newIndex)
      if (newIndex === -1) {
        setInput("")
      } else {
        setInput(commandHistory[newIndex])
      }
    }
  }

  const handleTabCompletion = () => {
    if (!input) return

    const args = input.split(" ")
    if (args.length <= 1) return

    const lastArg = args[args.length - 1]
    if (!lastArg) return

    // Get current directory contents
    const dirContents = getDirectoryContents(currentDirectory)

    // Find matches
    const matches = dirContents.filter((item) => item.name.startsWith(lastArg) && item.name !== lastArg)

    if (matches.length === 1) {
      // Complete with the only match
      args[args.length - 1] = matches[0].name
      setInput(args.join(" "))
    } else if (matches.length > 1) {
      // Show possible completions
      addToHistory({ type: "output", content: matches.map((m) => m.name).join("  ") })
    }
  }

  const handleCommand = () => {
    if (!input.trim()) return

    // Add command to history
    addToHistory({ type: "command", content: `${currentDirectory}$ ${input}` })

    // Add to command history for up/down navigation
    setCommandHistory([input, ...commandHistory])
    setHistoryIndex(-1)

    // Parse command
    const args = input.split(" ")
    const command = args[0].toLowerCase()

    // Execute command
    executeCommand(command, args.slice(1))

    // Clear input
    setInput("")
  }

  const addToHistory = (entry) => {
    setHistory((prev) => [...prev, entry])
  }

  const executeCommand = (command, args) => {
    switch (command) {
      case "help":
        showHelp()
        break
      case "ls":
        listDirectory(args)
        break
      case "cd":
        changeDirectory(args[0])
        break
      case "pwd":
        printWorkingDirectory()
        break
      case "mkdir":
        makeDirectory(args[0])
        break
      case "touch":
        touchFile(args[0])
        break
      case "rm":
        removeItem(args)
        break
      case "cat":
        concatenateFile(args[0])
        break
      case "echo":
        echoCommand(args)
        break
      case "chmod":
        chmodCommand(args)
        break
      case "clear":
        clearTerminal()
        break
      case "whoami":
        addToHistory({ type: "output", content: "user" })
        break
      case "date":
        addToHistory({ type: "output", content: new Date().toString() })
        break
      case "uname":
        addToHistory({ type: "output", content: "WeBOS 1.0" })
        break
      default:
        addToHistory({ type: "error", content: `Command not found: ${command}` })
    }
  }

  const showHelp = () => {
    const helpText = [
      "Available commands:",
      "help - Show this help message",
      "ls [dir] - List directory contents",
      "cd [dir] - Change directory",
      "pwd - Print working directory",
      "mkdir <dir> - Create a directory",
      "touch <file> - Create a file",
      "rm [-r] <file/dir> - Remove a file or directory",
      "cat <file> - Display file contents",
      "echo <text> [> file] - Display text or write to file",
      "chmod <permissions> <file> - Change file permissions",
      "clear - Clear the terminal",
      "whoami - Display current user",
      "date - Display current date and time",
      "uname - Display system information",
    ]

    helpText.forEach((line) => {
      addToHistory({ type: "output", content: line })
    })
  }

  const listDirectory = (args) => {
    const path = args[0] || currentDirectory
    const dirContents = getDirectoryContents(path)

    if (!dirContents) {
      addToHistory({ type: "error", content: `ls: cannot access '${path}': No such file or directory` })
      return
    }

    if (dirContents.length === 0) {
      addToHistory({ type: "output", content: "" })
      return
    }

    // Format output
    const output = dirContents
      .map((item) => {
        const color = item.type === "directory" ? "text-blue-400" : "text-white"
        const permissions = item.permissions || "rw-r--r--"
        return `<span class="${color}">${permissions} ${item.name}${item.type === "directory" ? "/" : ""}</span>`
      })
      .join("  ")

    addToHistory({ type: "output", content: output, isHTML: true })
  }

  const getDirectoryContents = (path) => {
    // Handle absolute and relative paths
    const targetPath = resolvePath(path)

    // Navigate the file system to find the target directory
    let current = fileSystem
    const parts = targetPath.split("/").filter(Boolean)

    for (const part of parts) {
      if (!current[part] || current[part].type !== "directory") {
        return null
      }
      current = current[part].contents
    }

    // Return directory contents as array
    return Object.entries(current).map(([name, item]) => ({
      name,
      type: item.type,
      permissions: item.permissions,
    }))
  }

  const resolvePath = (path) => {
    if (!path) return currentDirectory

    if (path.startsWith("/")) {
      return path
    }

    // Handle . and ..
    const parts = path.split("/")
    const currentParts = currentDirectory.split("/").filter(Boolean)

    for (const part of parts) {
      if (part === ".") {
        continue
      } else if (part === "..") {
        if (currentParts.length > 0) {
          currentParts.pop()
        }
      } else {
        currentParts.push(part)
      }
    }

    return "/" + currentParts.join("/")
  }

  const changeDirectory = (path) => {
    if (!path) {
      setCurrentDirectory("/")
      return
    }

    const targetPath = resolvePath(path)

    // Check if directory exists
    let current = fileSystem
    const parts = targetPath.split("/").filter(Boolean)

    for (const part of parts) {
      if (!current[part] || current[part].type !== "directory") {
        addToHistory({ type: "error", content: `cd: ${path}: No such file or directory` })
        return
      }
      current = current[part].contents
    }

    setCurrentDirectory(targetPath)
  }

  const printWorkingDirectory = () => {
    addToHistory({ type: "output", content: currentDirectory })
  }

  const makeDirectory = (dirName) => {
    if (!dirName) {
      addToHistory({ type: "error", content: "mkdir: missing operand" })
      return
    }

    try {
      createDirectory(dirName)
      addToHistory({ type: "output", content: "" })
    } catch (error) {
      addToHistory({ type: "error", content: `mkdir: cannot create directory '${dirName}': ${error.message}` })
    }
  }

  const touchFile = (fileName) => {
    if (!fileName) {
      addToHistory({ type: "error", content: "touch: missing file operand" })
      return
    }

    try {
      createFile(fileName, "")
      addToHistory({ type: "output", content: "" })
    } catch (error) {
      addToHistory({ type: "error", content: `touch: cannot touch '${fileName}': ${error.message}` })
    }
  }

  const removeItem = (args) => {
    if (args.length === 0) {
      addToHistory({ type: "error", content: "rm: missing operand" })
      return
    }

    const recursive = args[0] === "-r"
    const target = recursive ? args[1] : args[0]

    if (!target) {
      addToHistory({ type: "error", content: "rm: missing operand" })
      return
    }

    try {
      deleteItem(target, recursive)
      addToHistory({ type: "output", content: "" })
    } catch (error) {
      addToHistory({ type: "error", content: `rm: cannot remove '${target}': ${error.message}` })
    }
  }

  const concatenateFile = (fileName) => {
    if (!fileName) {
      addToHistory({ type: "error", content: "cat: missing file operand" })
      return
    }

    try {
      const content = readFile(fileName)
      addToHistory({ type: "output", content })
    } catch (error) {
      addToHistory({ type: "error", content: `cat: ${fileName}: ${error.message}` })
    }
  }

  const echoCommand = (args) => {
    if (args.length === 0) {
      addToHistory({ type: "output", content: "" })
      return
    }

    // Check for redirection
    const redirectIndex = args.indexOf(">")

    if (redirectIndex === -1) {
      // No redirection, just echo
      addToHistory({ type: "output", content: args.join(" ") })
    } else {
      // Redirection to file
      const text = args.slice(0, redirectIndex).join(" ")
      const fileName = args[redirectIndex + 1]

      if (!fileName) {
        addToHistory({ type: "error", content: "echo: missing file operand after >" })
        return
      }

      try {
        writeFile(fileName, text)
        addToHistory({ type: "output", content: "" })
      } catch (error) {
        addToHistory({ type: "error", content: `echo: ${error.message}` })
      }
    }
  }

  const chmodCommand = (args) => {
    if (args.length < 2) {
      addToHistory({ type: "error", content: "chmod: missing operand" })
      return
    }

    const permissions = args[0]
    const fileName = args[1]

    try {
      changePermissions(fileName, permissions)
      addToHistory({ type: "output", content: "" })
    } catch (error) {
      addToHistory({ type: "error", content: `chmod: ${error.message}` })
    }
  }

  const clearTerminal = () => {
    setHistory([])
  }

  return (
    <div ref={terminalRef} className="h-full bg-black text-green-500 font-mono text-sm p-4 overflow-auto">
      {/* Terminal History */}
      <div className="space-y-1">
        {history.map((entry, index) => (
          <div key={index} className={`${entry.type === "error" ? "text-red-500" : ""}`}>
            {entry.isHTML ? <div dangerouslySetInnerHTML={{ __html: entry.content }} /> : entry.content}
          </div>
        ))}
      </div>

      {/* Current Input Line */}
      <div className="flex mt-1">
        <span>{currentDirectory}$&nbsp;</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent outline-none border-none"
          autoFocus
        />
      </div>
    </div>
  )
}
