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

{/* About us */}
<section id="about us" className="w-full py-20 bg-[#111827]">
  <div className="container mx-auto px-4 md:px-6">
    <h2 className="text-3xl font-bold sm:text-4xl text-center mb-8">About Us</h2>
    <p className="text-[#CBD5E1] max-w-[800px] mx-auto text-center mb-12">
      WeBOS is an educational project crafted by a passionate team of four innovators dedicated to making Linux accessible and engaging. Our simulation brings the Linux KDE Plasma experience to your browser, fostering learning and exploration without the need for installation.
    </p>
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
      {[
        {
          nama: "Fatra Dika Herdiyanti",
          npm: "237006049",
          
        },
        {
          nama: "Fadhil Gani",
          npm: "237006082",
          
        },
        {
          nama: "Rafli Putra Nursyabani",
          npm: "237006083",
          
        },
        {
          nama: "Arya Achmad Caesar",
          npm: "237006093",
          
        },
      ].map((member, idx) => (
        <div key={idx} className="bg-[#1F2937] p-6 rounded-lg shadow text-center">
          <h3 className="text-xl font-bold text-[#F4F4F9] mb-2">{member.nama}</h3>
          <p className="text-[#7F3CF0] font-medium mb-2">{member.npm}</p>
          <p className="text-[#CBD5E1] text-sm">{member.description}</p>
        </div>
      ))}
    </div>

  </div>
</section>

      {/* About */}
      <AboutWebos />

      {/* Footer */}
      <Footer />
    </main>
  );
}
