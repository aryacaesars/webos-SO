import Link from "next/link";
import { Github } from "lucide-react";

export default function AboutUs() {
  return (
    <section id="about-us" className="w-full py-20 bg-[#1F2937]">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-bold sm:text-4xl text-center mb-8">
          About Us
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
          {[
            {
              nama: "Fatra Dika Herdiyanti",
              npm: "237006049",
              github: "https://github.com/fatradika",
            },
            {
              nama: "Fadhil Gani",
              npm: "237006082",
              github: "https://github.com/padiil",
            },
            {
              nama: "Rafli Putra Nursyabani",
              npm: "237006083",
              github: "https://github.com/Rafliputra237006083",
            },
            {
              nama: "Arya Achmad Caesar",
              npm: "237006093",
              github: "https://github.com/aryacaesars",
            },
          ].map((member, idx) => (
            <div
              key={idx}
              className="bg-[#111827] p-6 rounded-lg shadow text-center relative min-h-[180px]"
            >
              <h3 className="text-xl font-bold text-[#F4F4F9] mb-1">
                {member.nama}
              </h3>
              <div className="absolute bottom-6 left-0 right-0">
                <p className="text-[#7F3CF0] font-medium mb-1">{member.npm}</p>
                <div className="border-t border-[#1F2937] mb-4"></div>
                <div className="flex justify-center">
                  <Link
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#F4F4F9] hover:text-[#7F3CF0] transition"
                    aria-label={`GitHub ${member.nama}`}
                  >
                    <Github className="w-7 h-7" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
