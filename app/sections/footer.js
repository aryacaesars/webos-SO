import Link from "next/link";

export default function Footer() {
  return (
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
  );
}
