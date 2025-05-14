import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function AboutWebos() {
  return (
    <section id="about" className="w-full py-20 bg-[#111827]">
      <div className="container mx-auto px-4 md:px-6 grid gap-8 lg:grid-cols-2 items-center">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold sm:text-4xl">About WeBOS</h2>
          <p className="text-[#CBD5E1] max-w-[600px]">
            WeBOS is an educational project designed to help people learn about
            Linux operating systems in an interactive way. Our simulation
            provides a realistic experience of using a Linux desktop environment
            without having to install anything.
          </p>
        </div>
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Why WeBOS?</h3>
          <p className="text-[#CBD5E1]">
            Whether youre a student, developer, or just curious about Linux,
            WeBOS provides a safe, accessible environment to explore and learn.
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
  );
}
