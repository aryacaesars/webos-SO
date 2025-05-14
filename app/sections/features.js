import { Terminal, Shield, Layers } from "lucide-react";

export default function Features() {
  return (
    <section id="features" className="w-full py-20 bg-[#111827]">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <h2 className="text-3xl font-bold sm:text-5xl mb-4">Features</h2>
        <p className="text-[#CBD5E1] mb-12">
          Explore the capabilities of our web-based operating system simulation
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
  );
}
