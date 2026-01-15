import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Testimonials from "@/components/Testimonials";

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-black overflow-x-hidden">
      <Hero />
      <Features />
      <Testimonials />
    </main>
  );
}
