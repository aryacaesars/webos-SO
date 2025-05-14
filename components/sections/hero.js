import Link from "next/link";
import { ArrowRight, Terminal, Shield, Layers } from "lucide-react";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative w-full py-20 overflow-hidden text-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold sm:text-5xl xl:text-6xl/none">
              Experience Linux on the Web
            </h1>
            <p className="max-w-[600px] text-white/90 md:text-xl">
              WeBOS is a web-based operating system simulation that lets you
              experience Linux KDE Plasma right in your browser. Complete with a
              working terminal, file system, and desktop environment.
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
  );
}
