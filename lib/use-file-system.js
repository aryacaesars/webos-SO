"use client"

import { useState, useEffect, createContext, useContext } from "react"

// Create a context for the file system
const FileSystemContext = createContext()

// Initial file system structure
const initialFileSystem = {
  bin: {
    type: "directory",
    permissions: "rwxr-xr-x",
    contents: {
      bash: { type: "file", permissions: "rwxr-xr-x", content: "#!/bin/bash" },
      ls: { type: "file", permissions: "rwxr-xr-x", content: "#!/bin/bash" },
      cat: { type: "file", permissions: "rwxr-xr-x", content: "#!/bin/bash" },
    },
  },
  etc: {
    type: "directory",
    permissions: "rwxr-xr-x",
    contents: {
      passwd: {
        type: "file",
        permissions: "rw-r--r--",
        content: "root:x:0:0:root:/root:/bin/bash\nuser:x:1000:1000:user:/home/user:/bin/bash",
      },
      hosts: { type: "file", permissions: "rw-r--r--", content: "127.0.0.1 localhost\n::1 localhost" },
    },
  },
  home: {
    type: "directory",
    permissions: "rwxr-xr-x",
    contents: {
      user: {
        type: "directory",
        permissions: "rwxr-xr-x",
        contents: {
          Documents: {
            type: "directory",
            permissions: "rwxr-xr-x",
            contents: {
              "welcome.txt": {
                type: "file",
                permissions: "rw-r--r--",
                content: "Welcome to WeBOS!\n\nThis is a web-based operating system simulation.",
              },
            },
          },
          Pictures: {
            type: "directory",
            permissions: "rwxr-xr-x",
            contents: {},
          },
          Downloads: {
            type: "directory",
            permissions: "rwxr-xr-x",
            contents: {},
          },
          ".bashrc": { type: "file", permissions: "rw-r--r--", content: "# .bashrc file\nexport PATH=$PATH:/bin" },
        },
      },
    },
  },
  usr: {
    type: "directory",
    permissions: "rwxr-xr-x",
    contents: {
      bin: {
        type: "directory",
        permissions: "rwxr-xr-x",
        contents: {},
      },
      lib: {
        type: "directory",
        permissions: "rwxr-xr-x",
        contents: {},
      },
    },
  },
  var: {
    type: "directory",
    permissions: "rwxr-xr-x",
    contents: {
      log: {
        type: "directory",
        permissions: "rwxr-xr-x",
        contents: {
          "system.log": {
            type: "file",
            permissions: "rw-r--r--",
            content: "System started at " + new Date().toString(),
          },
        },
      },
    },
  },
}

// Provider component
export function FileSystemProvider({ children }) {
  const [fileSystem, setFileSystem] = useState(initialFileSystem)
  const [currentDirectory, setCurrentDirectory] = useState("/home/user")

  // Load file system from localStorage if available
  useEffect(() => {
    const savedFileSystem = localStorage.getItem("webos-filesystem")
    if (savedFileSystem) {
      try {
        setFileSystem(JSON.parse(savedFileSystem))
      } catch (error) {
        console.error("Error loading file system:", error)
      }
    }
  }, [])

  // Save file system to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("webos-filesystem", JSON.stringify(fileSystem))
  }, [fileSystem])

  // Helper function to navigate the file system
  const navigateToPath = (path) => {
    const parts = path.split("/").filter(Boolean)
    let current = fileSystem

    for (const part of parts) {
      if (!current[part] || current[part].type !== "directory") {
        throw new Error(`No such file or directory: ${path}`)
      }
      current = current[part].contents
    }

    return current
  }

  // Helper function to get parent directory and filename
  const getParentAndName = (path) => {
    const parts = path.split("/").filter(Boolean)
    const name = parts.pop()
    const parentPath = "/" + parts.join("/")

    return { parentPath, name }
  }

  // Create a directory
  const createDirectory = (path) => {
    const fullPath = path.startsWith("/") ? path : `${currentDirectory}/${path}`
    const { parentPath, name } = getParentAndName(fullPath)

    try {
      const parent = navigateToPath(parentPath)

      if (parent[name]) {
        throw new Error("File exists")
      }

      setFileSystem((prev) => {
        const newFileSystem = JSON.parse(JSON.stringify(prev))
        let current = newFileSystem

        // Navigate to parent directory
        const parts = parentPath.split("/").filter(Boolean)
        for (const part of parts) {
          current = current[part].contents
        }

        // Create new directory
        current[name] = {
          type: "directory",
          permissions: "rwxr-xr-x",
          contents: {},
        }

        return newFileSystem
      })
    } catch (error) {
      throw error
    }
  }

  // Create a file
  const createFile = (path, content = "") => {
    const fullPath = path.startsWith("/") ? path : `${currentDirectory}/${path}`
    const { parentPath, name } = getParentAndName(fullPath)

    try {
      const parent = navigateToPath(parentPath)

      setFileSystem((prev) => {
        const newFileSystem = JSON.parse(JSON.stringify(prev))
        let current = newFileSystem

        // Navigate to parent directory
        const parts = parentPath.split("/").filter(Boolean)
        for (const part of parts) {
          current = current[part].contents
        }

        // Create or update file
        current[name] = {
          type: "file",
          permissions: "rw-r--r--",
          content,
        }

        return newFileSystem
      })
    } catch (error) {
      throw error
    }
  }

  // Delete a file or directory
  const deleteItem = (path, recursive = false) => {
    const fullPath = path.startsWith("/") ? path : `${currentDirectory}/${path}`
    const { parentPath, name } = getParentAndName(fullPath)

    try {
      const parent = navigateToPath(parentPath)

      if (!parent[name]) {
        throw new Error("No such file or directory")
      }

      if (parent[name].type === "directory" && !recursive) {
        throw new Error("Is a directory")
      }

      setFileSystem((prev) => {
        const newFileSystem = JSON.parse(JSON.stringify(prev))
        let current = newFileSystem

        // Navigate to parent directory
        const parts = parentPath.split("/").filter(Boolean)
        for (const part of parts) {
          current = current[part].contents
        }

        // Delete item
        delete current[name]

        return newFileSystem
      })
    } catch (error) {
      throw error
    }
  }

  // Read a file
  const readFile = (path) => {
    const fullPath = path.startsWith("/") ? path : `${currentDirectory}/${path}`
    const { parentPath, name } = getParentAndName(fullPath)

    try {
      const parent = navigateToPath(parentPath)

      if (!parent[name]) {
        throw new Error("No such file or directory")
      }

      if (parent[name].type !== "file") {
        throw new Error("Is a directory")
      }

      return parent[name].content
    } catch (error) {
      throw error
    }
  }

  // Write to a file
  const writeFile = (path, content) => {
    const fullPath = path.startsWith("/") ? path : `${currentDirectory}/${path}`
    const { parentPath, name } = getParentAndName(fullPath)

    try {
      const parent = navigateToPath(parentPath)

      if (parent[name] && parent[name].type !== "file") {
        throw new Error("Is a directory")
      }

      setFileSystem((prev) => {
        const newFileSystem = JSON.parse(JSON.stringify(prev))
        let current = newFileSystem

        // Navigate to parent directory
        const parts = parentPath.split("/").filter(Boolean)
        for (const part of parts) {
          current = current[part].contents
        }

        // Create or update file
        if (current[name]) {
          current[name].content = content
        } else {
          current[name] = {
            type: "file",
            permissions: "rw-r--r--",
            content,
          }
        }

        return newFileSystem
      })
    } catch (error) {
      throw error
    }
  }

  // Change file permissions
  const changePermissions = (path, permissions) => {
    const fullPath = path.startsWith("/") ? path : `${currentDirectory}/${path}`
    const { parentPath, name } = getParentAndName(fullPath)

    try {
      const parent = navigateToPath(parentPath)

      if (!parent[name]) {
        throw new Error("No such file or directory")
      }

      setFileSystem((prev) => {
        const newFileSystem = JSON.parse(JSON.stringify(prev))
        let current = newFileSystem

        // Navigate to parent directory
        const parts = parentPath.split("/").filter(Boolean)
        for (const part of parts) {
          current = current[part].contents
        }

        // Update permissions
        current[name].permissions = permissions

        return newFileSystem
      })
    } catch (error) {
      throw error
    }
  }

  return (
    <FileSystemContext.Provider
      value={{
        fileSystem,
        currentDirectory,
        setCurrentDirectory,
        createDirectory,
        createFile,
        deleteItem,
        readFile,
        writeFile,
        changePermissions,
      }}
    >
      {children}
    </FileSystemContext.Provider>
  )
}

// Custom hook to use the file system
export function useFileSystem() {
  const context = useContext(FileSystemContext)
  if (!context) {
    throw new Error("useFileSystem must be used within a FileSystemProvider")
  }
  return context
}
