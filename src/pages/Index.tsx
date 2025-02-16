
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { Certifications } from "@/components/Certifications";
import { Projects } from "@/components/Projects";
import { Contact } from "@/components/Contact";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <Services />
      <Certifications />
      <Projects />
      <Contact />
    </div>
  );
};

export default Index;
