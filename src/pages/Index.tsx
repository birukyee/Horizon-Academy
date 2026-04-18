import Navbar from "@/components/site/Navbar";
import Hero from "@/components/site/Hero";
import About from "@/components/site/About";
import Programs from "@/components/site/Programs";
import Gallery from "@/components/site/Gallery";
import News from "@/components/site/News";
import Contact from "@/components/site/Contact";
import Footer from "@/components/site/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Programs />
        <Gallery />
        <News />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
