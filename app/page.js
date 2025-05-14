import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Terminal, Shield, Layers } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-[#111827] text-[#F4F4F9]">
      <div className=" bg-[#1F2937] relative w-full overflow-hidden text-white">
        {/* Abstract animated blobs */}
        <div className="absolute -top-32 -left-32 w-[400px] h-[400px] rounded-full bg-[#1E91D6] opacity-70 blur-3xl animate-blob z-0" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-[#7F3CF0] opacity-70 blur-3xl animate-blob animation-delay-2000 z-0" />
        <div className="absolute bottom-0 left-1/2 w-[300px] h-[300px] rounded-full bg-[#4F46E5] opacity-60 blur-2xl animate-blob animation-delay-4000 z-0" />

        {/* Header */}
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

        {/* Hero */}
        <section className="relative w-full py-20 overflow-hidden text-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold sm:text-5xl xl:text-6xl/none">
                  Experience Linux on the Web
                </h1>
                <p className="max-w-[600px] text-white/90 md:text-xl">
                  WeBOS is a web-based operating system simulation that lets you
                  experience Linux KDE Plasma right in your browser. Complete
                  with a working terminal, file system, and desktop environment.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link
                    href="/simulation"
                    className="shadow transition inline-flex h-12 items-center justify-center rounded-md bg-gradient-to-r from-[#1E91D6] to-[#7F3CF0] px-8 text-sm font-medium text-white hover:brightness-110"
                  >
                    Try Simulation
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                  <Link
                    href="#features"
                    className="inline-flex h-12 items-center justify-center rounded-md border border-white bg-transparent px-8 text-sm font-medium text-white hover:bg-white hover:text-[#7F3CF0]"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="relative h-[300px] w-full overflow-hidden rounded-xl shadow-lg md:h-[400px]">
                  <Image
                    src="/assets/img/image-hero.png"
                    alt="WeBOS Desktop Preview"
                    width={600}
                    height={400}
                    className="h-full w-full object-cover rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Features */}
      <section id="features" className="w-full py-20 bg-[#111827]">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold sm:text-5xl mb-4">Features</h2>
          <p className="text-[#CBD5E1] mb-12">
            Explore the capabilities of our web-based operating system
            simulation
          </p>
          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            {[
              {
                icon: <Terminal className="h-6 w-6" />,
                title: "Working Terminal",
                description:
                  "Use real bash commands like mkdir, cd, chmod, cat, and more directly in your browser.",
              },
              {
                icon: <Layers className="h-6 w-6" />,
                title: "KDE Plasma Interface",
                description:
                  "Experience the look and feel of Linux KDE Plasma desktop environment with panels, widgets, and applications.",
              },
              {
                icon: <Shield className="h-6 w-6" />,
                title: "Boot Process",
                description:
                  "Complete boot sequence with GRUB menu, kernel selection, and login screen for an authentic experience.",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-[#1F2937] p-6 rounded-lg shadow text-left"
              >
                <div className="flex items-center justify-center w-12 h-12 mb-4 rounded bg-gradient-to-r from-[#1E91D6] to-[#7F3CF0] text-white">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-[#CBD5E1]">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="w-full py-20 bg-[#111827]">
        <div className="container mx-auto px-4 md:px-6 grid gap-8 lg:grid-cols-2 items-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold sm:text-4xl">About WeBOS</h2>
            <p className="text-[#CBD5E1] max-w-[600px]">
              WeBOS is an educational project designed to help people learn
              about Linux operating systems in an interactive way. Our
              simulation provides a realistic experience of using a Linux
              desktop environment without having to install anything.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Why WeBOS?</h3>
            <p className="text-[#CBD5E1]">
              Whether youre a student, developer, or just curious about Linux,
              WeBOS provides a safe, accessible environment to explore and
              learn.
            </p>
            <Link
              href="/simulation"
              className="inline-flex mt-4 h-12 items-center justify-center rounded-md bg-gradient-to-r from-[#1E91D6] to-[#7F3CF0] px-8 text-sm font-medium text-white hover:brightness-110"
            >
              Start Simulation
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-6 bg-[#1F2937] text-[#CBD5E1]">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-center md:text-left">
            © {new Date().getFullYear()} WeBOS. All rights reserved.
          </p>
          <div className="flex gap-4">
            {["Terms", "Privacy", "Contact"].map((text, i) => (
              <Link
                key={i}
                href="#"
                className="text-sm hover:text-[#7F3CF0] hover:underline underline-offset-4"
              >
                {text}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}
