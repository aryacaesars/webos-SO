import Link from "next/link";
import { Terminal } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-transparent backdrop-blur">
      <div className="container flex h-16 items-center justify-between mx-auto">
        <Link href="/" className="flex items-center space-x-2">
          <Terminal className="h-6 w-6 text-[#7F3CF0]" />
          <span className="font-bold text-[#F4F4F9]">WeBOS</span>
        </Link>
        <nav className="flex items-center gap-8">
          <Link
            href="#features"
            className="text-sm font-medium text-[#F4F4F9] hover:text-[#7F3CF0] hover:underline underline-offset-4"
          >
            Features
          </Link>
          <Link
            href="#about"
            className="text-sm font-medium text-[#F4F4F9] hover:text-[#7F3CF0] hover:underline underline-offset-4"
          >
            About
          </Link>
          <Link
            href="/simulation"
            className="rounded-md bg-gradient-to-r from-[#1E91D6] to-[#7F3CF0] px-4 py-2 text-sm font-medium text-white hover:brightness-110"
          >
            Try Now
          </Link>
        </nav>
      </div>
    </header>
  );
}
