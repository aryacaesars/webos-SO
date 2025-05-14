import Header from "./sections/navbar";
import Hero from "./sections/hero";
import Features from "./sections/features";
import Footer from "./sections/footer";
import AboutWebos from "./sections/about-webos";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-[#111827] text-[#F4F4F9]">
      <div className=" bg-[#1F2937] relative w-full overflow-hidden text-white">
        {/* Abstract animated blobs */}
        <div className="absolute -top-32 -left-32 w-[400px] h-[400px] rounded-full bg-[#1E91D6] opacity-70 blur-3xl animate-blob z-0" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-[#7F3CF0] opacity-70 blur-3xl animate-blob animation-delay-2000 z-0" />
        <div className="absolute bottom-0 left-1/2 w-[300px] h-[300px] rounded-full bg-[#4F46E5] opacity-60 blur-2xl animate-blob animation-delay-4000 z-0" />

        {/* Header */}
        <Header />

        {/* Hero */}
        <Hero />
      </div>

      {/* Features */}
      <Features />

      {/* About */}
      <AboutWebos />

      {/* Footer */}
      <Footer />
    </main>
  );
}
