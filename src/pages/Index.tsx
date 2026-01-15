import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HomeVideoBackground } from "@/components/home/HomeVideoBackground";
import { HomeHero } from "@/components/home/HomeHero";
import { FeaturedEvents } from "@/components/home/FeaturedEvents";
import { WhyLilyNex } from "@/components/home/WhyLilyNex";
import { memo } from "react";

const Index = memo(() => {
  return (
    <div className="min-h-screen bg-background">
      <HomeVideoBackground />
      <Navbar />
      
      <main className="relative z-10">
        <HomeHero />
        <FeaturedEvents />
        <WhyLilyNex />
      </main>
      
      <Footer />
    </div>
  );
});

Index.displayName = 'Index';

export default Index;
