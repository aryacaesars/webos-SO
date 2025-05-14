"use client"

import { FileSystemProvider } from "@/lib/use-file-system"

export function Providers({ children }) {
  return <FileSystemProvider>{children}</FileSystemProvider>
}
