"use client"

import { useState } from "react"
import { Folder, File, ChevronRight, ChevronDown } from "lucide-react"
import { useFileSystem } from "@/lib/use-file-system"

export default function FileExplorer() {
  const { fileSystem } = useFileSystem()
  const [expandedFolders, setExpandedFolders] = useState({
    "/": true,
    "/home": true,
  })

  const toggleFolder = (path) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [path]: !prev[path],
    }))
  }

  const renderFileSystem = (contents, path = "", level = 0) => {
    return Object.entries(contents).map(([name, item]) => {
      const fullPath = `${path}/${name}`.replace(/\/+/g, "/")

      if (item.type === "directory") {
        const isExpanded = expandedFolders[fullPath]

        return (
          <div key={fullPath} style={{ marginLeft: `${level * 16}px` }}>
            <div
              className="flex items-center py-1 px-2 hover:bg-gray-800 cursor-pointer"
              onClick={() => toggleFolder(fullPath)}
            >
              {isExpanded ? <ChevronDown className="h-4 w-4 mr-1" /> : <ChevronRight className="h-4 w-4 mr-1" />}
              <Folder className="h-4 w-4 text-blue-400 mr-2" />
              <span>{name}</span>
            </div>

            {isExpanded && item.contents && <div>{renderFileSystem(item.contents, fullPath, level + 1)}</div>}
          </div>
        )
      } else {
        return (
          <div
            key={fullPath}
            className="flex items-center py-1 px-2 hover:bg-gray-800 cursor-pointer"
            style={{ marginLeft: `${(level + 1) * 16}px` }}
          >
            <File className="h-4 w-4 text-gray-400 mr-2" />
            <span>{name}</span>
          </div>
        )
      }
    })
  }

  return (
    <div className="h-full bg-gray-900 text-white p-2 overflow-auto">
      <div className="mb-4 p-2 border-b border-gray-700">
        <h2 className="text-lg font-medium">File Explorer</h2>
      </div>

      <div>{renderFileSystem(fileSystem)}</div>
    </div>
  )
}
